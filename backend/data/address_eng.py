import requests
from bs4 import BeautifulSoup

address = ''
keyword = '영문주소'
NAVER_URL = f'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query={address}{keyword}'

res = requests.get(NAVER_URL)
soup = BeautifulSoup(res.content, 'html.parser')

eng = soup.select_one('div.detail dd:nth-child(3)').get_text()
