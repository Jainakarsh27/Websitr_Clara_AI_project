from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.get("/")
def home():
    index_path = os.path.join(BASE_DIR, "public", "index.html")
    return FileResponse(index_path)

@app.get("/api")
def api():
    return {"message": "Clara AI API running"}
