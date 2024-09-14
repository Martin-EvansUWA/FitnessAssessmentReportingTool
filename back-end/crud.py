from sqlalchemy.orm import Session
from sqlalchemy import select
import models
from models import FactUserForm, DimUserFormResponse
import schemas
import numpy as np

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


#below crud applicaitons are just tempory they probably dont work and need to be fixed, just trying to get things hooked up 
def calculate_quartiles_for_exercises(responses):
    """Calculate quartiles for each exercise in the form responses."""
    quartile_results = {}
    
    # Assuming the form responses are JSON with each key being an exercise
    for response in responses:
        for exercise, data_points in response.items():
            # Ensure we're dealing with numerical data for the exercises
            if isinstance(data_points, list) and all(isinstance(x, int) for x in data_points):
                # Calculate quartiles for each exercise
                q1 = np.percentile(data_points, 25)
                q2 = np.percentile(data_points, 50)  # Median
                q3 = np.percentile(data_points, 75)
                
                quartile_results[exercise] = {
                    "Q1": q1,
                    "Q2": q2,
                    "Q3": q3
                }
    
    return quartile_results

def determine_student_quartiles(student_response, quartile_data):
    """Determine where the student's results fall for each exercise."""
    student_quartile_results = {}
    
    for exercise, result in student_response.items():
        if exercise in quartile_data:
            q1, q2, q3 = quartile_data[exercise]["Q1"], quartile_data[exercise]["Q2"], quartile_data[exercise]["Q3"]
            
            if result >= q3:
                student_quartile_results[exercise] = "upper quartile"
            elif result >= q2:
                student_quartile_results[exercise] = "middle quartile"
            else:
                student_quartile_results[exercise] = "lower quartile"
    
    return student_quartile_results


def get_form_responses(db: Session, form_template_id: int):
    """Fetch all form responses for a form template."""
    responses = db.execute(
        select(DimUserFormResponse.UserFormResponse)
        .join(FactUserForm, FactUserForm.UserFormResponseID == DimUserFormResponse.UserFormResponseID)
        .where(FactUserForm.FormTemplateID == form_template_id)
    ).scalars().all()
    
    return responses

def get_student_form_response(db: Session, form_template_id: int, studentID:int):
    """Fetch all form responses for a specific student and form template."""
    responses = db.execute(
        select(DimUserFormResponse.UserFormResponse)
        .join(FactUserForm, FactUserForm.UserFormResponseID == DimUserFormResponse.UserFormResponseID)
        .where(FactUserForm.FormTemplateID == form_template_id, FactUserForm.StudentID == studentID)
    ).scalars().all()
    
    return responses