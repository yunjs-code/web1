from fastapi import APIRouter, HTTPException, Request
import requests
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

CLIENT_ID = '5a78ffbe-2e0a-466f-8305-f6cfaa603fb9'
CLIENT_SECRET = 'ef83f907-c7ee-4fd3-8a05-3d1dc370b5a2'
TOKEN_URL = 'https://testapi.openbanking.or.kr/oauth/2.0/token'
REDIRECT_URI = 'http://localhost:8000/callback'
templates = Jinja2Templates(directory="templates")

@router.get("/callback", response_class=HTMLResponse)
def get_access_token(request: Request):
    code = request.query_params.get('code')
    if not code:
        raise HTTPException(status_code=400, detail="Missing code parameter")

    payload = {
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(TOKEN_URL, data=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=f"Token request failed: {response.text}")

    token_data = response.json()
    return templates.TemplateResponse("resultChild.html", {"request": request, "data": token_data})