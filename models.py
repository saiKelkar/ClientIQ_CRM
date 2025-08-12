"""
SQLAlchemy ORM models for the CRM system.
Defines database tables and their relationships
"""

from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, DECIMAL, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum('admin', 'staff', name='user_roles'), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=False)

    # Relationships
    deals = relationship("Deal", back_populates="owner")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    deals = relationship("Deal", back_populates="customer")
    projects = relationship("Project", back_populates="customer")
    tickets = relationship("Ticket", back_populates="customer")
    invoices = relationship("Invoice", back_populates="customer")

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String, nullable=False)
    stage = Column(Enum('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost', name='deal_stages'), nullable=False)
    value = Column(DECIMAL, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=False)
    
    # Relationships
    customer = relationship("Customer", back_populates="deals")
    owner = relationship("User", back_populates="deals")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    name = Column(String, nullable=False)
    status = Column(Enum('pending', 'in_progress', 'completed', name='project_status'), nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    budget = Column(DECIMAL, nullable=True)

    # Relationships
    customer = relationship("Customer", back_populates="projects")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    subject = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum('open', 'in_progress', 'closed', name='ticket_status'), nullable=False)
    priority = Column(Enum('low', 'medium', 'high', name='ticket_priority'), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="tickets")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    amount = Column(DECIMAL, nullable=False)
    status = Column(Enum('paid', 'unpaid', 'overdue', name='invoice_status'), nullable=False)
    due_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="invoices")