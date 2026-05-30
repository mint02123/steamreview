"""Saved review routes for Patch Lens."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import SavedReview, User
from app.schemas import SavedReviewCreate, SavedReviewResponse, SavedReviewUpdate


router = APIRouter(prefix="/api/saved-reviews", tags=["saved-reviews"])


@router.get("", response_model=list[SavedReviewResponse])
def list_saved_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List saved reviews for the current user."""
    return (
        db.query(SavedReview)
        .filter(SavedReview.user_id == current_user.id)
        .order_by(SavedReview.saved_at.desc())
        .all()
    )


@router.post("", response_model=SavedReviewResponse)
def create_saved_review(
    payload: SavedReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save a review for the current user."""
    existing = (
        db.query(SavedReview)
        .filter(
            SavedReview.user_id == current_user.id,
            SavedReview.review_id == payload.review_id,
        )
        .first()
    )

    if existing:
        return existing

    saved_review = SavedReview(
        user_id=current_user.id,
        review_id=payload.review_id,
        txt_file_name=payload.txt_file_name,
        reviewer=payload.reviewer,
        category=payload.category,
        text=payload.text,
        summary=payload.summary,
        developer_value=payload.developer_value,
        action_hint=payload.action_hint,
        status=payload.status,
        memo=payload.memo,
    )

    db.add(saved_review)
    db.commit()
    db.refresh(saved_review)

    return saved_review


@router.patch("/{saved_id}", response_model=SavedReviewResponse)
def update_saved_review(
    saved_id: int,
    payload: SavedReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update status, memo, or insight fields of a saved review."""
    saved_review = (
        db.query(SavedReview)
        .filter(
            SavedReview.id == saved_id,
            SavedReview.user_id == current_user.id,
        )
        .first()
    )

    if saved_review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="저장된 리뷰를 찾을 수 없습니다.",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(saved_review, key, value)

    db.commit()
    db.refresh(saved_review)

    return saved_review


@router.delete("/{saved_id}")
def delete_saved_review(
    saved_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a saved review."""
    saved_review = (
        db.query(SavedReview)
        .filter(
            SavedReview.id == saved_id,
            SavedReview.user_id == current_user.id,
        )
        .first()
    )

    if saved_review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="저장된 리뷰를 찾을 수 없습니다.",
        )

    db.delete(saved_review)
    db.commit()

    return {"message": "삭제되었습니다."}