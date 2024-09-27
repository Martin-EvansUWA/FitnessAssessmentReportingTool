from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# DimFormTemplate Schema
class DimFormTemplateBase(BaseModel):
    Title: str
    Description: Optional[str] = None
    UserID: int
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
    pass  # You may want to include fields if known


class DimUserFormResponseCreate(DimUserFormResponseBase):
    UserFormResponse: Dict[str, Any]  # JSON data
    pass


class DimUserFormResponse(DimUserFormResponseBase):
    UserFormResponseID: int
    UserFormResponse: Dict[str, Any]  # JSON data

    class Config:
        orm_mode = True


# FactUserForm Schema
class FactUserFormBase(BaseModel):
    IsComplete: bool
    CreatedAt: str
    CompleteAt: str


class FactUserFormCreate(FactUserFormBase):
    UserFormResponseID: int
    FormTemplateID: int
    UserID: int
    SubjectUserID: int


class FactUserForm(FactUserFormBase):
    UserFormResponseID: int
    FormTemplateID: int
    UserID: int
    SubjectUserID: int

    class Config:
        orm_mode = True


# DimUser Schema
class DimUserBase(BaseModel):
    UserID: int
    email: str
    FirstName: str
    LastName: str
    isAdmin: bool


class DimUserCreate(DimUserBase):
    password: str


class DimUser(DimUserBase):
    hashed_password: str

    class Config:
        orm_mode = True

# Data Entry Page Submission Data Schema
class DataEntryPageSubmissionData(BaseModel):
    UserFormResponse: Dict[str, Any]  # JSON data
    FormTemplateID: int
    UserID: int
    SubjectUserID: int
    IsComplete: bool
    CreatedAt: str
    CompleteAt: str

    class Config:
        orm_mode = True


