import os

from beanie import Document, init_beanie
from typing import Sequence
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .models import MODELS

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "netlist_vis")


async def init_db(
    uri: str = MONGO_URI,
    db_name: str = MONGO_DB_NAME,
    models: Sequence[type[Document]] = MODELS,
) -> AsyncIOMotorDatabase:
    """Initialize the database

    Args:
        uri (str, optional): the mongo URI. Defaults to MONGO_URI.
        db_name (str, optional): the mongo collection. Defaults to
            MONGO_DB_NAME.
        models (Sequence[type[Document]], optional): the beanie documents to
            initialize. Defaults to MODELS.

    Returns:
        AsyncIOMotorDatabase: the async database
    """
    client = AsyncIOMotorClient(uri)  # type: ignore
    db = client[db_name]
    await init_beanie(db, document_models=models)
    return db
