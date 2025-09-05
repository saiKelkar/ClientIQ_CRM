from fastapi import FastAPI, WebSocket
from routes import auth_routes, customer_routes, contact_routes, lead_routes, transaction_routes
from fastapi.middleware.cors import CORSMiddleware
from controllers.websocket_manager import manager

from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return { "message": "API running" }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)

app.include_router(auth_routes.router)
app.include_router(customer_routes.router)
app.include_router(contact_routes.router)
app.include_router(lead_routes.router)
app.include_router(transaction_routes.router)