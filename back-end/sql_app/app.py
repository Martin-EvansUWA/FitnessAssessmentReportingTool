from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from starlette.responses import FileResponse
import json

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

temp_admin = schemas.DimAdminCreate(
    email="temp@gmail.com",
    FirstName="Nat",
    LastName="Benjan",
    StaffID=0,
    password="password1234"
)

print(crud.create_admin(get_db,temp_admin ))

#app implementation
app = FastAPI()

@app.get("/")
def index():
    return "temp"

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
    forms = get_forms(admin_id)

    sidebar_info = {}
    for form in forms:
        sidebar_info.update({form.id:form.title})

    return sidebar_info

# Create new form
@app.post("/create_form")
def add_form(form_info):
    # form info contains adminID, formtemplate, title, description, created at
    create_form(form)
    return 200

# view requested form, with everything except adminID
@app.get("/retrieve_form/{form_id}")
def retrieve_form(form_id: int):
    form = get_form(form_id)
    return jsonable_encoder(form)

# Save student form data
@app.post("/save_form_entry")
def save_form_entry(form):
    save_form(form)
    return 200






