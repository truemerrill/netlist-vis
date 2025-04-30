from fastapi import APIRouter, HTTPException
from pydantic import EmailStr

from ..database import db
from ..models import PyObjectId, User

router = APIRouter()


@router.post("/users/", response_model=User)
async def create_user(email: EmailStr) -> User:
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")

    user = User(email=email, active=True)
    result = await db.users.insert_one(user.model_dump(by_alias=True))

    # Insert the id from mongo
    user.id = str(result.inserted_id)
    return user
