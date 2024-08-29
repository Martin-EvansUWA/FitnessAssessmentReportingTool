from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

# Item Schema
class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

# Student Schema
class StudentBase(BaseModel):
    email: str

class StudentCreate(StudentBase):
    password: str

class Student(StudentBase):
    UserId: int
    FirstName: str
    LastName: str
    StudentId: int
    hashed_password: str
    items: List[Item] = []

    class Config:
        orm_mode = True

# Admin Schema
class AdminBase(BaseModel):
    email: str

class AdminCreate(AdminBase):
    password: str

class Admin(AdminBase):
    AdminId: int
    FirstName: str
    LastName: str
    StaffId: int
    hashed_password: str
    items: List[DimFormTemplate] = []  # Assuming `items` relates to `DimFormTemplate`

    class Config:
        orm_mode = True

# DimFormTemplate Schema
class DimFormTemplateBase(BaseModel):
    Title: str
    Description: Optional[str] = None

class DimFormTemplateCreate(DimFormTemplateBase):
    pass

class DimFormTemplate(DimFormTemplateBase):
    FormTemplateId: int
    AdminId: int
    FormTemplate: Dict[str, Any]  # JSON data
    CreatedAt: datetime

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
    pass

class FactUserForm(FactUserFormBase):
    UserFormResponseId: int
    FormTemplateId: int
    UserId: int
    SubjectUserId: int

    class Config:
        orm_mode = True
