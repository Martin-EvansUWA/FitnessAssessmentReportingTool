import json

from schemas import DimFormTemplateCreate


def createFormTemplateSchema(form_data: dict) -> DimFormTemplateCreate:
    form_schema = DimFormTemplateCreate(
        Title=form_data["Title"],
        Description=form_data.get("Description"),
        StaffID=form_data["StaffID"],
        FormTemplate=form_data["FormTemplate"],
        CreatedAt=form_data["CreatedAt"],
    )
    return form_schema
