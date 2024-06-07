import requests
from fastapi import APIRouter, HTTPException
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
    return RedirectResponse(url=f"http://localhost:3000/login?token={access_token}")
