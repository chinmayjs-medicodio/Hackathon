"""
Database connection and configuration using Motor (async MongoDB driver)
"""
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection string
MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'campaignforge')

# Global database connection
client = None
database = None

async def connect_to_mongo():
    """Connect to MongoDB"""
    global client, database
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        database = client[DATABASE_NAME]
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
        return database
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {str(e)}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client is not None:
        client.close()
        print("MongoDB connection closed")

def get_database():
    """Get database instance"""
    return database

def get_clients_collection():
    """Get clients collection"""
    db = get_database()
    return db.clients if db is not None else None

def get_content_collection():
    """Get content collection"""
    db = get_database()
    return db.content if db is not None else None

def get_campaigns_collection():
    """Get campaigns collection"""
    db = get_database()
    return db.campaigns if db is not None else None
