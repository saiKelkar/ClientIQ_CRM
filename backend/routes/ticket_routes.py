from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import database
import schemas
from controllers import ticket_controllers

router = APIRouter(prefix="/tickets", tags=["Tickets"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.TicketResponse])
def getTickets(db: Session = Depends(get_db)):
    return ticket_controllers.get_all_tickets(db)

@router.get("/{id}", response_model=schemas.TicketResponse)
def getTicketById(id: int, db: Session = Depends(get_db)):
    return ticket_controllers.get_ticket_by_id(id, db)

@router.post("/", response_model=schemas.TicketResponse)
def createTicket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    return ticket_controllers.create_ticket(ticket, db)

@router.put("/{id}", response_model=schemas.TicketResponse)
def updateTicket(id: int, ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    return ticket_controllers.update_ticket(id, ticket, db)

@router.delete("/{id}")
def deleteTicket(id: int, db: Session = Depends(get_db)):
    return ticket_controllers.delete_ticket(id, db)