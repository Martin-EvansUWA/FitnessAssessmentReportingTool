from app import oauth2_scheme
from typing import Annotated
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from schemas import DimUser
from crud import get_DimUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

"""
 Return a hashed password
"""
def hash_password(password: str):
    return password + "hash1234"

def get_user(db, student_id: str):
    user = get_DimUser(db,student_id)
    if user == None:
        return None
    return user

"""
 Returns user based off given token
"""
def decode_token(token):
    # get current user from db based off token
    return 0

def encode_password(password: str):
    # Hash Password function, used in order to check user
    return "encoded"

# Get current user
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# Get current active user. 
async def get_current_active_user(
    current_user: Annotated[DimUser, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
