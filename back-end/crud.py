import models
import schemas
import numpy as np
import json
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Dict, Any
from models import FactUserForm, DimUserFormResponse
from models import DimUserFormResponse, FactUserForm
from scipy.stats import percentileofscore
from fastapi import Query


# DimUser CRUD operations

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
def get_dim_form_template(db: Session, form_template_id: int) -> models.DimFormTemplate:
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
        CreatedAt=dim_form_template.CreatedAt,
    )
    db.add(db_dim_form_template)
    db.commit()
    db.refresh(db_dim_form_template)
    return db_dim_form_template


def get_forms_by_admin(db: Session, admin_id: int):
    return (
        db.query(models.DimFormTemplate)
        .filter(models.DimFormTemplate.AdminId == admin_id)
        .all()
    )


def save_student_form(db: Session, student_form: schemas.FactUserFormCreate):
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
    return db_student_form


# DimUserFormResponse CRUD operations
def get_dim_user_form_response(db: Session, response_id: int):
    return (
        db.query(models.DimUserFormResponse)
        .filter(models.DimUserFormResponse.UserFormResponseID == response_id)
        .first()
    )
    
def get_all_responses(db: Session):
    return db.query(DimUserFormResponse).all()


def aggregate_data_by_category(data: List[Dict]) -> Dict[str, Dict[str, float]]:
    category_aggregates = {}
    
    for entry in data:
        # Assuming `entry.UserFormResponse` is already a dictionary
        form_data = entry.UserFormResponse
        
        for category, measurements in form_data.items():
            
            if category == "Student Details":
                continue  # Skip "Student Details" category
            
            if category not in category_aggregates:
                category_aggregates[category] = {}
                
            for measurement, value in measurements.items():
                
                try:
                    numeric_value = float(value)
                except ValueError:
                    continue  # Skip values that can't be converted
                
                if measurement not in category_aggregates[category]:
                    category_aggregates[category][measurement] = []
                category_aggregates[category][measurement].append(value)
    
    for category, measurements in category_aggregates.items():
        for measurement, values in measurements.items():
            measurements[measurement] = mean(values)
    
    return category_aggregates






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
    subject_user_id: int,
):
    return db.query(models.FactUserForm).filter(
        models.FactUserForm.StudentID == student_id,
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


def get_form_responses(db: Session, form_template_id: int):
    """Fetch all form responses for a form template."""
    
    responses = db.execute(
        select(DimUserFormResponse.UserFormResponse)
        .join(FactUserForm, FactUserForm.UserFormResponseID == DimUserFormResponse.UserFormResponseID)
        .where(FactUserForm.FormTemplateID == form_template_id)
    ).scalars().all()
    
    return [response for response in responses]

def get_student_form_response(db: Session, form_template_id: int, studentID:int):
    """Fetch all form responses for a specific student and form template."""
    responses = db.execute(
        select(DimUserFormResponse.UserFormResponse)
        .join(FactUserForm, FactUserForm.UserFormResponseID == DimUserFormResponse.UserFormResponseID)
        .where(FactUserForm.FormTemplateID == form_template_id, FactUserForm.SubjectStudentID == studentID)
    ).scalars().all()
    
    return [response for response in responses]


# Crud Aggregations

def calculate_percentile_rank(values: List[float], value: float) -> float:
    """Helper function to calculate percentile rank."""
    return percentileofscore(values, value, kind='rank')


def get_student_percentile(db: Session, form_template_id: int, student_id: int) -> Dict[str, Dict[str, float]]:
    """Fetches student data and calculates percentile rank for all measurements within the cohort."""
    
    # Initialize dictionaries to store percentile ranks
    student_percentiles = {}
    
    # Fetch the specific student's form responses
    responses = get_student_form_response(db, form_template_id, student_id)
    
    # Collect all measurement values for percentile calculation
    all_measurement_values = {}

    # Collect values for all measurements from all students
    all_responses = get_form_responses(db,form_template_id)

    for all_form_data in all_responses:
        
        for category, measurements in all_form_data.items():
            for measurement, value in measurements.items():
                if measurement not in all_measurement_values:
                    all_measurement_values[measurement] = []
                all_measurement_values[measurement].append(value)

    # Get the student's specific values for all measurements
    student_measurements = {}

    for student_form_data in responses:

        for category, measurements in student_form_data.items():
            for measurement, value in measurements.items():
                student_measurements[measurement] = value

    # Calculate percentile ranks for each measurement
    for measurement, values in all_measurement_values.items():
        student_value = student_measurements.get(measurement, None)
        if student_value is not None:
            percentile_rank = calculate_percentile_rank(values, student_value)
            student_percentiles[measurement] = {
                "student_value": student_value,
                "percentile_rank": percentile_rank
            }
    
    return {
        "student_id": student_id,
        "percentiles": student_percentiles
    }

    
def calculate_quartiles_for_exercises(responses):
    """Calculate quartiles for each exercise from the form responses."""
    quartile_results = {}
    
    # Accumulate all responses for each exercise
    exercise_data = {}
    
    for response in responses:
        for exercise, data_points in response.items():
            if isinstance(data_points, int):  # Handle single integer response
                data_points = [data_points]
            
            if isinstance(data_points, list) and all(isinstance(x, int) for x in data_points):
                if exercise not in exercise_data:
                    exercise_data[exercise] = []
                exercise_data[exercise].extend(data_points)
    
    # Calculate quartiles for each exercise
    for exercise, data_points in exercise_data.items():
        if len(data_points) > 0:
            q1 = np.percentile(data_points, 25)
            q2 = np.percentile(data_points, 50)  # Median
            q3 = np.percentile(data_points, 75)
            
            quartile_results[exercise] = {
                "Q1": q1,
                "Q2": q2,
                "Q3": q3
            }
    
    return quartile_results


# Function to determine student quartiles
def determine_student_quartiles(student_response, quartile_data):
    """Determine where the student's results fall for each exercise."""
    student_quartile_results = {}
    
    for exercise, result in student_response.items():
        if isinstance(result, int):  # Ensure result is an integer
            if exercise in quartile_data:
                q1, q2, q3 = quartile_data[exercise]["Q1"], quartile_data[exercise]["Q2"], quartile_data[exercise]["Q3"]
                
                if result >= q3:
                    student_quartile_results[exercise] = "upper quartile"
                elif result >= q2:
                    student_quartile_results[exercise] = "middle quartile"
                else:
                    student_quartile_results[exercise] = "lower quartile"
            else:
                student_quartile_results[exercise] = "not available in quartile data"
        else:
            student_quartile_results[exercise] = "not an int"
    
    return student_quartile_results
