from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import netlists, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Context manager used to await beanie initialization

    Args:
        app (FastAPI): the app
    """
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(netlists.router)
app.include_router(users.router)
