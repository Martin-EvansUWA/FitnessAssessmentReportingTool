from sqlalchemy import JSON, TIMESTAMP, Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

# User model
class DimUser(Base):
    __tablename__ = "dim_user"

    UserID = Column(Integer, primary_key=True)  # Corrected the case here
    FirstName = Column(String, index=True)
    LastName = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    isAdmin = Column(Boolean)
    hashed_password = Column(String)
    
    # New columns for password reset functionality
    reset_token = Column(String, nullable=True)  # For storing the reset token
    reset_token_expiration = Column(DateTime, nullable=True)  # For storing token expiration time

    def __repr__(self):
        return (
            f"DimUser(UserID={self.UserID}, FirstName='{self.FirstName}', "
            f"LastName='{self.LastName}', email='{self.email}')"
        )

# Form template model
class DimFormTemplate(Base):
    __tablename__ = "dim_form_templates"

    FormTemplateID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    UserID = Column(Integer, ForeignKey(DimUser.UserID))
    FormTemplate = Column(JSON)
    Title = Column(String)
    Description = Column(String)
    CreatedAt = Column(String)

# User data response model
class DimUserFormResponse(Base):
    __tablename__ = "dim_user_form_response"

    UserFormResponseID = Column(Integer, primary_key=True)
    UserFormResponse = Column(JSON)

# User form response model
class FactUserForm(Base):
    __tablename__ = "fact_user_form"
    FactUserFormID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    UserFormResponseID = Column(
        Integer, ForeignKey(DimUserFormResponse.UserFormResponseID), index=True
    )
    FormTemplateID = Column(
        Integer,
        ForeignKey(DimFormTemplate.FormTemplateID),
        index=True,
        autoincrement=True,
    )
    UserID = Column(Integer, ForeignKey(DimUser.UserID), index=True)
    SubjectUserID = Column(
        Integer, ForeignKey(DimUser.UserID), index=True
    )  # TODO: Investigate -  Would this work if the student does not exist
    IsComplete = Column(Boolean, default=True)
    CreatedAt = Column(String)
    CompleteAt = Column(String)
