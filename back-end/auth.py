
from crud import get_DimUser


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
def decode_token(token):
    # get current user from db based off token
    # Must decrypt token into studentID
    return True

def encode_password(password: str):
    # Hash Password function, used in order to check user
    return "encoded"

# Get current user

