from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Clara AI backend is fully operational."}
