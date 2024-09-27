from datetime import date, datetime

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import models
from crud import (
    create_dim_form_template,
    create_DimUser,
    create_fact_user_form,
    create_dim_user_form_response,
    delete_DimUser,
    get_admin,
    get_all_fact_user_forms,
    get_DimUser,
    get_fact_user_form,
    get_dim_user_form_response,
    get_all_fact_user_forms,
)
from schemas import (
    DimFormTemplateCreate,
    DimUserCreate,
    DimUserFormResponseCreate,
    FactUserFormCreate,
)

SQLALCHEMY_DATABASE_URL = "sqlite:///./back-end/test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=engine)


db = SessionTest()
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)


# Test User Deletion
def test_user_creation():
    temp_user = DimUserCreate(
        email="johnsmith1234@gmail.com",
        FirstName="John",
        LastName="Smith",
        password="password1234",
        UserID=23621647,
        isAdmin=True
    )

    temp_user2 = DimUserCreate(
        email="roberthorry1234@gmail.com",
        FirstName="Robert",
        LastName="Horry",
        password="mypassword",
        UserID=17651211,
        isAdmin=False
    )

    create_DimUser(db, temp_user)

    create_DimUser(db, temp_user2)

    queried_user = get_DimUser(db, 23621647)

    assert queried_user.FirstName == "John"
    assert queried_user.LastName == "Smith"

    queried_user = get_DimUser(db, 17651211)

    assert queried_user.FirstName == "Robert"
    assert queried_user.LastName == "Horry"


# Test Form Creation
def test_create_form():
    temp_layout = {"bench": ""}

    temp_test = DimFormTemplateCreate(
        Title="My Newest Form",
        Description="A form to determine the best bench press in the class",
        UserID=77771111,
        CreatedAt=date.today().strftime("%d/%m/%Y"),
        FormTemplate=temp_layout,
    )

    create_dim_form_template(db, temp_test)

# Test User Form Data Creation
def test_create_fact_user_form():
    test_input = DimUserFormResponseCreate(UserFormResponse={"bench": 130})

    ret = create_dim_user_form_response(db, test_input)

    test_fact_form = FactUserFormCreate(
        UserID=23621647,
        FormTemplateID=1,
        SubjectUserID=17651211,
        CreatedAt=date.today().strftime("%d/%m/%Y"),
        CompleteAt="",
        IsComplete=False,
        UserFormResponseID=ret.UserFormResponseID,
    )

    create_fact_user_form(db, test_fact_form)

    q_fact_form = get_fact_user_form(db, 23621647, 17651211)
    q_user_response = get_dim_user_form_response(db, ret.UserFormResponseID)

    assert q_fact_form.UserID == 23621647
    assert type(q_user_response.UserFormResponse) == dict


# Test get all fact user forms


def test_get_all_forms():
    all_forms = get_all_fact_user_forms(db, 0, 100)
    for form in all_forms:
        assert form.UserID != None


#


# Test User Deletion
def test_user_deletion():
    response = delete_DimUser(db, 23621647)
    assert response["msg"] == "Student deleted successfully"

    response_2 = delete_DimUser(db, 17651211)
    assert response_2["msg"] == "Student deleted successfully"

db.close()
