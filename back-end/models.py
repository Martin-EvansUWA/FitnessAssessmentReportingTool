from database import Base
from sqlalchemy import JSON, TIMESTAMP, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class DimUser(Base):
    __tablename__ = "DimUser"

    StudentID = Column(Integer, primary_key=True)
    FirstName = Column(String, index=True)
    LastName = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    def __repr__(self):
        return (f"DimUser(UserId={self.UserId}, FirstName='{self.FirstName}', "
                f"LastName='{self.LastName}', StudentId={self.StudentID}, "
                f"email='{self.email}')")


class DimAdmin(Base):
    __tablename__ = "Admin"

    StaffID = Column(Integer, primary_key=True)
    FirstName = Column(String, index=True)
    LastName = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class DimFormTemplate(Base):
    __tablename__ = "dim_form_templates"

    FormTemplateID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    StaffID = Column(Integer, ForeignKey(DimAdmin.StaffID))
    FormTemplate = Column(JSON)
    Title = Column(String)
    Description = Column(String)
    CreatedAt = Column(String)  
    
class DimUserFormResponse(Base):
    __tablename__ = "dim_user_form_response"

    UserFormResponseID = Column(Integer, primary_key=True)
    UserFormResponse = Column(JSON)


class FactUserForm(Base):
    __tablename__ = "fact_user_form"

    UserFormResponseID = Column(Integer, ForeignKey(DimUserFormResponse.UserFormResponseID), index=True)
    FormTemplateID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    StudentID = Column(Integer, ForeignKey(DimUser.StudentID), index=True)
    SubjectStudentID = Column(Integer, ForeignKey(DimUser.StudentID), index=True)
    IsComplete = Column(Boolean, default=True)
    CreatedAt = Column(String)
    CompleteAt = Column(String)