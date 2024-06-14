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

def get_profit_asset_index_ranking(access_token):
    url = "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/ranking/profit-asset-index"
    headers = {
        "content-type": "application/json; charset=utf-8",
        "authorization": f"Bearer {access_token}",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET,
        "tr_id": "FHPST01730000"
    }
    params = {
        "fid_cond_mrkt_div_code": "J",
        "fid_trgt_cls_code": "0",
        "fid_cond_scr_div_code": "20173",
        "fid_input_iscd": "0000",
        "fid_div_cls_code": "0",
        "fid_input_price_1": "",
        "fid_input_price_2": "",
        "fid_vol_cnt": "",
        "fid_input_option_1": "2023",
        "fid_input_option_2": "0",
        "fid_rank_sort_cls_code": "0",
        "fid_blng_cls_code": "0",
        "fid_trgt_exls_cls_code": "0"
    }
    response = requests.get(url, headers=headers, params=params)
    response_data = response.json()
    if response.status_code == 200 and "output" in response_data:
        return response_data["output"]
    else:
        raise HTTPException(status_code=500, detail=f"Unexpected response format: {response.text}")

@router.get("/profit-ranking")
def read_profit_ranking():
    try:
        access_token = get_access_token()
        profit_ranking = get_profit_asset_index_ranking(access_token)
        return profit_ranking
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
