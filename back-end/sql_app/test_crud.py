from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import pytest
import models
import schemas
import crud

SQLALCHEMY_DATABASE_URL = "sqlite:///./back-end/sql_app/test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=engine)


db = SessionTest()
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def test_user_creation():
    temp_user = schemas.DimUserCreate(
        email="johnsmith1234@gmail.com",
        FirstName="John",
        LastName="Smith",
        password="password1234",
        StudentID=23621647
    )

    temp_user2 = schemas.DimUserCreate(
        email="roberthorry1234@gmail.com",
        FirstName="Robert",
        LastName="Horry",
        password="mypassword",
        StudentID=17651211
    )

    crud.create_DimUser(db,temp_user)

    crud.create_DimUser(db,temp_user2)


    queried_user = crud.get_DimUser(db, 23621647)

    assert queried_user.FirstName == "John"
    assert queried_user.LastName == "Smith"

    queried_user = crud.get_DimUser(db, 17651211)

    assert queried_user.FirstName == "Robert"
    assert queried_user.LastName == "Horry"

def test_user_deletion():
    response = crud.delete_DimUser(db, 23621647)
    assert response['msg'] == "Item deleted successfully"
    


db.close()