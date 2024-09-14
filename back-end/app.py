import json
from http.client import HTTPException

from fastapi import Depends, FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
import models
from models import *
from crud import *
from database import SessionLocal, engine
from process import createFactUserFormSchema, createFormTemplateSchema
from schemas import (
    DataEntryPageSubmissionData,
    DimFormTemplateCreate,
    DimUserFormResponseCreate,
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


@app.get("/")
def index():
    return "temp"


@app.get("/student")
def student():
    return "student"


@app.get("/admin")
def student():
    return "admin"


@app.post("/form")
def form(form_json):
    form_data = json.loads(form_json)
    for key in form_data:
        print(key + ": " + str(form_data[key]))
    return "form"


# Sending admin id, to receive the form id's and the form titles
@app.get("/admin_forms/{id}")
def retrieve_admin_templates(admin_id: int):
    forms = get_forms_by_admin(admin_id)

    sidebar_info = {}
    for form in forms:
        sidebar_info.update({form.id: form.title})

    return sidebar_info


# [Admin] Create a new form template
@app.post("/create_form")
def add_form(form_data: DimFormTemplateCreate, db: Session = Depends(get_db)):
    try:
        # Process form data and add to database
        processed_data = createFormTemplateSchema(form_data.dict())
        created_form_template = crud.create_dim_form_template(db, processed_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"FormTemplateID": created_form_template.FormTemplateID}


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
        create_fact_user_form_response = crud.create_fact_user_form(
            db, fact_user_form_obj
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Form entry failed to save")

    return {"status": 200, "message": "Form entry saved successfully"}


# get all students data 
@app.get("/student_data/{FormID}")
def get_student_form_responses(FormID: int, db: Session = Depends(get_db)):
    students = crud.get_form_responses(db, form_template_id=FormID)
    if not students:
        raise HTTPException(status_code=404, detail="Form responses not found")

    return students


# get specific students data 
@app.get("/specific_student_data/{StudentID}/{FormID}")
def get_specific_student_data(StudentID = int, FormID=int, db: Session = Depends(get_db)):
    student = crud.get_student_form_response(db, form_template_id=FormID,  studentID=StudentID)  # Example with student ID 1
    
    return student

## Dosn't work outputs something like this {'Student Details': {'Name': 'not available in quartile data', 'Age': 'not available in quartile data', 'Height': 'not available in quartile data', 'Weight': 'not available in quartile data', 'idk': 'not available in quartile data'}}
@app.get("/normative_results/{student_id}/{form_template_id}")
async def get_normative_results(student_id: int, form_template_id: int, db: Session = Depends(get_db)):
    # Fetch form responses for the cohort (all students) and form template
    form_responses = get_form_responses(db, form_template_id)
    
    if not form_responses:
        raise HTTPException(status_code=404, detail="No responses found for the specified form template")

    # Calculate quartiles for all exercises based on the cohort
    quartile_data = calculate_quartiles_for_exercises(form_responses)
    
    # Fetch specific student's form response
    student_responses = get_student_form_response(db, form_template_id, student_id)
    
    if not student_responses:
        raise HTTPException(status_code=404, detail="No responses found for the specified student and form template")

    # Assuming the latest response is used for the student
    student_response = student_responses[-1] if student_responses else None
    
    if student_response is None:
        raise HTTPException(status_code=404, detail="No responses found for the specified student")

    # Determine which quartiles the student's responses fall into
    student_quartiles = determine_student_quartiles(student_response, quartile_data)

    # Construct dynamic response
    student_details = student_response.get('Student Details', {})
    normative_results = {
        "Student Details": {
            key: student_quartiles.get(key, "not available in quartile data")
            for key in student_details.keys()
        }
    }

    print("//////////Normative Results:" + str(normative_results))  # Debugging print
    return [
  {
    "Student Details": {
      "Name": "low", 
      "Age": "high", 
      "Height": "midume", 
      "Weight": "low", 
      "idk": "high" 
    },
    "felx": {
      "strech": "low" 
    }
  }
]
