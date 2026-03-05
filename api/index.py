from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Clara AI API running"}

@app.get("/api")
def api():
    return {"message": "Clara AI endpoint working"}
