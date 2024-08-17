from fastapi import FastAPI
from starlette.responses import FileResponse
import json

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
