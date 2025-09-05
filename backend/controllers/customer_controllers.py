from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Customer
import schemas

def get_all_customers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Customer).offset(skip).limit(limit).all()

def get_customer_by_id(id: int, db: Session):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Customer with ID {id} not found")
    return customer

def create_customer(customer_data: schemas.CustomerCreate, db: Session):
    new_customer = Customer(
        negotiated_value=customer_data.negotiated_value,
        closing_date=customer_data.closing_date,
        contact_id=customer_data.contact_id,
        converted_by_staff_id=customer_data.converted_by_staff_id
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

def update_customer(id: int, customer_data: schemas.CustomerCreate, db: Session):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Customer with ID {id} not found")

    customer.negotiated_value = customer_data.negotiated_value
    customer.closing_date = customer_data.closing_date
    customer.contact_id = customer_data.contact_id
    customer.converted_by_staff_id = customer_data.converted_by_staff_id

    db.commit()
    db.refresh(customer)
    return customer

def delete_customer(id: int, db: Session):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Customer with ID {id} not found")
    db.delete(customer)
    db.commit()
    return {"message": f"Customer with ID {id} deleted successfully"}
