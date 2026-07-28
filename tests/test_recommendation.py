from app.db.models import CriterionReadiness, Document, NAACBenchmark
from app.services.recommendation_agent import generate_recommendations

def test_generate_recommendations_gaps():
    """
    Test recommendation generation logic for gaps, including:
    - Underperforming score (< 60%)
    - Rejected required document type
    - Missing required document type
    - Pending required document type
    """
    criteria = [
        CriterionReadiness(criterion_id="criterion1", name="Curricular Aspects", score=85.0),
        CriterionReadiness(criterion_id="criterion2", name="Teaching-Learning and Evaluation", score=58.0),
    ]
    benchmarks = [
        NAACBenchmark(criterion_id="criterion2", required_document_type="Faculty Training Certificates"),
        NAACBenchmark(criterion_id="criterion2", required_document_type="Student Feedback Reports"),
        NAACBenchmark(criterion_id="criterion2", required_document_type="Teaching Plans"),
    ]
    documents = [
        Document(file_name="faculty_training_rejected.pdf", status="rejected", criterion_id="criterion2", document_type="Faculty Training Certificates"),
        Document(file_name="teaching_plans_draft.pdf", status="pending", criterion_id="criterion2", document_type="Teaching Plans"),
    ]

    recs = generate_recommendations(criteria, benchmarks, documents)
    
    # Assertions
    # 1. "Faculty Training Certificates" is rejected
    assert any("Upload Faculty Training Certificates for Criterion 2" in r for r in recs)
    
    # 2. "Student Feedback Reports" is completely missing
    assert any("Provide Student Feedback reports for the current academic year" in r for r in recs)
    
    # 3. "Teaching Plans" is pending
    assert any("Complete and verify all departmental Teaching Plans" in r for r in recs)
    
    # 4. Criterion 2 score is 58 (under 60)
    assert any("Improve readiness score for Teaching-Learning and Evaluation" in r for r in recs)
    
    # 5. Criterion 1 score is 85 (>= 60), no warning should exist
    assert not any("Improve readiness score for Curricular Aspects" in r for r in recs)
