from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Customer
import schemas

def get_all_customers(db: Session):
    return db.query(Customer).all()

def get_customer_by_id(id: int, db: Session):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Customer with ID {id} not found")
    return customer

def create_customer(customer_data: schemas.CustomerCreate, db: Session):
    new_customer = Customer(
        name = customer_data.name,
        email = customer_data.email,
        phone = customer_data.phone,
        company = customer_data.company
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

def update_customer(id: int, customer_data: schemas.CustomerCreate, db: Session):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Customer with ID {id} not found")
    customer.name = customer_data.name
    customer.email = customer_data.email
    customer.phone = customer_data.phone
    customer.company = customer_data.company

    db.commit()
    db.refresh(customer)
    return customer

def delete_customer(id: int, db: Session):
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Customer with ID {id} not found")
    db.delete(customer)
    db.commit()
    return { "message": f"Customer with ID {id} deleted successfully" }