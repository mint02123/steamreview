"""Pydantic schemas for Patch Lens API."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    nickname: str = Field(min_length=1, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    nickname: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class SavedReviewCreate(BaseModel):
    review_id: str
    txt_file_name: str | None = None

    reviewer: str | None = None
    category: str | None = None

    text: str | None = None
    summary: str | None = None
    developer_value: str | None = None
    action_hint: str | None = None

    status: str = "미검토"
    memo: str = ""


class SavedReviewUpdate(BaseModel):
    status: str | None = None
    memo: str | None = None
    category: str | None = None
    summary: str | None = None
    developer_value: str | None = None
    action_hint: str | None = None


class SavedReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int

    review_id: str
    txt_file_name: str | None

    reviewer: str | None
    category: str | None

    text: str | None
    summary: str | None
    developer_value: str | None
    action_hint: str | None

    status: str
    memo: str

    saved_at: datetime
    updated_at: datetime