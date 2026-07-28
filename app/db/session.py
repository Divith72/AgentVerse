from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.db.models import CriterionReadiness, Document, NAACBenchmark

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)

def seed_data(db: Session):
    # Check if already seeded to avoid duplicate seed entries
    if db.query(CriterionReadiness).first() is not None:
        return

    # 1. Seed criteria readiness
    criteria = [
        CriterionReadiness(criterion_id="criterion1", name="Curricular Aspects", score=85.0),
        CriterionReadiness(criterion_id="criterion2", name="Teaching-Learning and Evaluation", score=58.0),
        CriterionReadiness(criterion_id="criterion3", name="Research, Innovations and Extension", score=90.0),
        CriterionReadiness(criterion_id="criterion4", name="Student Performence", score=90.0),
    ]
    db.add_all(criteria)

    # 2. Seed NAAC benchmarks / required document types
    benchmarks = [
        NAACBenchmark(criterion_id="criterion1", required_document_type="Curriculum Planning Guidelines", description="Approved curriculum planning documentation"),
        NAACBenchmark(criterion_id="criterion1", required_document_type="Academic Calendar", description="Annual academic calendar"),
        NAACBenchmark(criterion_id="criterion2", required_document_type="Faculty Training Certificates", description="Certificates of faculty participating in orientation/induction programs"),
        NAACBenchmark(criterion_id="criterion2", required_document_type="Student Feedback Reports", description="Feedback analysis and action taken reports"),
        NAACBenchmark(criterion_id="criterion2", required_document_type="Teaching Plans", description="Completed and verified departmental teaching plans"),
        NAACBenchmark(criterion_id="criterion3", required_document_type="Research Publications List", description="List of research papers per teacher in the Journals notified on UGC website"),
    ]
    db.add_all(benchmarks)

    # 3. Seed Documents to match target metrics:
    # Target metrics: validated=110, pending=14, rejected=5
    
    # Let's seed specific documents for Criterion 1 (both required docs are validated)
    db.add(Document(file_name="curriculum_planning_2026.pdf", status="validated", criterion_id="criterion1", document_type="Curriculum Planning Guidelines"))
    db.add(Document(file_name="academic_calendar_2026.pdf", status="validated", criterion_id="criterion1", document_type="Academic Calendar"))

    # For Criterion 2
    # "Faculty Training Certificates" has a rejected document (needs re-upload/upload)
    db.add(Document(file_name="faculty_training_rejected.pdf", status="rejected", criterion_id="criterion2", document_type="Faculty Training Certificates"))
    # "Student Feedback Reports" is completely missing (no document uploaded)
    # "Teaching Plans" has a pending document
    db.add(Document(file_name="teaching_plans_draft.pdf", status="pending", criterion_id="criterion2", document_type="Teaching Plans"))

    # Let's generate bulk documents to match requested counts:
    # Validated: we have 2, need 108 more
    for i in range(108):
        db.add(Document(file_name=f"bulk_valid_{i}.pdf", status="validated", criterion_id="criterion1" if i % 2 == 0 else "criterion3", document_type="Other Evidence"))
    
    # Pending: we have 1, need 13 more
    for i in range(13):
        db.add(Document(file_name=f"bulk_pending_{i}.pdf", status="pending", criterion_id="criterion1" if i % 2 == 0 else "criterion3", document_type="Other Evidence"))

    # Rejected: we have 1, need 4 more
    for i in range(4):
        db.add(Document(file_name=f"bulk_rejected_{i}.pdf", status="rejected", criterion_id="criterion3", document_type="Other Evidence"))

    db.commit()
