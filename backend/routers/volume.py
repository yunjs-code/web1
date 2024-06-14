from fastapi import APIRouter, HTTPException
import requests
import json
import time

router = APIRouter()

APP_KEY = 'PSgpJgGFjxMJwy4T9pSl7EAknSFYq3gCYNUF'
APP_SECRET = 'AuhozI7auOaa2slt0o3PkTJenly96jNnasBMTurmXuea75z0nOa7UgwcAzbYDpB9W7vTeHOqYl4Z7mpSMLSeJPOtXYCVVZdcW1U9diueAlNepH7KhcFuRXKvUEeiDkhNda9w+rVjZ44u0RPA1j18ebToZOspmhowmHSzuF5mYRqMjiAkIRI='

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

def get_volume_ranking(access_token):
    url = "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/volume-rank"
    headers = {
        "content-type": "application/json; charset=utf-8",
        "authorization": f"Bearer {access_token}",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET,
        "tr_id": "FHPST01710000"
    }
    params = {
        "FID_COND_MRKT_DIV_CODE": "J",
        "FID_COND_SCR_DIV_CODE": "20171",
        "FID_INPUT_ISCD": "0000",
        "FID_DIV_CLS_CODE": "0",
        "FID_BLNG_CLS_CODE": "0",
        "FID_TRGT_CLS_CODE": "111111111",
        "FID_TRGT_EXLS_CLS_CODE": "000000",
        "FID_INPUT_PRICE_1": "0",
        "FID_INPUT_PRICE_2": "0",
        "FID_VOL_CNT": "0",
        "FID_INPUT_DATE_1": ""
    }
    response = requests.get(url, headers=headers, params=params)
    response_data = response.json()
    if response.status_code == 200 and "output" in response_data:
        return response_data["output"]
    else:
        raise HTTPException(status_code=500, detail=f"Unexpected response format: {response.text}")

@router.get("/volume-ranking")
def read_volume_ranking():
    try:
        access_token = get_access_token()
        volume_ranking = get_volume_ranking(access_token)
        return volume_ranking
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
