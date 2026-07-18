from sqlalchemy.orm import Session
from sqlalchemy import select
import models, schemas


# ---------- Semester ----------

def get_semesters(db: Session):
    return db.execute(select(models.Semester).order_by(models.Semester.start_date.desc())).scalars().all()


def get_semester(db: Session, semester_id: int):
    return db.get(models.Semester, semester_id)


def get_semester_by_name(db: Session, name: str):
    return db.execute(select(models.Semester).where(models.Semester.name == name)).scalar_one_or_none()


def create_semester(db: Session, semester: schemas.SemesterCreate):
    db_semester = models.Semester(**semester.model_dump())
    db.add(db_semester)
    db.commit()
    db.refresh(db_semester)
    return db_semester


def update_semester(db: Session, semester_id: int, semester: schemas.SemesterUpdate):
    db_semester = get_semester(db, semester_id)
    if not db_semester:
        return None
    for field, value in semester.model_dump(exclude_unset=True).items():
        setattr(db_semester, field, value)
    db.commit()
    db.refresh(db_semester)
    return db_semester


def delete_semester(db: Session, semester_id: int):
    db_semester = get_semester(db, semester_id)
    if not db_semester:
        return None
    db.delete(db_semester)
    db.commit()
    return db_semester


# ---------- Enrollment Period ----------

def get_enrollment_periods(db: Session, semester_id: int):
    return db.execute(
        select(models.EnrollmentPeriod)
        .where(models.EnrollmentPeriod.semester_id == semester_id)
        .order_by(models.EnrollmentPeriod.start_date.desc())
    ).scalars().all()


def get_enrollment_period(db: Session, period_id: int):
    return db.get(models.EnrollmentPeriod, period_id)


def create_enrollment_period(db: Session, semester_id: int, period: schemas.EnrollmentPeriodCreate):
    db_period = models.EnrollmentPeriod(semester_id=semester_id, **period.model_dump())
    db.add(db_period)
    db.commit()
    db.refresh(db_period)
    return db_period


def update_enrollment_period(db: Session, period_id: int, period: schemas.EnrollmentPeriodUpdate):
    db_period = get_enrollment_period(db, period_id)
    if not db_period:
        return None
    for field, value in period.model_dump(exclude_unset=True).items():
        setattr(db_period, field, value)
    db.commit()
    db.refresh(db_period)
    return db_period


def delete_enrollment_period(db: Session, period_id: int):
    db_period = get_enrollment_period(db, period_id)
    if not db_period:
        return None
    db.delete(db_period)
    db.commit()
    return db_period
