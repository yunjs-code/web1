from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
import requests

router = APIRouter()

USER_REGISTER_URL = 'https://testapi.openbanking.or.kr/v2.0/user/register'

class User(BaseModel):
    user_name: str
    user_ci: str
    user_email: str

@router.post("/register")
def register(user_name: str = Form(...), user_ci: str = Form(...), user_email: str = Form(...), access_token: str = Form(...)):
    headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': f'Bearer {access_token}'
    }
    req_common = {
        'tran_dtime': '20210105101920',
        'req_client_name': user_name,
        'req_client_bank_code': '097',
        'req_client_account_num': '1234567890123456',
        'req_client_num': 'H123456789',
        'user_email': user_email,
        'user_ci': user_ci
    }

    response = requests.post(USER_REGISTER_URL, json=req_common, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="User registration failed")
    return response.json()
