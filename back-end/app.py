import json
from http.client import HTTPException

from fastapi import Depends, FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session



import crud
import models
from database import SessionLocal, engine
from process import createFactUserFormSchema, createFormTemplateSchema
from schemas import (
    DataEntryPageSubmissionData,
    DimFormTemplateCreate,
)

models.Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()


# app implementation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# [Admin] Sending admin id, to receive a list of form to display on the sidebar of the admin dashboard
@app.get("/retrieve_admin_sidebar_info")
def retrieve_admin_templates(admin_id: int):
    response = {}
    forms = crud.get_formtemplates_by_admin(get_db(),admin_id)

    sidebar_info = {}
    for form in forms:
        sidebar_info.update({form.id: form.title})

    response["sidebar_info"] = sidebar_info

    return response

# [Admin] Retrieve admin form template, to display on admin dashboard
@app.get("/retrieve_admin_form_template")
def retrive_admin_form_template(form_template_id: int):
    response = {}
    form_template = crud.get_dim_form_template(get_db(), form_template_id=form_template_id)
    response.update({form_template_id: form_template})
    return response



# [Admin] Create a new form template
@app.post("/create_form")
def add_form(form_data: DimFormTemplateCreate, db: Session = Depends(get_db)):
    try:
        # Process form data and add to database
        processed_data = createFormTemplateSchema(form_data.dict())
        created_form_template = crud.create_dim_form_template(db, processed_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    response = {
        "FormTemplateID": created_form_template.FormTemplateID,
    }
    return response



# [Student] Get sidebar info of student forms
@app.get("/retrieve_student_form_sidebar_info")
def retrieve_student_form_sidebar_info(student_id: int):
    response = {}
    forms = crud.get_multiple_fact_user_forms(get_db(), student_id)

    sidebar_info = {}
    for form in forms:
        form_info = {}
        form_template = crud.get_dim_form_template(get_db(),form.FormTemplateID)
        form_info["subjectID"] = form.SubjectStudentID
        form_info["studentID"] = form.StudentID
        form_info["description"] = form_template.Description
        sidebar_info.update({form_template.Title: form_info})
    response["sidebar_info"] = sidebar_info
    return response

# [Student] Retrieve form template by form id
@app.get("/retrieve_form_template/{form_id}")
def retrieve_form_template(form_id: int, db: Session = Depends(get_db)):
    try:
        form_template = crud.get_dim_form_template(db, form_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if form_template is None:
        raise HTTPException(status_code=404, detail="Form template not found")

    return jsonable_encoder(form_template)

# [Student] Get previous student forms
@app.get("/get_student_form")
def get_student_form(student_id: int, subject_id: int):
    form = crud.get_fact_user_form(get_db(), student_id, subject_id)
    return form

# [Student] Get form description
@app.get("/get_student_form_description")
def get_student_form(form_template_id: int, student_id: int, subject_id: int):
    form_info = {}
    form_template = crud.get_dim_form_template(get_db(), form_template_id=form_template_id)
    form_info.update({"title": form_template.Title})
    form_info.update({"subjectID": student_id})
    form_info.update({"studentID": subject_id})
    return form_info

# [Student] Save student form data
@app.post("/save_form_entry")
def save_form_entry(
    form_data: DataEntryPageSubmissionData, db: Session = Depends(get_db)
):
    try:
        created_form_response = crud.create_dim_user_form_response(db, form_data)
        userFormResponseID = created_form_response.UserFormResponseID
        fact_user_form_obj = createFactUserFormSchema(
            form_data.dict(), userFormResponseID
        )
        create_dim_user_form_response = crud.create_fact_user_form(
            db, fact_user_form_obj
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Form entry failed to save")

    return {"status": 200, "message": "Form entry saved successfully"}
