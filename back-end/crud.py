from difflib import SequenceMatcher
from tempfile import NamedTemporaryFile

# DimUser CRUD operations
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from fastapi import HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

import models
import schemas
from models import DimFormTemplate, DimUser, DimUserFormResponse, FactUserForm

import random
import string

# Get user via their UserID
def get_DimUser(db: Session, user_id: int):
    return db.query(models.DimUser).filter(models.DimUser.UserID == user_id).first()


# Get Student via their email
def get_DimUser_by_email(db: Session, email: str):
    return db.query(models.DimUser).filter(models.DimUser.email == email).first()


# Get n amount of users
def get_DimUsers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimUser).offset(skip).limit(limit).all()


# Create a new user
def create_DimUser(db: Session, DimUser: schemas.DimUserCreate):
    db_DimUser = models.DimUser(
        email=DimUser.email,
        hashed_password=DimUser.password,
        FirstName=DimUser.FirstName,
        LastName=DimUser.LastName,
        UserID=DimUser.UserID,
        isAdmin=False,
    )
    db.add(db_DimUser)
    db.commit()
    db.refresh(db_DimUser)
    return db_DimUser


def promote_User(db: Session, user_id: int):
    user = db.query(models.DimUser).filter(models.DimUser.UserID == user_id).first()
    if not user:
        return {"msg": "User not found", "status": "error"}

    user.isAdmin = True

    db.commit()
    db.refresh(user)

    return {"msg": "User promoted successfully", "status": "success"}


# Delete a user
def delete_DimUser(db: Session, user_id: int):
    temp_user = (
        db.query(models.DimUser).filter(models.DimUser.UserID == user_id).first()
    )
    db.delete(temp_user)
    db.commit()
    return {"msg": "Student deleted successfully"}


# Get an admin by id
def get_admin(db: Session, admin_id: int):
    return (
        db.query(models.DimUser)
        .filter(models.DimUser.UserID == admin_id and models.DimUser.isAdmin == True)
        .first()
    )


# Get an admin by email
def get_admin(db: Session, email: str):
    return (
        db.query(models.DimUser)
        .filter(models.DimUser.email == email and models.DimUser.isAdmin == True)
        .first()
    )


# DimFormTemplate CRUD operations
def get_dim_form_template(db: Session, form_template_id: int):
    return (
        db.query(models.DimFormTemplate)
        .filter(models.DimFormTemplate.FormTemplateID == form_template_id)
        .first()
    )


# Get n amounts of form templates
def get_dim_form_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimFormTemplate).offset(skip).limit(limit).all()


# Create new form template
def create_dim_form_template(
    db: Session, dim_form_template: schemas.DimFormTemplateCreate
):
    db_dim_form_template = models.DimFormTemplate(
        UserID=dim_form_template.UserID,
        FormTemplate=dim_form_template.FormTemplate,
        Title=dim_form_template.Title,
        CreatedAt=dim_form_template.CreatedAt,
        Description=dim_form_template.Description,
    )
    db.add(db_dim_form_template)
    db.commit()
    db.refresh(db_dim_form_template)
    return db_dim_form_template


def get_form_templates_by_admin(db: Session, user_id: int):
    return (
        db.query(models.DimFormTemplate)
        .filter(models.DimFormTemplate.UserID == user_id)
        .all()
    )


# Save a students form data
def save_student_form(db: Session, student_form: schemas.FactUserFormCreate):
    try:
        db_student_form = models.FactUserForm(
            FormTemplateId=student_form.FormTemplateID,
            UserID=student_form.UserID,
            SubjectUserId=student_form.SubjectUserID,
            IsComplete=student_form.IsComplete,
            CreatedAt=student_form.CreatedAt,
            CompleteAt=student_form.CompleteAt,
        )
        db.add(db_student_form)
        db.commit()
        db.refresh(db_student_form)
    except:
        return ValueError
    return db_student_form


# DimUserFormResponse CRUD operations


# Get a students response
def get_dim_user_form_response(db: Session, response_id: int):
    return (
        db.query(models.DimUserFormResponse)
        .filter(models.DimUserFormResponse.UserFormResponseID == response_id)
        .first()
    )


# Get n amount of form responses
def get_dim_user_form_responses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimUserFormResponse).offset(skip).limit(limit).all()


