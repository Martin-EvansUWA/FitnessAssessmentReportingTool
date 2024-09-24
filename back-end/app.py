import json
from http.client import HTTPException


# Website Imports
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Login and Encryption Imports
import jwt
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing_extensions import Annotated
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel

# Auth Imports
from auth import decode_token, hash_password


# Database Imports  ``
import crud
import models
from database import SessionLocal, engine
from process import createFactUserFormSchema, createFormTemplateSchema
from schemas import (
    DataEntryPageSubmissionData,
    DimFormTemplateCreate,
    DimUserFormResponseCreate,
    DimUser,
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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    # Decode token, and get the user from the token
    user = decode_token(token)

    # create model to provide data integrity
    print(f"Token: {token}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    print(f"{form_data.username}")
    user = crud.get_DimUser(get_db(),form_data.username)
    if not user:
        raise HTTPException(status_code=400, detail="No such user...")
    hashed_password = hash_password(form_data.password)
    print(f"Hashed {hash_password}, user {user.hashed_password}")
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.FirstName, "token_type": "bearer"}

@app.get("/current_user")
async def current_user(
    current_user: Annotated[DimUser, Depends(get_current_user)],
):
    return current_user.FirstName


@app.get("/")
def index():
    return "temp"


@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}


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
    forms = {}

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
