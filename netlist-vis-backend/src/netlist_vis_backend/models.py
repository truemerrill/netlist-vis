from typing import Annotated
from beanie import Document, Indexed
from pydantic import EmailStr


class User(Document):
    """User model

    Attributes:
        email (EmailStr): the user email
    """
    email: Annotated[EmailStr, Indexed(unique=True)]


# Models ----------------------------------------------------------------------
#
# Note: Add Beanie models here so they can be initialized later by 
#   `.database.init_db()`.
# 

MODELS = [User]