# Check if a user form response exists by the UserID, CreatedAt, FormTemplateID, and SubjectUserID
def check_if_user_form_response_exists(
    db: Session,
    user_id: int,
    created_at: str,
    form_template_id: int,
    subject_user_id: int,
):
    existing_fact_user_form = (
        db.query(models.FactUserForm)
        .filter(
            models.FactUserForm.UserID == user_id,
            models.FactUserForm.CreatedAt == created_at,
            models.FactUserForm.FormTemplateID == form_template_id,
            models.FactUserForm.SubjectUserID == subject_user_id,
        )
        .first()
    )
    return existing_fact_user_form


def update_dim_user_form_response(db: Session, response_id: int, new_response: str):
    db_response = (
        db.query(models.DimUserFormResponse)
        .filter(models.DimUserFormResponse.UserFormResponseID == response_id)
        .first()
    )
    db_response.UserFormResponse = new_response
    db.commit()
    db.refresh(db_response)
    return db_response


# Create a new form response
def create_dim_user_form_response(
    db: Session, dim_user_form_response: schemas.DataEntryPageSubmissionData
):
    db_dim_user_form_response = models.DimUserFormResponse(
        UserFormResponse=dim_user_form_response.UserFormResponse,
    )
    db.add(db_dim_user_form_response)
    db.commit()
    db.refresh(db_dim_user_form_response)
    return db_dim_user_form_response


# FactUserForm CRUD operations
# Get fact user form by ID
def get_fact_user_form_by_id(db: Session, fact_user_form_id: int):
    return (
        db.query(models.FactUserForm)
        .filter(models.FactUserForm.FactUserFormID == fact_user_form_id)
        .first()
    )


# Get a specific user form
def get_fact_user_form(
    db: Session,
    user_id: int,
    subject_user_id: int,
):
    return (
        db.query(models.FactUserForm)
        .filter(
            models.FactUserForm.UserID == user_id,
            models.FactUserForm.SubjectUserID == subject_user_id,
        )
        .first()
    )


# Get all forms of a given student
def get_fact_multiple_user_forms(
    db: Session,
    user_id: int,
):
    # Both StudentID and SubjectStudentID are used to get all forms associated with a student
    return db.query(models.FactUserForm).filter(
        models.FactUserForm.UserID == user_id,
    )


# Get all fact user forms
def get_all_fact_user_forms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FactUserForm).offset(skip).limit(limit).all()


# Create a new fact user form
def create_fact_user_form(db: Session, fact_user_form: schemas.FactUserFormCreate):
    db_fact_user_form = models.FactUserForm(
        FormTemplateID=fact_user_form.FormTemplateID,
        UserFormResponseID=fact_user_form.UserFormResponseID,
        UserID=fact_user_form.UserID,
        SubjectUserID=fact_user_form.SubjectUserID,
        IsComplete=fact_user_form.IsComplete,
        CreatedAt=fact_user_form.CreatedAt,
        CompleteAt=fact_user_form.CompleteAt,
    )
    db.add(db_fact_user_form)
    db.commit()
    db.refresh(db_fact_user_form)
    return db_fact_user_form


def get_form_template_id_from_fact_user_form(db: Session, fact_user_form_id: int):
    return (
        db.query(models.FactUserForm.FormTemplateID)
        .filter(models.FactUserForm.FactUserFormID == fact_user_form_id)
        .first()
    )[0]


def get_form_responses(db: Session, form_template_id: int):
    """Fetch all form responses for a form template."""

    responses = (
        db.execute(
            select(DimUserFormResponse.UserFormResponse)
            .join(
                FactUserForm,
                FactUserForm.UserFormResponseID
                == DimUserFormResponse.UserFormResponseID,
            )
            .where(FactUserForm.FormTemplateID == form_template_id)
        )
        .scalars()
        .all()
    )

    return responses


def get_student_form_response(db: Session, form_template_id: int, user_id: int):
    """Fetch all form responses for a specific student and form template."""
    responses = (
        db.execute(
            select(DimUserFormResponse.UserFormResponse)
            .join(
                FactUserForm,
                FactUserForm.UserFormResponseID
                == DimUserFormResponse.UserFormResponseID,
            )
            .where(
                FactUserForm.FormTemplateID == form_template_id,
                FactUserForm.SubjectUserID == user_id,
            )
        )
        .scalars()
        .all()
    )

    return responses


def get_pop_up_student_data(db: Session, form_template_id: int, subject_id: int):
    """Fetch all form responses for a specific student and form template."""
    responses = (
        db.execute(
            select(DimUserFormResponse.UserFormResponse)
            .join(
                FactUserForm,
                FactUserForm.UserFormResponseID
                == DimUserFormResponse.UserFormResponseID,
            )
            .where(
                FactUserForm.FormTemplateID == form_template_id,
                FactUserForm.SubjectUserID == subject_id,
            )
        )
        .scalars()
        .all()
    )

    return responses


