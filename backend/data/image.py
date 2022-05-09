import requests
from bs4 import BeautifulSoup

address = '서울 중구 장충단로 60'
store = '페스타 바이 민구'
NAVER_URL = f'https://map.naver.com/v5/search/{address}{store}'

res = requests.get(NAVER_URL)
soup = BeautifulSoup(res.content, 'html.parser')

image = soup.select('div.Y8J3x > a.place_thumb')

print(image)
