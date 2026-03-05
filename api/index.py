from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "..", "public")

@app.get("/")
def home():
    file_path = os.path.join(PUBLIC_DIR, "index.html")
    return FileResponse(file_path)
