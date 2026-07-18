import enum
from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey, Enum, func
)
from sqlalchemy.orm import relationship
from database import Base


class SemesterStatus(str, enum.Enum):
    upcoming = "upcoming"
    active = "active"
    completed = "completed"


class EnrollmentStatus(str, enum.Enum):
    open = "open"
    closed = "closed"


class Semester(Base):
    __tablename__ = "semesters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)  # e.g. "Fall 2026"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(SemesterStatus), nullable=False, default=SemesterStatus.upcoming)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    enrollment_periods = relationship(
        "EnrollmentPeriod", back_populates="semester", cascade="all, delete-orphan"
    )


class EnrollmentPeriod(Base):
    __tablename__ = "enrollment_periods"

    id = Column(Integer, primary_key=True, index=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(EnrollmentStatus), nullable=False, default=EnrollmentStatus.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    semester = relationship("Semester", back_populates="enrollment_periods")
