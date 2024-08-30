from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from datetime import datetime, date
import models
from schemas import DimAdminCreate, DimUserCreate, DimFormTemplateCreate
from crud import create_admin, get_admin, get_DimUser, create_DimUser, delete_DimUser, delete_admin

from crud import create_dim_form_template

SQLALCHEMY_DATABASE_URL = "sqlite:///./back-end/sql_app/test.db"

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
        StudentID=23621647
    )

    temp_user2 = DimUserCreate(
        email="roberthorry1234@gmail.com",
        FirstName="Robert",
        LastName="Horry",
        password="mypassword",
        StudentID=17651211
    )

    create_DimUser(db,temp_user)

    create_DimUser(db,temp_user2)


    queried_user = get_DimUser(db, 23621647)

    assert queried_user.FirstName == "John"
    assert queried_user.LastName == "Smith"

    queried_user = get_DimUser(db, 17651211)

    assert queried_user.FirstName == "Robert"
    assert queried_user.LastName == "Horry"



# Create Admin Creation

def test_admin_creation():
    temp_admin = DimAdminCreate(
        email="admin1234@outlook.com",
        FirstName="Nat",
        LastName="Reginald",
        StaffID=77771111,
        password="adminpassword"
    )

    create_admin(db, temp_admin)

    q_admin = get_admin(db, 77771111)

    assert q_admin.FirstName == "Nat"
    assert q_admin.LastName == "Reginald"


# Test Form Creation
def test_create_form():
    temp_layout = {
        "bench" : ""
    }

    temp_test = DimFormTemplateCreate(
        Title="My Newest Form",
        Description="A form to determine the best bench press in the class",
        AdminID=77771111,
        CreatedAt= date.today().strftime("%d/%m/%Y") + datetime.now().strftime("%H:%M:%S"),
        FormTemplate=temp_layout
    )


    temp_test2 = DimFormTemplateCreate(
        Title="My Newest Form",
        Description="A form to determine the best bench press in the class",
        AdminID=77771111,
        CreatedAt= date.today().strftime("%d/%m/%Y") + datetime.now().strftime("%H:%M:%S"),
        FormTemplate=temp_layout
    )
    create_dim_form_template(db, temp_test)
    create_dim_form_template(db, temp_test2)


    


# Test User Deletion
def test_user_deletion():
    response = delete_DimUser(db, 23621647)
    assert response['msg'] == "Student deleted successfully"

    response_2 = delete_DimUser(db, 17651211)
    assert response_2['msg'] == "Student deleted successfully"

# Test Admin Deletion
def test_admin_deletion():
    response = delete_admin(db, 77771111)
    assert response['msg'] == "Admin deleted successfully"

db.close()