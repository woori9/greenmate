import csv
import requests


input_path = r'./data/resinfo.csv'
output_path = r'./data/geo.csv'
e_output_path = r'./data/geo_e.csv'


def get_coord(address):
    kakao_local_api = 'https://dapi.kakao.com/v2/local/search/address.json'
    request_url = f'{kakao_local_api}?&query={address}&analyze_type=exact'
    REST_API_KEY = '3963ce84a6636097049e97f540e9974c'
    result = requests.get(
        request_url, 
        headers={"Authorization": f'KakaoAK {REST_API_KEY}'}
        ).json()
    return result


# write 
with open(output_path,'a', newline="", encoding='utf-8') as write_f:
    headers = ['id', 'name', 'category', 'call', 'address', 'latitude', 'longitude', 'menus']

    writer = csv.DictWriter(write_f, fieldnames=headers)
    writer.writeheader()
    
    # write err
    with open(e_output_path,'a', newline="", encoding='utf-8') as write_e:
        headers_e = ['id', 'name', 'category', 'call', 'address', 'menus']
        writer_e = csv.DictWriter(write_e, fieldnames=headers_e)
        writer_e.writeheader()
        
        # open info file
        with open(input_path, encoding='utf-8') as csv_file:
            file = csv.reader(csv_file)
            # skip header
            next(file)

            cnt = 0
            num = 1
            category_dict = {
                '한식': 0, '양식': 1, '일식': 2, '중식': 3, '분식': 4, 
                '동남아': 5, '인도/중동': 6, '술집': 7, '카페': 8, '베이커리': 9
            }

            for i, f in enumerate(file):
                res = {
                    'id': num,
                    'category': category_dict[f[3]],
                    'name': f[1],
                    'call': f[4],
                    'address': f[6],
                    'menus': f[7]
                }
                result = get_coord(f[6])
                
                try:
                    res['longitude'] = result['documents'][0]['address']['x']
                    res['latitude'] = result['documents'][0]['address']['y']
                    writer.writerow(res)
                    print(f'{i}번 성공')
                    num += 1
                
                except IndexError:
                    writer_e.writerow(res)
                    cnt += 1
                    print(f'{i}번 실패')


print('좌표변환 끝')
