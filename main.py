from fastapi import FastAPI
from routes import auth_routes, customer_routes, project_routes, deal_routes, invoice_routes, ticket_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return { "message": "API running" }

app.include_router(auth_routes.router)
app.include_router(customer_routes.router)
app.include_router(project_routes.router)
app.include_router(deal_routes.router)
app.include_router(ticket_routes.router)
app.include_router(invoice_routes.router)