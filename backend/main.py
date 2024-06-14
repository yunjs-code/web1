from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, user, notion, profit, fluctuation, volume, stock_data, news_crawler, exchange_rate  # 추가된 부분

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(notion.router)
app.include_router(profit.router)
app.include_router(fluctuation.router)
app.include_router(volume.router)
app.include_router(stock_data.router)
app.include_router(news_crawler.router)
app.include_router(exchange_rate.router)  # 추가된 부분

# FastAPI 애플리케이션을 실행합니다.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
