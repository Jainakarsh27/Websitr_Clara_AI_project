from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.get("/")
def homepage():
    return FileResponse("public/index.html")

@app.get("/api")
def api():
    return {"message": "Clara AI API running"}
