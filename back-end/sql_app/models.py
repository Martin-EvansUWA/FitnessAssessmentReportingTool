from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func

from .database import Base


class Student(Base):
    __tablename__ = "Student"

    UserId = Column(Integer, primary_key=True)
    FirstName = Column(String, unique=True, index=True)
    LastName = Column(String, unique=True, index=True)
    StudentId = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    items = relationship("Item", back_populates="owner")

class Admin(Base):
    __tablename__ = "Admin"

    AdminId = Column(Integer, primary_key=True)
    FirstName = Column(String, unique=True, index=True)
    LastName = Column(String, unique=True, index=True)
    StaffId = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    items = relationship("DimFormTemplate", back_populates="owner")



class DimFormTemplate(Base):
    __tablename__ = "dim_form_templates"

    FormTemplateId = Column(Integer, primary_key=True, index=True)
    AdminId = Column(Integer, primary_key=True)
    FormTemplate = Column(JSON)
    Title = Column(String)
    Description = Column(String)
    CreatedAt = Column(TIMESTAMP, server_default=func.now())  # Automatically sets timestamp to current time
    
class DimUserFormResponse(Base):
    __tablename__ = "dim_user_form_response"
    
    UserFormResponseId = Column(Integer, primary_key=True)
    UserFormResponse = Column(JSON)
    
    
class FactUserForm(Base):
    __tablename__ = "fact_user_form"
    
    UserFormResponseId = Column(Integer, primary_key=True, index=True)
    FormTemplateId = Column(Integer, primary_key=True, index=True)
    UserId = Column(Integer, primary_key=True, index=True)
    SubjectUserId = Column(Integer, primary_key=True, index=True)
    IsComplete = Column(Boolean, default=True)
    CreatetAt = Column(TIMESTAMP, server_default=func.now())
    CompleteAt = Column(TIMESTAMP, server_default=func.now())