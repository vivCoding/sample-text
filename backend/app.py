from dotenv import load_dotenv
from database.connect import Connection

load_dotenv()
Connection.init()