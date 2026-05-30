"""SQLAlchemy models for Patch Lens."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    """User account table."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    nickname: Mapped[str] = mapped_column(String(100), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    saved_reviews: Mapped[list["SavedReview"]] = relationship(
        "SavedReview",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class SavedReview(Base):
    """Saved review table for user-specific review management."""

    __tablename__ = "saved_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    review_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    txt_file_name: Mapped[str | None] = mapped_column(String(500), nullable=True)

    reviewer: Mapped[str | None] = mapped_column(String(255), nullable=True)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)

    text: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    developer_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_hint: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(String(30), default="미검토", nullable=False)
    memo: Mapped[str] = mapped_column(Text, default="", nullable=False)

    saved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user: Mapped[User] = relationship("User", back_populates="saved_reviews")

    __table_args__ = (
        UniqueConstraint("user_id", "review_id", name="uq_user_saved_review"),
    )