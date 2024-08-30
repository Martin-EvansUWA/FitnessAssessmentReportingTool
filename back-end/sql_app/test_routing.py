
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_landing():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == 'temp'


def test_student():
    response = client.get("/student")
    assert response.status_code == 200
    assert response.json() == 'student'




