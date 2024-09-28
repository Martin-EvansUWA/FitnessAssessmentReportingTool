import json
from datetime import datetime, timedelta, timezone
from http.client import HTTPException

# Login and Encryption Imports
import jwt

# Website Imports
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing_extensions import Annotated

# Database Imports  ``
import crud
import models

# Auth Imports
from auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    CREDENTIALS_EXCEPTION,
    SECRET_KEY,
    Token,
    TokenData,
    authenticate_user,
    create_access_token,
)
from crud import *
from database import SessionLocal, engine
from models import *
from process import createFactUserFormSchema, createFormTemplateSchema, createNewUser
from schemas import (
    DataEntryPageSubmissionData,
    DimFormTemplateCreate,
    DimUser,
    DimUserCreate,
    DimUserFormResponseCreate,
)

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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login_user")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


""" AUTHENTICATION FUNCTIONS"""


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise CREDENTIALS_EXCEPTION
        token_data = TokenData(id=user_id)
    except InvalidTokenError:
        raise CREDENTIALS_EXCEPTION
    user = crud.get_DimUser(db, user_id=token_data.id)
    if user is None:
        raise CREDENTIALS_EXCEPTION
    return user


async def get_current_admin(
    current_user: Annotated[DimUser, Depends(get_current_user)],
):
    if not current_user.isAdmin:
        raise CREDENTIALS_EXCEPTION
    return current_user


@app.post("/login_user")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.UserID}, expires_delta=access_token_expires
    )
    ret_token = Token(access_token=access_token, token_type="bearer")

    response = {}
    response.update({"access_token": ret_token.access_token})
    response.update({"isAdmin": user.isAdmin})
    response.update({"user_first_name": user.FirstName})
    response.update({"user_last_name": user.LastName})
    return response


# TODO: Remove this endpoint since logout is handled by the frontend? - Double check logic
@app.get("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return 200


@app.get("/current_user")
async def current_user(
    current_user: Annotated[DimUser, Depends(get_current_user)],
):
    return current_user.FirstName


@app.post("/register")
async def register(form_data: DimUserCreate, db: Session = Depends(get_db)):
    new_user = createNewUser(form_data=form_data.dict())
    try:
        ret = crud.create_DimUser(db, new_user)
        if ret is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        else:
            return 200
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists",
        )


""" HELPER FUNCTIONS """


@app.get("/get_user_id")
def get_user_id(
    current_user: Annotated[DimUser, Depends(get_current_user)],
):
    return current_user.UserID


""" ADMIN FUNCTIONS """


# [Admin] Sending admin id, to receive a list of form to display on the sidebar of the admin dashboard
@app.get("/retrieve_admin_sidebar_info")
def retrieve_admin_sidebar_info(
    current_user: Annotated[DimUser, Depends(get_current_admin)],
    db: Session = Depends(get_db),
):
    response = []
    forms = crud.get_form_templates_by_admin(db, current_user.UserID)

    for form in forms:
        form_info = {
            "FormTemplateID": form.FormTemplateID,
            "Title": form.Title,
            "CreatedAt": form.CreatedAt,
        }
        response.append(form_info)

    return response


# [Admin] Retrieve admin form template, to display on admin dashboard
@app.get("/retrieve_admin_form_template/{form_id}")
def retrive_admin_form_template(
    form_template_id: int,
    current_user: Annotated[DimUser, Depends(get_current_admin)],
    db: Session = Depends(get_db),
):
    response = {}
    form_template = crud.get_dim_form_template(db, form_template_id=form_template_id)
    response.update({form_template_id: form_template})
    return response


# [Admin] Create a new form template
@app.post("/create_form")
def add_form(
    form_data: DimFormTemplateCreate,
    current_user: Annotated[DimUser, Depends(get_current_admin)],
    db: Session = Depends(get_db),
):
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


""" STUDENT FUNCTIONS"""


