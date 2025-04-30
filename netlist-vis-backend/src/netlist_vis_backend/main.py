from contextlib import asynccontextmanager
from fastapi import FastAPI
from .database import init_db
from .routes import users

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Context manager used to await beanie initialization

    Args:
        app (FastAPI): the app
    """
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(users.router)
