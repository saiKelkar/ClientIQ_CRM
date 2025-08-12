from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from websocket_manager import manager
from models import Project
import schemas

def get_all_projects(db: Session):
    return db.query(Project).all()

def get_project_by_id(id: int, db: Session):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project with ID {id} not found")
    return project

async def create_project(project_data: schemas.ProjectCreate, db: Session):
    new_project = Project(**project_data.model_dump())  # .dict() if Pydantic v1
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # Broadcast to all connected clients
    await manager.broadcast({
        "type": "new_project",
        "data": {
            "id": new_project.id,
            "name": new_project.name,
            "description": new_project.description
        }
    })
    return new_project

def update_project(id: int, project_data: schemas.ProjectCreate, db: Session):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project with ID {id} not found")
    project.customer_id = project_data.customer_id
    project.name = project_data.name
    project.status = project_data.status
    project.budget = project_data.budget

    db.commit()
    db.refresh(project)
    return project

def delete_project(id: int, db: Session):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project with ID {id} not found")
    db.delete(project)
    db.commit()
    return { "message": f"Project with ID {id} deleted successfully" }