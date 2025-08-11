from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from .. import schema, database, models
from ..controllers import auth_controllers
from ..dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/dashboard")
def get_dashboard(current_user: models.User = Depends(get_current_user)):
    return {"message": f"Welcome {current_user.name}!"}

@router.post("/signup", response_model=schema.UserResponse)
def signup(user: schema.UserCreate, db: Session = Depends(database.get_db)):
    return auth_controllers.signup(user, db)

@router.post("/login")
def login(user: schema.UserLogin, db: Session = Depends(database.get_db)):
    return auth_controllers.login(user, db)

@router.post("/logout")
def logout(request: Request):
    return auth_controllers.logout(request)