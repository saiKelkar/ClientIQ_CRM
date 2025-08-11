from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models import Ticket
from .. import schemas

def get_all_tickets(db: Session):
    return db.query(Ticket).all()

def get_ticket_by_id(id: int, db: Session):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")
    return ticket

def create_ticket(ticket_data: schemas.TicketCreate, db: Session):
    new_ticket = Ticket(
        customer_id = ticket_data.customer_id,
        subject = ticket_data.subject,
        description = ticket_data.description,
        status = ticket_data.status,
        priority = ticket_data.priority
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

def update_ticket(id: int, ticket_data: schemas.TicketCreate, db: Session):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")
    ticket.customer_id = ticket_data.customer_id
    ticket.subject = ticket_data.subject
    ticket.description = ticket_data.description
    ticket.status = ticket_data.status
    ticket.priority = ticket_data.priority

    db.commit()
    db.refresh(ticket)
    return ticket

def delete_ticket(id: int, db: Session):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")
    db.delete(ticket)
    db.commit()
    return { "message": f"Ticket with ID {id} deleted successfully" }