from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models, schemas, crud
from database import engine, get_db, Base
from auth import authenticate_admin, get_current_admin

# Create tables on startup (fine for a student/internship project;
# use Alembic migrations for production systems)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Marks Entry System - Admin Semester Management",
    description="Admin module for creating and managing semesters and their enrollment periods.",
    version="1.1.0",
)

# Allow the React dev server (Vite default port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "admin-semester-management"}


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@app.post("/auth/login", response_model=schemas.TokenResponse, tags=["Auth"])
def login(credentials: schemas.LoginRequest):
    token = authenticate_admin(credentials.username, credentials.password)
    if not token:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    return schemas.TokenResponse(access_token=token)


@app.get("/auth/me", tags=["Auth"])
def whoami(admin: str = Depends(get_current_admin)):
    return {"username": admin}


# ---------------------------------------------------------------------------
# Semesters (all routes below require a valid admin session)
# ---------------------------------------------------------------------------

@app.get("/semesters", response_model=list[schemas.SemesterOut], tags=["Semesters"])
def list_semesters(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    return crud.get_semesters(db)


@app.post(
    "/semesters",
    response_model=schemas.SemesterOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Semesters"],
)
def create_semester(
    semester: schemas.SemesterCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    if crud.get_semester_by_name(db, semester.name):
        raise HTTPException(status_code=400, detail="A semester with this name already exists")
    return crud.create_semester(db, semester)


@app.get("/semesters/{semester_id}", response_model=schemas.SemesterDetailOut, tags=["Semesters"])
def get_semester(
    semester_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)
):
    db_semester = crud.get_semester(db, semester_id)
    if not db_semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return db_semester


@app.put("/semesters/{semester_id}", response_model=schemas.SemesterOut, tags=["Semesters"])
def update_semester(
    semester_id: int,
    semester: schemas.SemesterUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    db_semester = crud.update_semester(db, semester_id, semester)
    if not db_semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return db_semester


@app.delete("/semesters/{semester_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Semesters"])
def delete_semester(
    semester_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)
):
    db_semester = crud.delete_semester(db, semester_id)
    if not db_semester:
        raise HTTPException(status_code=404, detail="Semester not found")
    return None


# ---------------------------------------------------------------------------
# Enrollment Periods (nested under a semester) - also auth-protected
# ---------------------------------------------------------------------------

@app.get(
    "/semesters/{semester_id}/enrollment-periods",
    response_model=list[schemas.EnrollmentPeriodOut],
    tags=["Enrollment Periods"],
)
def list_enrollment_periods(
    semester_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)
):
    if not crud.get_semester(db, semester_id):
        raise HTTPException(status_code=404, detail="Semester not found")
    return crud.get_enrollment_periods(db, semester_id)


@app.post(
    "/semesters/{semester_id}/enrollment-periods",
    response_model=schemas.EnrollmentPeriodOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Enrollment Periods"],
)
def create_enrollment_period(
    semester_id: int,
    period: schemas.EnrollmentPeriodCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    if not crud.get_semester(db, semester_id):
        raise HTTPException(status_code=404, detail="Semester not found")
    return crud.create_enrollment_period(db, semester_id, period)


@app.put(
    "/enrollment-periods/{period_id}",
    response_model=schemas.EnrollmentPeriodOut,
    tags=["Enrollment Periods"],
)
def update_enrollment_period(
    period_id: int,
    period: schemas.EnrollmentPeriodUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    db_period = crud.update_enrollment_period(db, period_id, period)
    if not db_period:
        raise HTTPException(status_code=404, detail="Enrollment period not found")
    return db_period


@app.delete(
    "/enrollment-periods/{period_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Enrollment Periods"],
)
def delete_enrollment_period(
    period_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)
):
    db_period = crud.delete_enrollment_period(db, period_id)
    if not db_period:
        raise HTTPException(status_code=404, detail="Enrollment period not found")
    return None
