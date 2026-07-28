import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base
from app.db.session import get_db
from app.db.models import CriterionReadiness, Document, NAACBenchmark

from sqlalchemy.pool import StaticPool

# Use an in-memory SQLite database for the duration of tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Apply the dependency override
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(name="client")
def client_fixture():
    # Setup: Create tables
    Base.metadata.create_all(bind=engine)
    client = TestClient(app)
    
    # Reset/seed the test database
    client.post("/api/v1/dashboard/reset")
    
    yield client
    
    # Teardown: Clean tables
    Base.metadata.drop_all(bind=engine)

def test_get_dashboard_initial_seeded_state(client):
    """
    Test GET /api/v1/dashboard returns the expected response schema and seeded figures.
    """
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    
    data = response.json()
    assert "overall_readiness" in data
    assert "criteria_readiness" in data
    assert "document_metrics" in data
    assert "recommendations" in data
    
    # Seed values: criterion1 = 85, criterion2 = 58, criterion3 = 90
    # Average = (85 + 58 + 90) / 3 = 77.67 (rounds to 78)
    assert data["overall_readiness"] == 78
    assert data["criteria_readiness"]["criterion1"] == 85
    assert data["criteria_readiness"]["criterion2"] == 58
    assert data["criteria_readiness"]["criterion3"] == 90

    # Seed values: validated = 110, pending = 14, rejected = 5
    assert data["document_metrics"]["validated"] == 110
    assert data["document_metrics"]["pending"] == 14
    assert data["document_metrics"]["rejected"] == 5
    
    # Checked recommendations
    recs = data["recommendations"]
    assert any("Upload Faculty Training Certificates for Criterion 2" in r for r in recs)
    assert any("Provide Student Feedback reports for the current academic year" in r for r in recs)
    assert any("Complete and verify all departmental Teaching Plans" in r for r in recs)

def test_update_criterion_score(client):
    """
    Test updating a criterion score changes the overall readiness score.
    """
    # 1. Update criterion2 score from 58 to 80
    update_response = client.put("/api/v1/dashboard/criteria/criterion2?score=80")
    assert update_response.status_code == 200
    assert update_response.json()["score"] == 80.0
    
    # 2. Get dashboard and assert overall readiness score increases
    # Average: (85 + 80 + 90) / 3 = 85
    db_response = client.get("/api/v1/dashboard")
    assert db_response.status_code == 200
    data = db_response.json()
    assert data["overall_readiness"] == 85
    assert data["criteria_readiness"]["criterion2"] == 80
    
    # 3. Assert Criterion 2 is no longer underperforming (< 60)
    assert not any("Improve readiness score for Teaching-Learning" in r for r in data["recommendations"])

def test_resolve_document_gap(client):
    """
    Test that uploading or resolving document statuses changes the recommendation list.
    """
    # Let's get the dashboard first and verify we have document-based recommendations
    response = client.get("/api/v1/dashboard")
    assert any("Upload Faculty Training Certificates for Criterion 2" in r for r in response.json()["recommendations"])
    
    # Find the document that is causing the rejected state: "faculty_training_rejected.pdf"
    # To do this, let's find the document_id. We can do it by querying all documents or updating status.
    # In the seeded db, "faculty_training_rejected.pdf" is created as the first document with status "rejected" for criterion2.
    # Since it was inserted before the bulk documents, its ID will be 3 (after the two criterion1 documents, or let's find it).
    # Better yet, let's upload a validated document for Criterion 2, Faculty Training Certificates!
    new_doc_response = client.post("/api/v1/dashboard/documents", json={
        "file_name": "faculty_training_fresh.pdf",
        "status": "validated",
        "criterion_id": "criterion2",
        "document_type": "Faculty Training Certificates"
    })
    assert new_doc_response.status_code == 201
    
    # Refresh dashboard
    db_response = client.get("/api/v1/dashboard")
    data = db_response.json()
    
    # Since we uploaded a validated "Faculty Training Certificates", the gap is resolved
    # and the recommendation should be gone!
    assert not any("Upload Faculty Training Certificates for Criterion 2" in r for r in data["recommendations"])
    
    # Check document metrics updated
    # validated: 110 + 1 = 111
    assert data["document_metrics"]["validated"] == 111
