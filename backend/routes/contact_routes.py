from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

import database
import schemas
from controllers import contact_controllers

router = APIRouter(prefix="/contacts", tags=["Contacts"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.ContactResponse])
def get_contacts(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1), db: Session = Depends(get_db)):
    return contact_controllers.get_all_contacts(db, skip, limit)


@router.get("/{id}", response_model=schemas.ContactResponse)
def get_contact_by_id(id: int, db: Session = Depends(get_db)):
    return contact_controllers.get_contact_by_id(id, db)


@router.post("/", response_model=schemas.ContactResponse)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    return contact_controllers.create_contact(contact, db)


@router.put("/{id}", response_model=schemas.ContactResponse)
def update_contact(id: int, contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    return contact_controllers.update_contact(id, contact, db)


@router.delete("/{id}")
def delete_contact(id: int, db: Session = Depends(get_db)):
    return contact_controllers.delete_contact(id, db)