# [Student] Get sidebar info of student forms
@app.get("/retrieve_student_form_sidebar_info")
def retrieve_student_form_sidebar_info(
    current_user: Annotated[DimUser, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    response = []
    forms = crud.get_fact_multiple_user_forms(
        db, user_id=current_user.UserID
    )  # Student ID could be both StudentID or SubjectStudentID

    for form in forms:
        form_template = crud.get_dim_form_template(db, form.FormTemplateID)
        form_info = {
            "FactUserFormID": form.FactUserFormID,
            "UserFormResponseID": form.UserFormResponseID,
            "FormTemplateID": form.FormTemplateID,
            "title": form_template.Title,
            "UserID": form.UserID,
            "SubjectUserID": form.SubjectUserID,
            "IsComplete": form.IsComplete,
            "CreatedAt": form.CreatedAt,
            "CompletedAt": form.CompleteAt,
        }
        response.append(form_info)

    return response


# [Student] Retrieve form template by form id
@app.get("/retrieve_form_template/{form_id}")
def retrieve_form_template(
    form_id: int,
    current_user: Annotated[DimUser, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    try:
        form_template = crud.get_dim_form_template(db, form_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if form_template is None:
        raise HTTPException(status_code=404, detail="Form template not found")

    return jsonable_encoder(form_template)


# [Student] Get previous student forms
@app.get("/get_student_form")
def get_student_form(
    subject_id: int,
    current_user: Annotated[DimUser, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    form = crud.get_fact_user_form(db, current_user.UserID, subject_id)
    return form


# [Student] Get form description
@app.get("/get_student_form_description/{fact_user_form_id}")
def get_student_form_description(
    fact_user_form_id: int,
    current_user: Annotated[DimUser, Depends(get_current_user)],
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
    form_data: DataEntryPageSubmissionData,
    current_user: Annotated[DimUser, Depends(get_current_user)],
    db: Session = Depends(get_db),
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


""" DATA VISUALISATION FUNCTION"""


# get all students data
@app.get("/student_data/{FormID}")
def get_student_form_responses(
    FormID: int,
    current_user: Annotated[DimUser, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    students = crud.get_filtered_exercises_by_form_template_id(
        db, form_template_id=FormID
    )
    if not students:
        raise HTTPException(status_code=404, detail="Form responses not found")

    return students


# get specific students data
@app.get("/specific_student_data/{FormID}")
def get_specific_student_data(
    current_user: Annotated[DimUser, Depends(get_current_user)],
    FormID=int,
    db: Session = Depends(get_db),
):
    student = crud.get_student_form_response(
        db, form_template_id=FormID, user_id=current_user.UserID
    )  # Example with student ID 1

    return student


# get specific students data from factUserFormID
@app.get("/get_specific_student_data_fact_user_form_id/{fact_user_form_id}")
def get_specific_student_data_fact_user_form_id(
    current_user: Annotated[DimUser, Depends(get_current_user)],
    fact_user_form_id=int,
    db: Session = Depends(get_db),
):
    student = crud.get_student_form_response_fact_user_form_id(
        db, fact_user_form_id=fact_user_form_id
    )
    return student


@app.get("/normative_results/{student_id}/{form_template_id}")
def get_normative_results(
    current_user: Annotated[DimUser, Depends(get_current_user)],
    form_template_id: int,
    db: Session = Depends(get_db),
):
    try:
        results = calculate_normative_results(db, form_template_id, current_user.UserID)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/read_form_submissions/{form_template_id}")
def read_form_submissions(
    current_user: Annotated[DimUser, Depends(get_current_admin)],
    form_template_id: int,
    db: Session = Depends(get_db),
):
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
                "user_id": submission[3],  # Access UserID from the tuple
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
def delete_form_submissions(
    current_user: Annotated[DimUser, Depends(get_current_admin)],
    student_ids: List[int],
    db: Session = Depends(get_db),
):
    if not student_ids:
        return {"message": "No student IDs provided."}

    try:
        db.query(FactUserForm).filter(FactUserForm.UserID.in_(student_ids)).delete(
            synchronize_session=False
        )
        db.commit()
        return {"message": "Selected submissions deleted successfully."}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 400


@app.get("/forms/{form_template_id}/export", response_class=FileResponse)
def export_form_responses(
    current_user: Annotated[DimUser, Depends(get_current_admin)],
    form_template_id: int,
    db: Session = Depends(get_db),
):
    # Use the existing function to get responses
    responses = get_form_responses(db, form_template_id)
    # Logic to convert responses to CSV/XLSX format and return the file
    export_file = create_export_file(responses)
    return FileResponse(
        export_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="form_responses.xlsx",
    )
