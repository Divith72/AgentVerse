from typing import List
from app.db.models import CriterionReadiness, Document, NAACBenchmark

def generate_recommendations(
    criteria: List[CriterionReadiness],
    benchmarks: List[NAACBenchmark],
    documents: List[Document]
) -> List[str]:
    """
    Analyzes NAAC accreditation readiness data, identifies compliance gaps,
    and generates targeted improvement recommendations.
    
    Gaps include:
    - Underperforming criteria (readiness percentage < 60%)
    - Missing required evidence or documents
    - Rejected documents that require re-upload or correction
    - Pending documents requiring verification
    """
    recommendations = []
    
    # Map documents by (criterion_id, document_type) for quick lookup
    doc_map = {}
    for doc in documents:
        key = (doc.criterion_id, doc.document_type.lower().strip())
        if key not in doc_map:
            doc_map[key] = []
        doc_map[key].append(doc)

    # 1. Analyze Benchmarks to identify document gaps
    for benchmark in benchmarks:
        crit_id = benchmark.criterion_id
        doc_type = benchmark.required_document_type
        key = (crit_id, doc_type.lower().strip())
        
        docs = doc_map.get(key, [])
        
        # Check if the document type is missing, rejected, or pending
        if not docs:
            # Document is completely missing
            if doc_type == "Student Feedback Reports":
                recommendations.append("Provide Student Feedback reports for the current academic year.")
            elif doc_type == "Faculty Training Certificates":
                recommendations.append(f"Upload Faculty Training Certificates for {crit_id.replace('criterion', 'Criterion ')}.")
            elif doc_type == "Teaching Plans":
                recommendations.append("Complete and verify all departmental Teaching Plans.")
            else:
                recommendations.append(f"Upload {doc_type} for {crit_id.replace('criterion', 'Criterion ')}.")
        else:
            # Document exists, check statuses
            has_validated = any(d.status == "validated" for d in docs)
            if not has_validated:
                # If there are no validated instances, check other statuses
                has_pending = any(d.status == "pending" for d in docs)
                has_rejected = any(d.status == "rejected" for d in docs)
                
                # Check specific mappings for requirements
                if doc_type == "Faculty Training Certificates":
                    recommendations.append(f"Upload Faculty Training Certificates for {crit_id.replace('criterion', 'Criterion ')}.")
                elif doc_type == "Student Feedback Reports":
                    recommendations.append("Provide Student Feedback reports for the current academic year.")
                elif doc_type == "Teaching Plans":
                    recommendations.append("Complete and verify all departmental Teaching Plans.")
                else:
                    if has_rejected:
                        recommendations.append(f"Upload and re-verify {doc_type} for {crit_id.replace('criterion', 'Criterion ')}.")
                    elif has_pending:
                        recommendations.append(f"Verify pending {doc_type} for {crit_id.replace('criterion', 'Criterion ')}.")

    # 2. Identify underperforming criteria (< 60%)
    for criterion in criteria:
        if criterion.score < 60.0:
            crit_display = criterion.criterion_id.replace('criterion', 'Criterion ')
            recommendations.append(
                f"Improve readiness score for {criterion.name} ({crit_display} is currently at {int(criterion.score)}%, below 60% benchmark)."
            )

    return recommendations
