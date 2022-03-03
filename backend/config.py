import os
from pymongo import MongoClient

class Config(object):
    SESSION_TYPE = 'mongodb'
    SESSION_MONGODB = MongoClient(os.getenv("ATLAS_URL"))
    SECRET_KEY = os.getenv("SECRET")
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'