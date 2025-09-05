from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, DECIMAL
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
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    customers_converted = relationship("Customer", back_populates="converted_by_staff")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)

    # Relationships
    customer = relationship("Customer", back_populates="contact", uselist=False)
    leads = relationship("Lead", back_populates="contact")
    transactions = relationship("Transaction", back_populates="contact")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    negotiated_value = Column(DECIMAL, nullable=False)
    closing_date = Column(DateTime(timezone=True), nullable=True)

    # Foreign keys
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False)
    converted_by_staff_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    contact = relationship("Contact", back_populates="customer")
    converted_by_staff = relationship("User", back_populates="customers_converted")
    leads = relationship("Lead", back_populates="customer")
    transactions = relationship("Transaction", back_populates="customer")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    prospect_type = Column(Enum('opportunity', 'lead', name='deal_prospect'), nullable=False)
    estimated_value = Column(DECIMAL, nullable=False)
    potential_investment = Column(DECIMAL, nullable=False)
    stage = Column(Enum('initiated', 'in_progress', 'finalized', 'closed_lost', 'closed_won', name='deal_stage'), nullable=False)

    # Foreign keys
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)

    # Relationships
    contact = relationship("Contact", back_populates="leads")
    customer = relationship("Customer", back_populates="leads")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount_invested = Column(DECIMAL, nullable=False)
    payment_method = Column(Enum('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cheque', name='pay_method'), nullable=False)
    payment_status = Column(Enum('pending', 'completed', 'failed', 'refunded', name='pay_status'), nullable=False)

    # Foreign keys
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    # Relationships
    contact = relationship("Contact", back_populates="transactions")
    customer = relationship("Customer", back_populates="transactions")
