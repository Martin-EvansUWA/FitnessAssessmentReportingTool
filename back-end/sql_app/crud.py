from sqlalchemy.orm import Session
from . import models, schemas

# Student CRUD operations
def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.StudentId == student_id).first()

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    fake_hashed_password = student.password + "notreallyhashed"  # Replace with actual hashing
    db_student = models.Student(
        email=student.email,
        hashed_password=fake_hashed_password,
        FirstName="",  # Default or handle according to your logic
        LastName="",   # Default or handle according to your logic
        StudentId=0    # Default or derive from logic
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def create_student_item(db: Session, item: schemas.ItemCreate, student_id: int):
    db_item = models.Item(**item.dict(), owner_id=student_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Admin CRUD operations
def get_admin(db: Session, admin_id: int):
    return db.query(models.Admin).filter(models.Admin.AdminId == admin_id).first()

def get_admin_by_email(db: Session, email: str):
    return db.query(models.Admin).filter(models.Admin.email == email).first()

def get_admins(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Admin).offset(skip).limit(limit).all()

def create_admin(db: Session, admin: schemas.AdminCreate):
    fake_hashed_password = admin.password + "notreallyhashed"  # Replace with actual hashing
    db_admin = models.Admin(
        email=admin.email,
        hashed_password=fake_hashed_password,
        FirstName="",  # Default or handle according to your logic
        LastName="",   # Default or handle according to your logic
        StaffId=0      # Default or derive from logic
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# DimFormTemplate CRUD operations
def get_dim_form_template(db: Session, form_template_id: int):
    return db.query(models.DimFormTemplate).filter(models.DimFormTemplate.FormTemplateId == form_template_id).first()

def get_dim_form_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimFormTemplate).offset(skip).limit(limit).all()

def create_dim_form_template(db: Session, dim_form_template: schemas.DimFormTemplateCreate):
    db_dim_form_template = models.DimFormTemplate(
        FormTemplateId=0,  # Default or derive from logic
        AdminId=0,         # Set AdminId appropriately
        FormTemplate=dim_form_template.FormTemplate,
        Title=dim_form_template.Title,
        Description=dim_form_template.Description,
    )
    db.add(db_dim_form_template)
    db.commit()
    db.refresh(db_dim_form_template)
    return db_dim_form_template

# DimUserFormResponse CRUD operations
def get_dim_user_form_response(db: Session, response_id: int):
    return db.query(models.DimUserFormResponse).filter(models.DimUserFormResponse.UserFormResponseId == response_id).first()

def get_dim_user_form_responses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DimUserFormResponse).offset(skip).limit(limit).all()

def create_dim_user_form_response(db: Session, dim_user_form_response: schemas.DimUserFormResponseCreate):
    db_dim_user_form_response = models.DimUserFormResponse(
        UserFormResponseId=0,  # Default or derive from logic
        UserFormResponse=dim_user_form_response.UserFormResponse,
    )
    db.add(db_dim_user_form_response)
    db.commit()
    db.refresh(db_dim_user_form_response)
    return db_dim_user_form_response

# FactUserForm CRUD operations
def get_fact_user_form(db: Session, user_form_response_id: int, form_template_id: int, user_id: int, subject_user_id: int):
    return db.query(models.FactUserForm).filter(
        models.FactUserForm.UserFormResponseId == user_form_response_id,
        models.FactUserForm.FormTemplateId == form_template_id,
        models.FactUserForm.UserId == user_id,
        models.FactUserForm.SubjectUserId == subject_user_id
    ).first()

def get_fact_user_forms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FactUserForm).offset(skip).limit(limit).all()

def create_fact_user_form(db: Session, fact_user_form: schemas.FactUserFormCreate):
    db_fact_user_form = models.FactUserForm(
        UserFormResponseId=fact_user_form.UserFormResponseId,
        FormTemplateId=fact_user_form.FormTemplateId,
        UserId=fact_user_form.UserId,
        SubjectUserId=fact_user_form.SubjectUserId,
        IsComplete=fact_user_form.IsComplete,
        CreatetAt=fact_user_form.CreatetAt,
        CompleteAt=fact_user_form.CompleteAt,
    )
    db.add(db_fact_user_form)
    db.commit()
    db.refresh(db_fact_user_form)
    return db_fact_user_form
