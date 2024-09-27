import json

from schemas import DimFormTemplateCreate, FactUserFormCreate, DimUserCreate
from auth import hash_password



# Create a new student from raw data
def createNewUser(form_data: dict):
    new_user = DimUserCreate(
        StudentID=form_data["StudentID"],
        email=form_data["email"],
        FirstName=form_data["FirstName"],
        LastName=form_data["LastName"],
        password=hash_password(form_data["password"])
    )
    return new_user


# Create new schema from raw data
def createFormTemplateSchema(form_data: dict) -> DimFormTemplateCreate:
    form_schema = DimFormTemplateCreate(
        Title=form_data["Title"],
        Description=form_data.get("Description"),
        StaffID=form_data["StaffID"],
        FormTemplate=form_data["FormTemplate"],
        CreatedAt=form_data["CreatedAt"],
    )
    return form_schema

# Create a form response from raw data
def createFactUserFormSchema(
    form_data: dict, userFormResponseID: int
) -> FactUserFormCreate:
    form_response_schema = FactUserFormCreate(
        StudentID=form_data["StudentID"],
        SubjectStudentID=form_data["SubjectStudentID"],
        CreatedAt=form_data["CreatedAt"],
        CompleteAt=form_data["CompleteAt"],
        IsComplete=form_data["IsComplete"],
        UserFormResponseID=userFormResponseID,
        FormTemplateID=form_data["FormTemplateID"],
    )
    return form_response_schema
