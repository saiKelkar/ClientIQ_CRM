from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Contact
import schemas

def get_all_contacts(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Contact).offset(skip).limit(limit).all()


def get_contact_by_id(id: int, db: Session):
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with ID {id} not found"
        )
    return contact


def create_contact(contact_data: schemas.ContactCreate, db: Session):
    new_contact = Contact(
        first_name=contact_data.first_name,
        last_name=contact_data.last_name,
        email=contact_data.email,
        phone=contact_data.phone
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact


def update_contact(id: int, contact_data: schemas.ContactCreate, db: Session):
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with ID {id} not found"
        )

    contact.first_name = contact_data.first_name
    contact.last_name = contact_data.last_name
    contact.email = contact_data.email
    contact.phone = contact_data.phone

    db.commit()
    db.refresh(contact)
    return contact


def delete_contact(id: int, db: Session):
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with ID {id} not found"
        )
    db.delete(contact)
    db.commit()
    return {"message": f"Contact with ID {id} deleted successfully"}
