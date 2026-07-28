from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.db.session import get_db, seed_data
from app.db.models import CriterionReadiness, Document, NAACBenchmark
from app.models.schemas import (
    DashboardResponse,
    DocumentMetrics,
    DocumentCreate,
    DocumentSchema,
    DocumentUpdateStatus
)
from app.services.recommendation_agent import generate_recommendations

router = APIRouter(prefix="/api/v1", tags=["Dashboard"])

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """
    Fetch real-time readiness metrics, document tracking statistics, 
    and active compliance recommendations.
    """
    # 1. Fetch criteria readiness
    criteria = db.query(CriterionReadiness).all()
    
    # 2. Fetch all documents
    documents = db.query(Document).all()
    
    # 3. Fetch benchmarks
    benchmarks = db.query(NAACBenchmark).all()
    
    # Calculate criteria readiness dict
    criteria_readiness = {}
    total_score = 0.0
    for crit in criteria:
        criteria_readiness[crit.criterion_id] = int(round(crit.score))
        total_score += crit.score
        
    overall_readiness = int(round(total_score / len(criteria))) if criteria else 0
    
    # Calculate document metrics
    validated_count = sum(1 for doc in documents if doc.status == "validated")
    pending_count = sum(1 for doc in documents if doc.status == "pending")
    rejected_count = sum(1 for doc in documents if doc.status == "rejected")
    
    doc_metrics = DocumentMetrics(
        validated=validated_count,
        pending=pending_count,
        rejected=rejected_count
    )
    
    # Generate recommendations
    recs = generate_recommendations(criteria, benchmarks, documents)
    
    return DashboardResponse(
        overall_readiness=overall_readiness,
        criteria_readiness=criteria_readiness,
        document_metrics=doc_metrics,
        recommendations=recs
    )

@router.post("/dashboard/reset", status_code=status.HTTP_200_OK)
def reset_database(db: Session = Depends(get_db)):
    """
    Resets the database, wipes existing records, and seeds the default state.
    """
    db.query(Document).delete()
    db.query(CriterionReadiness).delete()
    db.query(NAACBenchmark).delete()
    db.commit()
    seed_data(db)
    return {"message": "Database reset and seeded with default data successfully."}

@router.post("/dashboard/documents", response_model=DocumentSchema, status_code=status.HTTP_201_CREATED)
def create_document(doc: DocumentCreate, db: Session = Depends(get_db)):
    """
    Adds a new document to the tracking list.
    """
    db_doc = Document(
        file_name=doc.file_name,
        status=doc.status,
        criterion_id=doc.criterion_id,
        document_type=doc.document_type
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.patch("/dashboard/documents/{document_id}", response_model=DocumentSchema)
def update_document_status(document_id: int, update: DocumentUpdateStatus, db: Session = Depends(get_db)):
    """
    Updates the verification status of a document (validated, pending, rejected).
    """
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    status_lower = update.status.lower().strip()
    if status_lower not in ["validated", "pending", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status value. Must be 'validated', 'pending', or 'rejected'")
        
    db_doc.status = status_lower
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.put("/dashboard/criteria/{criterion_id}", response_model=Dict[str, Any])
def update_criterion_score(criterion_id: str, score: float, db: Session = Depends(get_db)):
    """
    Updates the readiness score of a criterion.
    """
    if not (0 <= score <= 100):
        raise HTTPException(status_code=400, detail="Score must be between 0 and 100")
        
    db_crit = db.query(CriterionReadiness).filter(CriterionReadiness.criterion_id == criterion_id).first()
    if not db_crit:
        raise HTTPException(status_code=404, detail="Criterion not found")
        
    db_crit.score = score
    db.commit()
    return {"criterion_id": criterion_id, "score": score, "message": "Criterion score updated successfully."}
