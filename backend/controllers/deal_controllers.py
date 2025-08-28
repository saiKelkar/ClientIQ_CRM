from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Deal
import schemas

def get_all_deals(db: Session):
    return db.query(Deal).all()

def get_deal_by_id(id: int, db: Session):
    deal = db.query(Deal).filter(Deal.id == id).first()
    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Deal with ID {id} not found")
    return deal

def create_deal(deal_data: schemas.DealCreate, db: Session):
    new_deal = Deal(
        title = deal_data.title,
        stage = deal_data.stage,
        value = deal_data.value,
        owner_id = deal_data.owner_id,
        customer_id = deal_data.customer_id
    )
    db.add(new_deal)
    db.commit()
    db.refresh(new_deal)
    return new_deal

def update_deal(id: int, deal_data: schemas.DealCreate, db: Session):
    deal = db.query(Deal).filter(Deal.id == id).first()
    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Deal with ID {id} not found")
    deal.title = deal_data.title
    deal.stage = deal_data.stage
    deal.value = deal_data.value
    deal.owner_id = deal_data.owner_id
    deal.customer_id = deal_data.customer_id

    db.commit()
    db.refresh(deal)
    return deal

def delete_deal(id: int, db: Session):
    deal = db.query(Deal).filter(Deal.id == id).first()
    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Deal with ID {id} not found")
    db.delete(deal)
    db.commit()
    return { "message": f"Deal with ID {id} deleted successfully" }