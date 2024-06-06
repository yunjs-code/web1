from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Finance Assistant API"}

@app.post("/users")
def create_user(user: User):
    # 사용자 등록 로직
    return {"message": "User created", "user": user}

@app.post("/users/info")
def get_user_info():
    # 사용자 정보 조회 로직
    return {"message": "User info"}

# 기타 API 엔드포인트 구현

class User(BaseModel):
    name: str
    email: str
