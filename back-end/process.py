import json

from schemas import DimFormTemplateCreate, FactUserFormCreate


def createFormTemplateSchema(form_data: dict) -> DimFormTemplateCreate:
    form_schema = DimFormTemplateCreate(
        Title=form_data["Title"],
        Description=form_data.get("Description"),
        StaffID=form_data["StaffID"],
        FormTemplate=form_data["FormTemplate"],
        CreatedAt=form_data["CreatedAt"],
    )
    return form_schema


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
