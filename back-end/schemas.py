from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# DimFormTemplate Schema
class DimFormTemplateBase(BaseModel):
    Title: str
    Description: Optional[str] = None
    StaffID: int
    FormTemplate: Dict[str, Any]  # JSON data
    CreatedAt: str


class DimFormTemplateCreate(DimFormTemplateBase):
    pass


class DimFormTemplate(DimFormTemplateBase):
    FormTemplateId: int

    class Config:
        orm_mode = True


# DimUserFormResponse Schema
class DimUserFormResponseBase(BaseModel):
    UserFormResponse: Dict[str, Any]  # JSON data


class DimUserFormResponseCreate(DimUserFormResponseBase):
    pass


class DimUserFormResponse(DimUserFormResponseBase):
    UserFormResponseID: int

    class Config:
        orm_mode = True


# FactUserForm Schema
class FactUserFormBase(BaseModel):
    IsComplete: bool
    CreatedAt: str
    CompleteAt: str


class FactUserFormCreate(FactUserFormBase):
    UserFormResponseID: int
    StudentID: int
    SubjectStudentID: int


class FactUserForm(FactUserFormBase):
    UserFormResponseID: int
    FormTemplateID: int
    StudentID: int
    SubjectStudentID: int

    class Config:
        orm_mode = True


# DimUser Schema
class DimUserBase(BaseModel):
    StudentID: int
    email: str
    FirstName: str
    LastName: str


class DimUserCreate(DimUserBase):
    password: str


class DimUser(DimUserBase):
    hashed_password: str

    class Config:
        orm_mode = True


# Admin Schema
class AdminBase(BaseModel):
    email: str
    FirstName: str
    LastName: str
    StaffID: int


class DimAdminCreate(AdminBase):
    password: str


class DimAdmin(AdminBase):
    hashed_password: str

    class Config:
        orm_mode = True
