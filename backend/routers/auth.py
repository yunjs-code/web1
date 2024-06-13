import requests
from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str
    user_seq_no: str

NOTION_API_KEY = "secret_cZ69hazZ1gkcTX5X4c8h1jK5wi86rNmmWcidINtTlff"
DATABASE_ID = "b7a881e3ac8e4ed68738b29c8bb016f1"
NOTION_API_URL = "https://api.notion.com/v1/pages"

def save_to_notion(name, email, password, access_token, refresh_token, user_seq_no):
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    data = {
        "parent": {"database_id": DATABASE_ID},
        "properties": {
            "Name": {"title": [{"text": {"content": name}}]},
            "Email": {"email": email},
            "password": {"rich_text": [{"text": {"content": password}}]},
            "access_token": {"rich_text": [{"text": {"content": access_token}}]},
            "refresh_token": {"rich_text": [{"text": {"content": refresh_token}}]},
            "user_seq_no": {"rich_text": [{"text": {"content": user_seq_no}}]}
        }
    }

    response = requests.post(NOTION_API_URL, headers=headers, json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

@router.get("/callback")
def callback(code: str, state: str):
    client_id = '5a78ffbe-2e0a-466f-8305-f6cfaa603fb9'
    client_secret = 'ef83f907-c7ee-4fd3-8a05-3d1dc370b5a2'
    redirect_uri = 'http://localhost:8000/callback'
    
    token_url = "https://testapi.openbanking.or.kr/oauth/2.0/token"
    
    payload = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    response = requests.post(token_url, data=payload, headers=headers)
    response_data = response.json()
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response_data)
    
    access_token = response_data['access_token']
    refresh_token = response_data['refresh_token']
    user_seq_no = response_data['user_seq_no']
    
    return RedirectResponse(url=f"http://localhost:3000/login?token={access_token}&refresh_token={refresh_token}&user_seq_no={user_seq_no}")

@router.post("/submit")
async def submit_user_data(name: str = Form(...), email: str = Form(...), password: str = Form(...), token: str = Form(None), refresh_token: str = Form(None), user_seq_no: str = Form(None)):
    save_to_notion(name, email, password, token, refresh_token, user_seq_no)
    return {"message": "User data submitted successfully"}

@router.post("/refresh")
async def refresh_token(refresh_token: str = Form(...)):
    print(f"Received refresh token: {refresh_token}")  # 디버깅 메시지
    if refresh_token != "expected_refresh_token":  # 예시
        raise HTTPException(status_code=422, detail="Invalid refresh token")
    
    # 여기서 새로운 access_token을 생성합니다.
    return {"access_token": "new_access_token"}
