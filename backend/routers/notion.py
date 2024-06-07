from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
import requests

router = APIRouter()

NOTION_API_KEY = "secret_wDzQrOMuVR9WiI603zYXAqsKh55DexmYYvbeG9dQ1wF"
DATABASE_ID = "85d0173f9b194552a59ceb544fb268db"
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

    print("Login Query:", query)  # 디버깅을 위한 로그 추가

    response = requests.post(NOTION_SEARCH_URL, headers=headers, json=query)
    print("Response Status Code:", response.status_code)  # 디버깅을 위한 로그 추가
    print("Response Text:", response.text)  # 디버깅을 위한 로그 추가

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
    results = response.json().get("results")
    if len(results) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_data = results[0]["properties"]
    name = user_data["Name"]["title"][0]["text"]["content"]

    print("User Data:", user_data)  # 디버깅을 위한 로그 추가

    return {"message": "Login successful", "name": name}
