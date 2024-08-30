from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

# DimFormTemplate Schema
class DimFormTemplateBase(BaseModel):
    Title: str
    Description: Optional[str] = None

class DimFormTemplateCreate(DimFormTemplateBase):
    AdminID: int
    FormTemplate: Dict[str, Any]  # JSON data
    CreatedAt: str

class DimFormTemplate(DimFormTemplateBase):
    FormTemplateId: int
    AdminID: int
    FormTemplate: Dict[str, Any]  # JSON data
    CreatedAt: str

    class Config:
        orm_mode = True

# DimUserFormResponse Schema
class DimUserFormResponseBase(BaseModel):
    pass  # You may want to include fields if known

class DimUserFormResponseCreate(DimUserFormResponseBase):
    pass

class DimUserFormResponse(DimUserFormResponseBase):
    UserFormResponseId: int
    UserFormResponse: Dict[str, Any]  # JSON data

    class Config:
        orm_mode = True

# FactUserForm Schema
class FactUserFormBase(BaseModel):
    IsComplete: bool
    CreatetAt: Optional[datetime] = None
    CompleteAt: Optional[datetime] = None

class FactUserFormCreate(FactUserFormBase):
    FormTemplateId: int
    UserId: int
    SubjectUserId: int

class FactUserForm(FactUserFormBase):
    UserFormResponseId: int
    FormTemplateId: int
    UserId: int
    SubjectUserId: int

    class Config:
        orm_mode = True


# DimUser Schema
class DimUserBase(BaseModel):
    email: str

class DimUserCreate(DimUserBase):
    FirstName: str
    LastName: str
    password: str
    StudentID: int

class DimUser(DimUserBase):
    UserId: int
    FirstName: str
    LastName: str
    StudentID: int
    hashed_password: str

    class Config:
        orm_mode = True

# Admin Schema
class AdminBase(BaseModel):
    email: str

class DimAdminCreate(AdminBase):
    FirstName: str
    LastName: str
    StaffID: int
    password: str

class DimAdmin(AdminBase):
    AdminID: int
    FirstName: str
    LastName: str
    StaffID: int
    hashed_password: str

    class Config:
        orm_mode = True

