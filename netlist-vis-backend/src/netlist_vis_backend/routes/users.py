from fastapi import APIRouter, HTTPException, status
from pydantic import EmailStr
from pymongo.errors import DuplicateKeyError
from ..models import User

router = APIRouter()


# Note: See https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/

@router.post(
    "/users/",
    response_description="Add a new user",
    response_model=User,
    status_code=status.HTTP_201_CREATED
)
async def create_user(email: EmailStr) -> User:
    user = User(email=email)
    try:
        await user.insert()
        return user
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists."
        )


@router.get(
    "/users/{email}",
    response_description="Get a user by email",
    response_model=User,
)
async def get_user(email: EmailStr) -> User:
    user = await User.find_one(User.email == email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return user
