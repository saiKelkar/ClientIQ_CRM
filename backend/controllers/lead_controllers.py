from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Lead
import schemas

def get_all_leads(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Lead).offset(skip).limit(limit).all()


def get_lead_by_id(id: int, db: Session):
    lead = db.query(Lead).filter(Lead.id == id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {id} not found"
        )
    return lead


def create_lead(lead_data: schemas.LeadCreate, db: Session):
    new_lead = Lead(
        prospect_type=lead_data.prospect_type,
        estimated_value=lead_data.estimated_value,
        potential_investment=lead_data.potential_investment,
        stage=lead_data.stage,
        contact_id=lead_data.contact_id,
        customer_id=lead_data.customer_id
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead


def update_lead(id: int, lead_data: schemas.LeadCreate, db: Session):
    lead = db.query(Lead).filter(Lead.id == id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {id} not found"
        )

    lead.prospect_type = lead_data.prospect_type
    lead.estimated_value = lead_data.estimated_value
    lead.potential_investment = lead_data.potential_investment
    lead.stage = lead_data.stage
    lead.contact_id = lead_data.contact_id
    lead.customer_id = lead_data.customer_id

    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(id: int, db: Session):
    lead = db.query(Lead).filter(Lead.id == id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {id} not found"
        )
    db.delete(lead)
    db.commit()
    return {"message": f"Lead with ID {id} deleted successfully"}
