from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class CriterionReadiness(Base):
    __tablename__ = "criteria_readiness"

    id = Column(Integer, primary_key=True, index=True)
    criterion_id = Column(String, unique=True, index=True, nullable=False)  # e.g., "criterion1", "criterion2"
    name = Column(String, nullable=False)
    score = Column(Float, nullable=False)  # percentage: 0 to 100

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # "validated", "pending", "rejected"
    criterion_id = Column(String, index=True, nullable=False)  # e.g., "criterion1"
    document_type = Column(String, nullable=False)  # e.g., "Faculty Training Certificates", "Student Feedback Reports"

class NAACBenchmark(Base):
    __tablename__ = "naac_benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    criterion_id = Column(String, index=True, nullable=False)
    required_document_type = Column(String, nullable=False)
    description = Column(String, nullable=True)
