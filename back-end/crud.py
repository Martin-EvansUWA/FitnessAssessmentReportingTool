from sqlalchemy.orm import Session

import models
import schemas

# DimUser CRUD operations


# Get Student via their StudentID
def get_DimUser(db: Session, DimStudent_ID: int):
    return (
        db.query(models.DimUser)
        .filter(models.DimUser.StudentID == DimStudent_ID)
        .first()
    )


# Get Student via their email
def get_DimUser_by_email(db: Session, email: str):
    return db.query(models.DimUser).filter(models.DimUser.email == email).first()

# Get n amount of users
def get_DimUsers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimUser).offset(skip).limit(limit).all()

# Creatre a new user
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

# Delete a user
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

# Get an admin by id
def get_admin(db: Session, staff_id: int):
    return db.query(models.DimAdmin).filter(models.DimAdmin.StaffID == staff_id).first()

# Get an admin by email
def get_admin_by_email(db: Session, email: str):
    return db.query(models.DimAdmin).filter(models.DimAdmin.email == email).first()

# Get n amount of admins
def get_admins(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimAdmin).offset(skip).limit(limit).all()

# Create new admin
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

# Delete an admin
def delete_admin(db: Session, Staff_ID: int):
    temp_admin = (
        db.query(models.DimAdmin).filter(models.DimAdmin.StaffID == Staff_ID).first()
    )
    db.delete(temp_admin)
    db.commit()
    return {"msg": "Admin deleted successfully"}


# DimFormTemplate CRUD operations

# Get form template from ID
def get_dim_form_template(db: Session, form_template_id: int) -> models.DimFormTemplate:
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

# Get an admins form templates
def get_forms_by_admin(db: Session, admin_id: int):
    return (
        db.query(models.DimFormTemplate)
        .filter(models.DimFormTemplate.AdminId == admin_id)
        .all()
    )

# Save a students form data
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
# Get a specific user form
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

# Get all forms of a given student
def get_fact_multiple_user_forms(
    db: Session,
    student_id: int,
):
    return db.query(models.FactUserForm).filter(
        models.FactUserForm.StudentID == student_id,
    )

# Get all fact user forms
def get_all_fact_user_forms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FactUserForm).offset(skip).limit(limit).all()

# Create a new fact user form
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
