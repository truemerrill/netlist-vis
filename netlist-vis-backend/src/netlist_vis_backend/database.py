import os
from functools import lru_cache

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

# Load .env file
load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "netlist_vis")


# Lazy-initialized shared client
@lru_cache()
def get_client() -> AsyncIOMotorClient:
    return AsyncIOMotorClient(MONGO_URI)


def get_db() -> AsyncIOMotorDatabase:
    return get_client()[MONGO_DB_NAME]


db = get_db()
