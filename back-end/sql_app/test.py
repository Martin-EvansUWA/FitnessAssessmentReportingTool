from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from starlette.responses import FileResponse
import json

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

'''temp_admin = schemas.DimAdminCreate(
    email="temp1@gmail.com",
    FirstName="Barry",
    LastName="Gold",
    StaffID=1,
    password="password12345"
)'''

temp_user = schemas.DimUserCreate(
    email="temp_user1@gmail.com",
    FirstName="Steve",
    LastName="Barnes",
    password="password1234",
    StudentId=2
)
temp_user2 = schemas.DimUserCreate(
    email="temp_user2@gmail.com",
    FirstName="James",
    LastName="Barnes",
    password="password1234",
    StudentId=1
)


'''def test_create_admin():
    db = SessionLocal()  # Correctly get a Session object
    try:
        created_admin = crud.create_admin(db, temp_admin)
        print(created_admin)
    finally:
        db.close()'''
        
def test_create_user():
    db = SessionLocal()
    try:
        created_user1 = crud.create_DimUser(db,temp_user)
        created_user2 = crud.create_DimUser(db,temp_user2)
        print(created_user1)
        print(created_user2)
    finally:
        db.close()
        
        
def test_get_user():
    db = SessionLocal()
    try: 
        get_user = crud.get_DimUser(db,1)
        print(get_user)
    finally:
        db.close()
        


#test_create_admin()
test_create_user()
#test_get_user()

