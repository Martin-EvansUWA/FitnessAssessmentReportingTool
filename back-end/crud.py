from difflib import SequenceMatcher
from tempfile import NamedTemporaryFile

# DimUser CRUD operations
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

import models
import schemas
from models import DimFormTemplate, DimUser, DimUserFormResponse, FactUserForm


# Get Student via their StudentID
def get_DimUser(db: Session, DimStudent_ID: int):
    return (
        db.query(models.DimUser)
        .filter(models.DimUser.StudentID == DimStudent_ID)
        .first()
    )


def get_DimUser_by_email(db: Session, email: str):
    return db.query(models.DimUser).filter(models.DimUser.email == email).first()


def get_DimUsers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimUser).offset(skip).limit(limit).all()


def create_DimUser(db: Session, DimUser: schemas.DimUserCreate):
    fake_hashed_password = (
        DimUser.password + "notreallyhashed"
    )  # Replace with actual hashing
    db_DimUser = models.DimUser(
        email=DimUser.email,
        hashed_password=fake_hashed_password,
        FirstName=DimUser.FirstName,  # Default or handle according to your logic
        LastName=DimUser.LastName,  # Default or handle according to your logic
        StudentID=DimUser.StudentID,
    )
    db.add(db_DimUser)
    db.commit()
    db.refresh(db_DimUser)
    return db_DimUser


def delete_DimUser(db: Session, DimStudent_ID: int):
    temp_user = (
        db.query(models.DimUser)
        .filter(models.DimUser.StudentID == DimStudent_ID)
        .first()
    )
    db.delete(temp_user)
    db.commit()
    return {"msg": "Student deleted successfully"}


# Admin CRUD operations
def get_admin(db: Session, staff_id: int):
    return db.query(models.DimAdmin).filter(models.DimAdmin.StaffID == staff_id).first()


def get_admin_by_email(db: Session, email: str):
    return db.query(models.DimAdmin).filter(models.DimAdmin.email == email).first()


def get_admins(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimAdmin).offset(skip).limit(limit).all()


def create_admin(db: Session, new_admin: schemas.DimAdminCreate):
    fake_hashed_password = (
        new_admin.password + "notreallyhashed"
    )  # Replace with actual hashing
    db_admin = models.DimAdmin(
        email=new_admin.email,
        hashed_password=fake_hashed_password,
        FirstName=new_admin.FirstName,  # Default or handle according to your logic
        LastName=new_admin.LastName,  # Default or handle according to your logic
        StaffID=new_admin.StaffID,  # Default or derive from logic
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


def delete_admin(db: Session, Staff_ID: int):
    temp_admin = (
        db.query(models.DimAdmin).filter(models.DimAdmin.StaffID == Staff_ID).first()
    )
    db.delete(temp_admin)
    db.commit()
    return {"msg": "Admin deleted successfully"}


# DimFormTemplate CRUD operations
def get_dim_form_template(db: Session, form_template_id: int):
    return (
        db.query(models.DimFormTemplate)
        .filter(models.DimFormTemplate.FormTemplateID == form_template_id)
        .first()
    )


def get_dim_form_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimFormTemplate).offset(skip).limit(limit).all()


def create_dim_form_template(
    db: Session, dim_form_template: schemas.DimFormTemplateCreate
):
    db_dim_form_template = models.DimFormTemplate(
        StaffID=dim_form_template.StaffID,  # Set AdminId appropriately
        FormTemplate=dim_form_template.FormTemplate,
        Title=dim_form_template.Title,
        Description=dim_form_template.Description,
    )
    db.add(db_dim_form_template)
    db.commit()
    db.refresh(db_dim_form_template)
    return db_dim_form_template


def get_form_templates_by_admin(db: Session, admin_id: int):
    return (
        db.query(models.DimFormTemplate)
        .filter(models.DimFormTemplate.AdminId == admin_id)
        .all()
    )


def save_student_form(db: Session, student_form: schemas.FactUserFormCreate):
    try:
        db_student_form = models.FactUserForm(
            FormTemplateId=student_form.FormTemplateId,
            UserId=student_form.UserId,
            SubjectUserId=student_form.SubjectUserId,
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
def get_dim_user_form_response(db: Session, response_id: int):
    return (
        db.query(models.DimUserFormResponse)
        .filter(models.DimUserFormResponse.UserFormResponseID == response_id)
        .first()
    )


def get_dim_user_form_responses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimUserFormResponse).offset(skip).limit(limit).all()


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
def get_fact_user_form(
    db: Session,
    user_id: int,
    subject_user_id: int,
):
    return (
        db.query(models.FactUserForm)
        .filter(
            models.FactUserForm.StudentID == user_id,
            models.FactUserForm.SubjectStudentID == subject_user_id,
        )
        .first()
    )


def get_fact_multiple_user_forms(
    db: Session,
    student_id: int,
):
    # Both StudentID and SubjectStudentID are used to get all forms associated with a student
    return db.query(models.FactUserForm).filter(
        or_(
            models.FactUserForm.StudentID == student_id,
            models.FactUserForm.SubjectStudentID == student_id,
        )
    )


def get_all_fact_user_forms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FactUserForm).offset(skip).limit(limit).all()


def create_fact_user_form(db: Session, fact_user_form: schemas.FactUserFormCreate):
    db_fact_user_form = models.FactUserForm(
        FormTemplateID=fact_user_form.FormTemplateID,
        UserFormResponseID=fact_user_form.UserFormResponseID,
        StudentID=fact_user_form.StudentID,
        SubjectStudentID=fact_user_form.SubjectStudentID,
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


def get_student_form_response(db: Session, form_template_id: int, studentID: int):
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
                FactUserForm.SubjectStudentID == studentID,
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
    print(filtered_responses)
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
    db: Session, form_template_id: int, studentID: int
) -> List[Dict[str, Dict[str, int]]]:
    # Get the student's specific responses
    student_responses = get_student_form_response(db, form_template_id, studentID)
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

    return [normative_results]


def get_form_submissions(db: Session, form_template_id: int):
    return (
        db.query(
            FactUserForm,
            DimUser.FirstName,
            DimUser.LastName,
            DimUser.StudentID,
            FactUserForm.SubjectStudentID,
        )  # Include StudentID here
        .join(DimUser, FactUserForm.StudentID == DimUser.StudentID)
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
