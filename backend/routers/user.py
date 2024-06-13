from fastapi import APIRouter, HTTPException, Form
import requests

router = APIRouter()

USER_INFO_URL = 'https://testapi.openbanking.or.kr/v2.0/user/me'
ACCOUNT_INFO_URL = 'https://testapi.openbanking.or.kr/v2.0/account/list'

@router.get("/user-info")
async def get_user_info(access_token: str, user_seq_no: str):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'user_seq_no': user_seq_no
    }

    print(f"Fetching user info with headers: {headers}, params: {params}")  # 디버깅 메시지

    response = requests.get(USER_INFO_URL, headers=headers, params=params)
    print(f"Response status code: {response.status_code}, response body: {response.text}")  # 디버깅 메시지

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    return response.json()

@router.get("/account-info")
async def get_account_info(access_token: str, user_seq_no: str):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'user_seq_no': user_seq_no,
        'include_cancel_yn': 'N',
        'sort_order': 'D'
    }

    print(f"Fetching account info with headers: {headers}, params: {params}")  # 디버깅 메시지

    response = requests.get(ACCOUNT_INFO_URL, headers=headers, params=params)
    print(f"Response status code: {response.status_code}, response body: {response.text}")  # 디버깅 메시지

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    return response.json()
