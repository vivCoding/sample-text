import os
from pymongo import MongoClient

class Config(object):
    SESSION_TYPE = 'mongodb'
    SESSION_MONGODB = MongoClient(os.getenv("ATLAS_URL"))
    SECRET_KEY = os.getenv("SECRET")
    SESSION_COOKIE_SECURE = os.getenv("dev", "prod") == "prod"
    SESSION_COOKIE_SAMESITE =  'None' if os.getenv("dev", "prod") == "prod" else 'Lax'