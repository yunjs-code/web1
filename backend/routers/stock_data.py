from fastapi import APIRouter, HTTPException
import requests
from bs4 import BeautifulSoup
import time

router = APIRouter()

# Token caching variables
access_token = None
token_expiry = 0

def get_access_token():
    global access_token, token_expiry
    current_time = time.time()
    if access_token and current_time < token_expiry:
        return access_token

    url = "https://openapi.koreainvestment.com:9443/oauth2/tokenP"
    headers = {
        "content-type": "application/json"
    }
    payload = {
        "grant_type": "client_credentials",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    response_data = response.json()
    if response.status_code == 200 and "access_token" in response_data:
        access_token = response_data["access_token"]
        token_expiry = current_time + response_data.get("expires_in", 3600) - 60
        return access_token
    else:
        raise HTTPException(status_code=500, detail=f"Failed to get access token: {response.text}")

def get_naver_index(index_type):
    url = f"https://finance.naver.com/sise/sise_index.nhn?code={index_type}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from Naver Finance: {response.status_code}")

    soup = BeautifulSoup(response.text, 'html.parser')

    index_value_element = soup.select_one('.num_quot .num')
    change_value_element = soup.select_one('.num_quot .num2')
    change_rate_element = soup.select_one('.num_quot .num3')

    if not index_value_element or not change_value_element or not change_rate_element:
        raise HTTPException(status_code=500, detail=f"Failed to parse data from Naver Finance: {index_type}")

    index_value = index_value_element.text.strip()
    change_value = change_value_element.text.strip()
    change_rate = change_rate_element.text.strip()

    return {
        "index": index_value,
        "change": change_value,
        "rate": change_rate
    }

@router.get("/kospi")
def read_kospi():
    return get_naver_index("KOSPI")

@router.get("/kosdaq")
def read_kosdaq():
    return get_naver_index("KOSDAQ")
