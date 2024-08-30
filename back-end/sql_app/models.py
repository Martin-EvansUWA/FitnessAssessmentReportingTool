from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func

from database import Base


class DimUser(Base):
    __tablename__ = "DimUser"

    UserId = Column(Integer, primary_key=True,autoincrement=True)
    FirstName = Column(String, index=True)
    LastName = Column(String, index=True)
    StudentID = Column(Integer, unique=True,index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    def __repr__(self):
        return (f"DimUser(UserId={self.UserId}, FirstName='{self.FirstName}', "
                f"LastName='{self.LastName}', StudentId={self.StudentID}, "
                f"email='{self.email}')")


class DimAdmin(Base):
    __tablename__ = "Admin"

    AdminID = Column(Integer, primary_key=True, autoincrement=True)
    FirstName = Column(String, index=True)
    LastName = Column(String, index=True)
    StaffID = Column(Integer, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)




class DimFormTemplate(Base):
    __tablename__ = "dim_form_templates"

    FormTemplateId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    AdminID = Column(Integer, ForeignKey(DimAdmin.AdminID))
    FormTemplate = Column(JSON)
    Title = Column(String)
    Description = Column(String)
    CreatedAt = Column(String)  # Automatically sets timestamp to current time
    
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