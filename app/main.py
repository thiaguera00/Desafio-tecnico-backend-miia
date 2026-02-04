from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.submissions import router as submissions_router

app = FastAPI(title="Technical Challenge - Submissions API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(submissions_router)

@app.get("/health")
def health():
    return {"status": "ok"}
