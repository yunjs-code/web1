import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

NOTION_TOKEN = os.getenv('NOTION_TOKEN')
NOTION_DATABASE_ID = os.getenv('NOTION_DATABASE_ID')

class User(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(user: User):
    url = f"https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2021-05-13"
    }
    payload = {
        "filter": {
            "and": [
                {
                    "property": "email",
                    "text": {
                        "equals": user.email
                    }
                },
                {
                    "property": "password",
                    "text": {
                        "equals": user.password
                    }
                }
            ]
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    
    if response.status_code != 200 or len(data.get("results", [])) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful"}
