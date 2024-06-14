from fastapi import APIRouter
import requests
from bs4 import BeautifulSoup
import logging

router = APIRouter()

logging.basicConfig(level=logging.INFO)

@router.get("/exchange-rate")
async def get_exchange_rate():
    url = 'https://finance.naver.com/marketindex/'
    response = requests.get(url)
    logging.info(f'Response status code: {response.status_code}')
    
    if response.status_code != 200:
        logging.error(f'Failed to fetch data from {url}')
        return {"exchange_rates": []}
    
    soup = BeautifulSoup(response.text, 'html.parser', from_encoding='euc-kr')
    logging.info(f'Soup object: {soup.prettify()[:1000]}')  # Show a snippet of the parsed HTML for debugging
    
    items = soup.select('#exchangeList li')
    logging.info(f'Found {len(items)} items')
    
    data = []
    for item in items:
        try:
            currency_name = item.select_one('h3.h_lst span.blind').get_text(strip=True)
            rate = item.select_one('span.value').get_text(strip=True)
            change = item.select_one('span.change').get_text(strip=True)
            change_sign = item.select_one('span.blind').get_text(strip=True)
            
            logging.info(f'Currency: {currency_name}, Rate: {rate}, Change: {change}, Change Sign: {change_sign}')
            
            data.append({
                "currency": currency_name,
                "rate": rate,
                "change": change,
                "change_sign": change_sign
            })
        except Exception as e:
            logging.error(f'Error parsing item: {e}')
    
    logging.info(f'Crawled Data: {data}')
    return {"exchange_rates": data}
