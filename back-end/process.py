import json

from schemas import DimFormTemplateCreate


def createFormTemplateSchema(form_json) -> DimFormTemplateCreate:
    try:
        form_data = json.loads(form_json)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")

    form_schema = DimFormTemplateCreate(
        Title=form_data["title"],
        Description=form_data["description"],
        AdminID=form_data["admin_id"],
        CreatedAt=form_data["created_at"],
        FormTemplate=form_data["form_template"],
    )
    return form_schema
