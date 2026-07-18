from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator
from models import SemesterStatus, EnrollmentStatus


# ---------- Auth ----------

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Enrollment Period ----------

class EnrollmentPeriodBase(BaseModel):
    start_date: date
    end_date: date
    status: EnrollmentStatus = EnrollmentStatus.open

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("start_date")
        if start and v < start:
            raise ValueError("end_date must be on or after start_date")
        return v


class EnrollmentPeriodCreate(EnrollmentPeriodBase):
    pass


class EnrollmentPeriodUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[EnrollmentStatus] = None


class EnrollmentPeriodOut(EnrollmentPeriodBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    semester_id: int
    created_at: datetime
    updated_at: datetime


# ---------- Semester ----------

class SemesterBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    status: SemesterStatus = SemesterStatus.upcoming

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("start_date")
        if start and v < start:
            raise ValueError("end_date must be on or after start_date")
        return v


class SemesterCreate(SemesterBase):
    pass


class SemesterUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[SemesterStatus] = None


class SemesterOut(SemesterBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime


class SemesterDetailOut(SemesterOut):
    enrollment_periods: List[EnrollmentPeriodOut] = []
