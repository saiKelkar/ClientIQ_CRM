from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

import database, models
import schemas
from controllers import auth_controllers
from dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/dashboard")
def get_dashboard(current_user: models.User = Depends(get_current_user)):
    return {"message": f"Welcome {current_user.name}!"}

@router.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    return auth_controllers.signup(user, db)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    return auth_controllers.login(user, db)

@router.post("/logout")
def logout(request: Request):
    return auth_controllers.logout(request)