def get_student_form_response_fact_user_form_id(db: Session, fact_user_form_id: int):
    """Fetch a form response for a specific fact_user_form_id."""
    response = db.execute(
        select(DimUserFormResponse.UserFormResponse)
        .join(
            FactUserForm,
            FactUserForm.UserFormResponseID == DimUserFormResponse.UserFormResponseID,
        )
        .where(FactUserForm.FactUserFormID == fact_user_form_id)
    ).scalar_one()

    return response


# changed to return the students results not the value they inputed
def get_student_form_response_responce_id(
    db: Session, FormTemplateID: int, SubjectUserID: int
):
    """Fetch a form response for a specific template and responce ID"""
    response = db.execute(
        select(DimUserFormResponse.UserFormResponse)
        .join(
            FactUserForm,
            FactUserForm.UserFormResponseID == DimUserFormResponse.UserFormResponseID,
        )
        .where(
            FactUserForm.FormTemplateID == FormTemplateID,
            FactUserForm.SubjectUserID == SubjectUserID,
        )
    ).scalar_one()

    return response


def get_filtered_exercises_by_form_template_id(db: Session, form_template_id):
    # Query the form template for the given ID
    form_template = (
        db.query(DimFormTemplate).filter_by(FormTemplateID=form_template_id).first()
    )

    if not form_template:
        return []

    # Extract the JSON structure of the form template
    template_structure = form_template.FormTemplate

    # Query to get all user form responses associated with the specified form template ID
    form_responses = db.query(DimUserFormResponse).all()

    # List to store the filtered results
    filtered_responses = []

    # Iterate through each form response
    for response in form_responses:
        user_form_response = response.UserFormResponse
        filtered_data = {}

        # Track if the response has any matching categories/exercises
        has_matching_entry = False

        # Iterate over categories in the form template
        for category, exercises in template_structure.items():
            # Look for a matching category in the user response, considering 85% similarity and case-insensitivity
            for user_category in user_form_response.keys():
                similarity_score = similar(category.lower(), user_category.lower())
                if similarity_score >= 0.80:
                    # Always rename to form template category name (ensures case correction)
                    filtered_data[category] = {}

                    # Iterate over exercises in the matched category
                    for exercise in exercises:
                        # Check for case-insensitive match and 85% similarity for exercises
                        for user_exercise, user_value in user_form_response[
                            user_category
                        ].items():
                            exercise_similarity = similar(
                                exercise.lower(), user_exercise.lower()
                            )
                            if exercise_similarity >= 0.85:
                                # Always rename to form template exercise name (ensures case correction)
                                filtered_data[category][exercise] = user_value
                                has_matching_entry = True

        # Add the filtered response to the list only if it contains at least one matching entry
        if has_matching_entry:
            filtered_responses.append(filtered_data)
   
    return filtered_responses


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


def get_max_values(db: Session, form_template_id: int) -> Dict[str, Dict[str, int]]:
    # Get the filtered exercises for the form template
    filtered_exercises = get_filtered_exercises_by_form_template_id(
        db, form_template_id
    )

    # Prepare a dictionary to hold the maximum values
    max_values = {}

    # Iterate over each student response in filtered_exercises
    for student_response in filtered_exercises:
        for category, exercises in student_response.items():
            # Initialize the category in max_values if not present
            if category not in max_values:
                max_values[category] = {}

            for exercise, value in exercises.items():
                if isinstance(value, int):  # Ensure the value is an integer
                    # Update the maximum value for the exercise
                    if exercise not in max_values[category]:
                        max_values[category][exercise] = value
                    else:
                        max_values[category][exercise] = max(
                            max_values[category][exercise], value
                        )

    return max_values


def calculate_normative_results(
    db: Session, form_template_id: int, user_id: int
) -> List[Dict[str, Dict[str, int]]]:
    # Get the student's specific responses
    student_responses = get_student_form_response(db, form_template_id, user_id)
    if not student_responses:
        return [
            {}
        ]  # Return an empty list with an empty dictionary if no responses found

    # Get the maximum values for exercises
    max_values = get_max_values(db, form_template_id)

    # Flatten the list of student responses into a single dictionary
    student_response_data = {}
    for response in student_responses:
        user_response = response
        for category, exercises in user_response.items():
            if category not in student_response_data:
                student_response_data[category] = {}
            student_response_data[category].update(exercises)

    # Calculate normative results
    normative_results = {}
    for category, exercises in max_values.items():
        if category not in normative_results:
            normative_results[category] = {}
        for exercise, max_value in exercises.items():
            student_value = student_response_data.get(category, {}).get(exercise, 0)
            if isinstance(student_value, int):  # Check if student_value is an integer
                if max_value > 0:
                    # Calculate the normative result, multiply by 100, and convert to an integer
                    normative_results[category][exercise] = int(
                        (student_value / max_value) * 100
                    )
                else:
                    normative_results[category][
                        exercise
                    ] = None  # or some other value indicating invalid norm
    print(normative_results)
    return [normative_results]


