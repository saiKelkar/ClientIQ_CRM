from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import database
import schemas
from controllers import customer_controllers

router = APIRouter(prefix="/customers", tags=["Customers"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.CustomerResponse])
def getCustomers(db: Session = Depends(get_db)):
    return customer_controllers.get_all_customers(db)

@router.get("/{id}", response_model=schemas.CustomerResponse)
def getCustomerById(id: int, db: Session = Depends(get_db)):
    return customer_controllers.get_customer_by_id(id, db)

@router.post("/", response_model=schemas.CustomerResponse)
def createCustomer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return customer_controllers.create_customer(customer, db)

@router.put("/{id}", response_model=schemas.CustomerResponse)
def updateCustomer(id: int, customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return customer_controllers.update_customer(id, customer, db)

@router.delete("/{id}")
def deleteCustomer(id: int, db: Session = Depends(get_db)):
    return customer_controllers.delete_customer(id, db)