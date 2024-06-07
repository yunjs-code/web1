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

NOTION_API_KEY = "secret_wDzQrOMuVR9WiI603zYXAqsKh55DexmYYvbeG9dQ1wF"
DATABASE_ID = "85d0173f9b194552a59ceb544fb268db"
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
    client_secret = 'ef83f907-c7ee-4fd3-8a05-3d1dc370b5a2'  # 클라이언트 시크릿을 여기에 입력하세요
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
    
    # 이메일, 이름, 패스워드 등은 프론트엔드에서 받아서 전달해야 함
    # 예시: http://localhost:3000/login?token={access_token}&refresh_token={refresh_token}&user_seq_no={user_seq_no}
    return RedirectResponse(url=f"http://localhost:3000/login?token={access_token}&refresh_token={refresh_token}&user_seq_no={user_seq_no}")

@router.post("/submit")
async def submit_user_data(name: str = Form(...), email: str = Form(...), password: str = Form(...), token: str = Form(None), refresh_token: str = Form(None), user_seq_no: str = Form(None)):
    save_to_notion(name, email, password, token, refresh_token, user_seq_no)
    return {"message": "User data submitted successfully"}
