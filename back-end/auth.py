import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel

import crud
from crud import get_DimUser

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

# Read the .env file and load your secret key
# Steps to follow:
# 1. Create a .env file in the current directory
# 2. Add the following line to the .env file
#       SECRET_KEY = "your_secret"
#           - "your_secret" is the secret key that you want to use
# 3. Save the file
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password, salt=SECRET_KEY)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: int


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


def get_user(db, user_id: str):
    user = get_DimUser(db, user_id)
    if user == None:
        return None
    return user


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


def update_user_password(db, user_id: str, new_password: str):
    user = get_DimUser(db, user_id)
    if user == None:
        return None
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return user

class PasswordResetRequest(BaseModel):
    student_id: int  
    new_password: str