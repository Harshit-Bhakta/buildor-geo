from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.submit_code import submit_code

app = FastAPI()

# CORS (important)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running 🚀"}


# 🔵 SUBMIT (final evaluation)
@app.post("/submit")
def submit(data: dict):
    return submit_code(
        task_id=data["task_id"],
        code=data["code"],
        hint_mode=False
    )


# 🟡 ANALYZE (run + hint)
@app.post("/analyze")
def analyze(data: dict):
    return submit_code(
        task_id=data["task_id"],
        code=data["code"],
        hint_level=data.get("hint_level", 1),
        hint_mode=True
    )