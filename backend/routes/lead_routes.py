from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

import database
import schemas
from controllers import lead_controllers

router = APIRouter(prefix="/leads", tags=["Leads"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.LeadResponse])
def get_leads(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1), db: Session = Depends(get_db)):
    return lead_controllers.get_all_leads(db, skip, limit)


@router.get("/{id}", response_model=schemas.LeadResponse)
def get_lead_by_id(id: int, db: Session = Depends(get_db)):
    return lead_controllers.get_lead_by_id(id, db)


@router.post("/", response_model=schemas.LeadResponse)
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    return lead_controllers.create_lead(lead, db)


@router.put("/{id}", response_model=schemas.LeadResponse)
def update_lead(id: int, lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    return lead_controllers.update_lead(id, lead, db)


@router.delete("/{id}")
def delete_lead(id: int, db: Session = Depends(get_db)):
    return lead_controllers.delete_lead(id, db)
