from schemas import DimFormTemplateBase


def createFormTemplateSchema(form_data) -> DimFormTemplateBase:
    form_schema = DimFormTemplateBase(
        Title=form_data["title"], Description=form_data["description"]
    )
    return form_schema
