from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Request
from .. import schema, models
from ..utils.hashing import hash_password, verify_password
import uuid
from fastapi.responses import JSONResponse
from ..database import redis_client

def signup(request: schema.UserCreate, db: Session):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    new_user = models.User(name=request.name, email=request.email, password=hash_password(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login(request: schema.UserLogin, db: Session):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    session_id = str(uuid.uuid4())
    redis_client.setex(f"session:{session_id}", 86400, user.id)

    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax")
    return response

def logout(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id:
        redis_client.delete(f"session: {session_id}")

    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie("session_id")
    return response