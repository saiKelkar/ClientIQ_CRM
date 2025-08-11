from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database
from ..controllers import project_controllers

router = APIRouter(prefix="/projects", tags=["Projects"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.ProjectResponse])
def getProjects(db: Session = Depends(get_db)):
    return project_controllers.get_all_projects(db)

@router.get("/{id}", response_model=schemas.ProjectResponse)
def getProjectById(id: int, db: Session = Depends(get_db)):
    return project_controllers.get_project_by_id(id, db)

@router.post("/", response_model=schemas.ProjectResponse)
def createProject(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return project_controllers.create_project(project, db)

@router.put("/{id}", response_model=schemas.ProjectResponse)
def updateProject(id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return project_controllers.update_project(id, project, db)

@router.delete("/{id}")
def deleteProject(id: int, db: Session = Depends(get_db)):
    return project_controllers.delete_project(id, db)