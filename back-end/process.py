import json

from schemas import DimFormTemplateCreate
from schemas import DimUserFormResponseCreate

def createFormTemplateSchema(form_data: dict) -> DimFormTemplateCreate:
    form_schema = DimFormTemplateCreate(
        Title=form_data["Title"],
        Description=form_data.get("Description"),
        StaffID=form_data["StaffID"],
        FormTemplate=form_data["FormTemplate"],
        CreatedAt=form_data["CreatedAt"],
    )
    return form_schema


def saveStudentForm(form_data:dict) -> DimUserFormResponseCreate:
    student_form_schema = DimUserFormResponseCreate(
        UserFormResponse=form_data[""]
    )
    return student_form_schema