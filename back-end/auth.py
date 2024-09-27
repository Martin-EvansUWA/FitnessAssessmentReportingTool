from datetime import datetime, timedelta, timezone
from crud import get_DimUser
from pydantic import BaseModel
from fastapi import HTTPException, status


import crud
import jwt

from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

CREDENTIALS_EXCEPTION = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

# fake secret key, needs to become env variable
SECRET_KEY = "590236d89b9f9bedc2fb29ff95618ed31493080406d59ce5cded7dd210e3b88e"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: int | None = None

def authenticate_user(db, user_id: int, password: str):
    user = crud.get_DimUser(db, user_id)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

"""
 Return a hashed password
"""
def hash_password(password: str):
    return password

def get_user(db, student_id: str):
    user = get_DimUser(db,student_id)
    if user == None:
        return None
    return user

"""
 Returns user based off given token
"""



                            
