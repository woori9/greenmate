import csv
import requests
import pandas as pd
from pprint import pprint

input_path = r'./data/restaurant.xlsx'
output_path = r'./data/geo.csv'
e_output_path = r'./data/geo_e.csv'

# address = '천안 서북구 두정상가8길 11'
# kakao_local_api = 'https://dapi.kakao.com/v2/local/search/address.json'
# request_url = f'{kakao_local_api}?&query={address}&analyze_type=exact'
# REST_API_KEY = '3963ce84a6636097049e97f540e9974c'
# result = requests.get(
#     request_url, 
#     headers={"Authorization": f'KakaoAK {REST_API_KEY}'}
#     ).json()

# longitude = result['documents'][0]['address']['x']
# latitude = result['documents'][0]['address']['y']
# print(longitude)
# print(latitude)

category_dict = {
    '한식': 0, '양식': 1, '일식': 2, '중식': 3, '분식': 4, 
    '동남아': 5, '인도/중동': 6, '술집': 7, '카페': 8, '베이커리': 9
}

with open(output_path,'a', newline="") as write_f:
    headers = ['id', 'category', 'call', 'latitude', 'longitude',]

    writer = csv.DictWriter(write_f, fieldnames=headers)

    # write err
    with open(e_output_path,'a', newline="") as write_e:
        writer_e = csv.writer(write_e)

        with open(input_path, encoding='utf-8') as csv_file:
            file = csv.reader(csv_file)
            for i, f in enumerate(file):
                if i > 5:
                    break

                res = {
                    'id': f[0],
                    'category': category_dict[f[3]],
                    'call': f[4],
                }

                address = f[6]
                kakao_local_api = 'https://dapi.kakao.com/v2/local/search/address.json'
                request_url = f'{kakao_local_api}?&query={address}&analyze_type=exact'
                REST_API_KEY = '3963ce84a6636097049e97f540e9974c'
                result = requests.get(
                    request_url, 
                    headers={"Authorization": f'KakaoAK {REST_API_KEY}'}
                    ).json()

                res['longitude'] = result['documents'][0]['address']['x']
                res['latitude'] = result['documents'][0]['address']['y']
                writer.writerow(res)
