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
        StudentId=23621647
    )
    crud.create_DimUser(db,temp_user)
    queried = crud.get_DimUser(db,23621647)

    assert queried.FirstName == "John"
    assert queried.LastName=="Smith"