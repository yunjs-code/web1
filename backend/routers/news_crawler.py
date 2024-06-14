import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter

router = APIRouter()

def fetch_naver_news():
    url = "https://finance.naver.com/news/mainnews.nhn?category=economy"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        print(f"Fetching Naver news from {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select('.articleSubject > a')
        news_list = []

        for article in articles[:5]:
            title = article.get_text().strip()
            link = "https://finance.naver.com" + article['href']
            news_list.append({"title": title, "link": link})
            print(f"Fetched Naver news: {title} - {link}")

        return news_list
    except Exception as e:
        print(f"Error fetching Naver news: {e}")
        return []

def fetch_daum_news():
    url = "https://finance.daum.net/news"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        print(f"Fetching Daum news from {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select('.list_newsmajor > li > div > a')
        news_list = []

        for article in articles[:5]:
            title = article.get_text().strip()
            link = "https://finance.daum.net" + article['href']
            news_list.append({"title": title, "link": link})
            print(f"Fetched Daum news: {title} - {link}")

        return news_list
    except Exception as e:
        print(f"Error fetching Daum news: {e}")
        return []

def fetch_hankyeong_news():
    url = "https://www.hankyung.com/economy"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        print(f"Fetching Hankyung news from {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select('.news_list > li > div > a')
        news_list = []

        for article in articles[:5]:
            title = article.get_text().strip()
            link = article['href']
            news_list.append({"title": title, "link": link})
            print(f"Fetched Hankyung news: {title} - {link}")

        return news_list
    except Exception as e:
        print(f"Error fetching Hankyung news: {e}")
        return []

def fetch_maeil_news():
    url = "https://www.mk.co.kr/news/economy/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        print(f"Fetching Maeil news from {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select('.list_area > ul > li > a')
        news_list = []

        for article in articles[:5]:
            title = article.get_text().strip()
            link = "https://www.mk.co.kr" + article['href']
            news_list.append({"title": title, "link": link})
            print(f"Fetched Maeil news: {title} - {link}")

        return news_list
    except Exception as e:
        print(f"Error fetching Maeil news: {e}")
        return []

@router.get("/news")
async def get_news():
    try:
        naver_news = fetch_naver_news()
        daum_news = fetch_daum_news()
        hankyeong_news = fetch_hankyeong_news()
        maeil_news = fetch_maeil_news()

        news = {
            "naver": naver_news,
            "daum": daum_news,
            "hankyeong": hankyeong_news,
            "maeil": maeil_news
        }

        print(f"Naver News: {naver_news}")
        print(f"Daum News: {daum_news}")
        print(f"Hankyung News: {hankyeong_news}")
        print(f"Maeil News: {maeil_news}")

        print("News fetched successfully")
        return news
    except Exception as e:
        print(f"Error fetching news: {e}")
        return {"error": "Failed to fetch news"}
