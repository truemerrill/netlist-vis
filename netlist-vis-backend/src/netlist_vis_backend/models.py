from typing import Annotated, Optional

from pydantic import BaseModel, BeforeValidator, EmailStr, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    active: bool = True


class Component(BaseModel):
    name: str
    left_pins: tuple[str, ...] = Field(default_factory=tuple)
    right_pins: tuple[str, ...] = Field(default_factory=tuple)


class PinReference(BaseModel):
    component_name: str
    pin_name: str
