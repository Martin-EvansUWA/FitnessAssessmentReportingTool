from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from starlette.responses import FileResponse
import json

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

temp_admin = schemas.DimAdminCreate(
    email="temp@gmail.com",
    FirstName="Steve",
    LastName="Irwin",
    StaffID=0,
    password="password1234"
)

temp_user = schemas.DimUserCreate(
    email="temp_user@gmail.com",
    FirstName="Steve",
    LastName="Irwin",
    UserId=0,
    password="password1234"
)


def test_create_admin():
    db = SessionLocal()  # Correctly get a Session object
    try:
        created_admin = crud.create_admin(db, temp_admin)
        print(created_admin)
    finally:
        db.close()
        
def test_create_user():
    db = SessionLocal()
    try:
        created_user = crud.create_DimUser(db,temp_user)
        print(created_user)
    finally:
        db.close()


test_create_admin()
test_create_user()
