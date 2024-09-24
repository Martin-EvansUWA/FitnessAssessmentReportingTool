import json
from http.client import HTTPException

from fastapi import Depends, FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import crud
import models
from crud import *
from database import SessionLocal, engine
from models import *
from process import createFactUserFormSchema, createFormTemplateSchema
from schemas import DataEntryPageSubmissionData, DimFormTemplateCreate

models.Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
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
@app.get("/retrieve_admin_sidebar_info/{admin_id}")
def retrieve_admin_templates(admin_id: int, db: Session = Depends(get_db)):
    response = {}
    forms = crud.get_formtemplates_by_admin(db, admin_id)

    sidebar_info = {}
    for form in forms:
        sidebar_info.update({form.id: form.title})

    response["sidebar_info"] = sidebar_info

    return response


# [Admin] Retrieve admin form template, to display on admin dashboard
@app.get("/retrieve_admin_form_template/{form_id}")
def retrive_admin_form_template(form_template_id: int, db: Session = Depends(get_db)):
    response = {}
    form_template = crud.get_dim_form_template(db, form_template_id=form_template_id)
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
@app.get("/retrieve_student_form_sidebar_info/{student_id}")
def retrieve_student_form_sidebar_info(student_id: int, db: Session = Depends(get_db)):
    response = []
    forms = crud.get_fact_multiple_user_forms(db, student_id)

    for form in forms:
        form_template = crud.get_dim_form_template(db, form.FormTemplateID)
        form_info = {
            "FactUserFormID": form.FactUserFormID,
            "UserFormResponseID": form.UserFormResponseID,
            "FormTemplateID": form.FormTemplateID,
            "title": form_template.Title,
            "StudentID": form.StudentID,
            "SubjectStudentID": form.SubjectStudentID,
            "IsComplete": form.IsComplete,
            "CreatedAt": form.CreatedAt,
            "CompletedAt": form.CompleteAt,
        }
        response.append(form_info)

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
def get_student_form(student_id: int, subject_id: int, db: Session = Depends(get_db)):
    form = crud.get_fact_user_form(db, student_id, subject_id)
    return form


# [Student] Get form description
@app.get("/get_student_form_description/{fact_user_form_id}")
def get_student_form_description(
    fact_user_form_id: int,
    db: Session = Depends(get_db),
):
    form_template_id = crud.get_form_template_id_from_fact_user_form(
        db, fact_user_form_id
    )  # Get FormTemplateID from FactUserForm table using FactUserFormID
    form_template = crud.get_dim_form_template(db, form_template_id=form_template_id)
    form_info = {
        "FormTemplateID": form_template.FormTemplateID,
        "Title": form_template.Title,
        "Description": form_template.Description,
    }
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


# get all students data
@app.get("/student_data/{FormID}")
def get_student_form_responses(FormID: int, db: Session = Depends(get_db)):
    students = crud.get_filtered_exercises_by_form_template_id(
        db, form_template_id=FormID
    )
    if not students:
        raise HTTPException(status_code=404, detail="Form responses not found")

    return students


# get specific students data
@app.get("/specific_student_data/{StudentID}/{FormID}")
def get_specific_student_data(StudentID=int, FormID=int, db: Session = Depends(get_db)):
    student = crud.get_student_form_response(
        db, form_template_id=FormID, studentID=StudentID
    )  # Example with student ID 1

    return student


@app.get("/normative_results/{student_id}/{form_template_id}")
def get_normative_results(
    student_id: int, form_template_id: int, db: Session = Depends(get_db)
):
    try:
        results = calculate_normative_results(db, form_template_id, student_id)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/forms/{form_template_id}/submissions")
def read_form_submissions(form_template_id: int, db: Session = Depends(get_db)):
    # Get form details
    form_details = (
        db.query(DimFormTemplate)
        .filter(DimFormTemplate.FormTemplateID == form_template_id)
        .first()
    )

    # Get form submissions
    submissions = get_form_submissions(db, form_template_id)

    # Return debugging information
    return {
        "form_details": {
            "form_template_id": form_details.FormTemplateID,
            "title": form_details.Title,
            "description": form_details.Description,
            "created_at": form_details.CreatedAt,
        },
        "submissions_count": len(submissions),  # Count of submissions
        "submissions": [
            {
                "student_id": submission[3],  # Access StudentID from the tuple
                "first_name": submission[1],  # Access FirstName from the tuple
                "last_name": submission[2],  # Access LastName from the tuple
                "subject_ID": submission[4],
                "submission_time": submission[
                    0
                ].CreatedAt,  # Access CreatedAt from FactUserForm
            }
            for submission in submissions
        ],
    }


# dosn't work but I dont know exactly what going wrong
@app.delete("/forms/delete-submissions")
def delete_form_submissions(student_ids: List[int], db: Session = Depends(get_db)):
    if not student_ids:
        return {"message": "No student IDs provided."}

    try:
        db.query(FactUserForm).filter(FactUserForm.StudentID.in_(student_ids)).delete(
            synchronize_session=False
        )
        db.commit()
        return {"message": "Selected submissions deleted successfully."}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 400


@app.get("/forms/{form_template_id}/export", response_class=FileResponse)
def export_form_responses(form_template_id: int, db: Session = Depends(get_db)):
    # Use the existing function to get responses
    responses = get_form_responses(db, form_template_id)
    # Logic to convert responses to CSV/XLSX format and return the file
    export_file = create_export_file(responses)
    return FileResponse(
        export_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="form_responses.xlsx",
    )
