from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ContactBase(BaseModel):
    name: str = Field(..., example="Ana López")
    email: EmailStr = Field(..., example="ana@email.com")
    phone: Optional[str] = Field(None, example="+52 55 1234 5678")

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class ContactOut(ContactBase):
    id: int
    created_at: str

    class Config:
        orm_mode = True
