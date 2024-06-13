from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
import requests

router = APIRouter()

NOTION_API_KEY = "secret_cZ69hazZ1gkcTX5X4c8h1jK5wi86rNmmWcidINtTlff"
DATABASE_ID = "b7a881e3ac8e4ed68738b29c8bb016f1"
NOTION_API_URL = "https://api.notion.com/v1/pages"
NOTION_SEARCH_URL = "https://api.notion.com/v1/databases/{}/query".format(DATABASE_ID)

class UserData(BaseModel):
    name: str
    email: str
    password: str
    token: str = None

@router.post("/submit")
async def submit_user_data(user_data: UserData):
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    data = {
        "parent": {"database_id": DATABASE_ID},
        "properties": {
            "Name": {"title": [{"text": {"content": user_data.name}}]},
            "Email": {"email": user_data.email},
            "password": {"rich_text": [{"text": {"content": user_data.password}}]},
            "access_token": {"rich_text": [{"text": {"content": user_data.token}}] if user_data.token else []}
        }
    }

    response = requests.post(NOTION_API_URL, headers=headers, json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
    return {"message": "User data submitted successfully"}

@router.post("/login")
async def login_user(email: str = Form(...), password: str = Form(...)):
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    query = {
        "filter": {
            "and": [
                {"property": "Email", "email": {"equals": email}},
                {"property": "password", "rich_text": {"equals": password}}
            ]
        }
    }

    response = requests.post(NOTION_SEARCH_URL, headers=headers, json=query)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
    results = response.json().get("results")
    if len(results) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_data = results[0]["properties"]
    name = user_data["Name"]["title"][0]["text"]["content"]
    access_token = user_data["access_token"]["rich_text"][0]["text"]["content"]
    user_seq_no = user_data["user_seq_no"]["rich_text"][0]["text"]["content"]

    return {"message": "Login successful", "name": name, "access_token": access_token, "user_seq_no": user_seq_no}

@router.post("/refresh")
async def refresh_token(refresh_token: str = Form(...)):
    raise HTTPException(status_code=501, detail="Refresh token is not supported")