def get_form_submissions(db: Session, form_template_id: int):
    return (
        db.query(
            FactUserForm,
            DimUser.FirstName,
            DimUser.LastName,
            DimUser.UserID,
            FactUserForm.SubjectUserID,
        )  # Include StudentID here
        .join(DimUser, FactUserForm.UserID == DimUser.UserID)
        .filter(FactUserForm.FormTemplateID == form_template_id)
        .order_by(DimUser.FirstName)  # Alphabetical sorting by first name
        .all()
    )


def flatten_response(response):
    """Flatten the nested response structure."""
    flat_response = {}

    for key, value in response.items():
        if isinstance(value, dict):
            for sub_key, sub_value in value.items():
                flat_response[f"{sub_key}"] = sub_value
        else:
            flat_response[key] = value

    return flat_response


def create_export_file(responses):
    # Flatten the responses
    flattened_responses = [flatten_response(response) for response in responses]

    # Convert the flattened responses to a pandas DataFrame
    df = pd.DataFrame(flattened_responses)

    # Save the file temporarily and return the path
    with NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
        df.to_excel(tmp.name, index=False)
        return tmp.name


def add_super_user_if_empty(db: Session):
    # Check if the table is empty by querying the model (not the schema)
    if not db.query(DimUser).first():
        # Add the super user
        super_user = DimUser(
            UserID=1,
            FirstName="SUPER",
            LastName="USER",
            email="SUPER.USER@mail.com",
            isAdmin=True,
            hashed_password="$2b$12$Kdm5oMsFb7bbNeFBhBJ13.SXqhvXN3w5.D4f9pJFvLMB6psqAjK4e",
        )
        db.add(super_user)
        db.commit()
        return {"message": "Super user added"}
    else:
        return {"message": "Super user already exists"}


# delete template and all entries in FactUserForm related to the form template
def delete_form_template(form_template_id: int, db: Session):
    try:
        fact_entries = (
            db.query(FactUserForm)
            .filter(FactUserForm.FormTemplateID == form_template_id)
            .all()
        )
        for entry in fact_entries:
            db.delete(entry)

        responses = (
            db.query(DimUserFormResponse)
            .filter(
                DimUserFormResponse.UserFormResponseID.in_(
                    db.query(FactUserForm.UserFormResponseID).filter(
                        FactUserForm.FormTemplateID == form_template_id
                    )
                )
            )
            .all()
        )

        for response in responses:
            db.delete(response)

        form_template = (
            db.query(DimFormTemplate)
            .filter(DimFormTemplate.FormTemplateID == form_template_id)
            .first()
        )
        if not form_template:
            raise HTTPException(status_code=404, detail="Form template not found")

        db.delete(form_template)
        db.commit()

        return {"message": "Form template and associated data deleted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


def get_subject_user_id(db: Session, fact_user_form_id: int):
    return (
        db.query(models.FactUserForm.SubjectUserID)
        .filter(models.FactUserForm.FactUserFormID == fact_user_form_id)
        .first()
    )[0]


# [admin delete]
def delete_form_template_and_related_entries(db: Session, form_template_id: int):
    fact_user_forms = (
        db.query(FactUserForm)
        .filter(FactUserForm.FormTemplateID == form_template_id)
        .all()
    )
    if fact_user_forms:
        user_form_response_ids = [fact.UserFormResponseID for fact in fact_user_forms]
        db.query(DimUserFormResponse).filter(
            DimUserFormResponse.UserFormResponseID.in_(user_form_response_ids)
        ).delete(synchronize_session=False)
        db.query(FactUserForm).filter(
            FactUserForm.FormTemplateID == form_template_id
        ).delete(synchronize_session=False)

    db.query(DimFormTemplate).filter(
        DimFormTemplate.FormTemplateID == form_template_id
    ).delete(synchronize_session=False)
    db.commit()


# Get all admin users
def get_all_admin_users(db: Session):
    # Return the user ID, name and email of all admin users
    return (
        db.query(DimUser.UserID, DimUser.FirstName, DimUser.LastName, DimUser.email)
        .filter(DimUser.isAdmin == True)
        .all()
    )


