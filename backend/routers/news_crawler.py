import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter

router = APIRouter()

def fetch_naver_news():
    urls = {
        "금융": "https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258",
        "증권": "https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=259",
        "경제 일반": "https://finance.naver.com/news/mainnews.naver?category=economy"
    }
    headers = {'User-Agent': 'Mozilla/5.0'}
    news_dict = {}
    
    for category, url in urls.items():
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            articles = soup.select('.articleSubject > a')

            news_list = []

            for article in articles[:5]:
                title = article.get_text().strip()
                link = "https://finance.naver.com" + article['href']
                news_list.append({"title": title, "link": link})
                print(f"Fetched Naver {category} news: {title} - {link}")

            news_dict[category] = news_list
        except Exception as e:
            print(f"Error fetching Naver {category} news: {e}")
            news_dict[category] = []

    return news_dict

@router.get("/news")
async def get_news():
    try:
        naver_news = fetch_naver_news()

        print(f"Naver News: {naver_news}")

        print("News fetched successfully")
        return {"naver": naver_news}
    except Exception as e:
        print(f"Error fetching news: {e}")
        return {"error": "Failed to fetch news"}
