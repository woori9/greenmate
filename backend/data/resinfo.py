import csv
import requests
import time
from bs4 import BeautifulSoup
from datetime import datetime
from selenium import webdriver
from selenium.common.exceptions import TimeoutException 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

franchise = {
    '본죽': ['Bonjuk', ],
    '롯데리아': ['Lotteria', ],
    '퀴즈노스': ['Quiznos', ],
    '죠샌드위치': ['Joe\'s Sandwich', ], 
    '본죽&비빔밥cafe': ['Bonjuk&Bibimbap Cafe', ],
    '샐러디': ['Salady', ],
    '스무디킹': ['Smoothie King', ],
    '투고샐러드': ['Togo Salad', ],
    '닥터로빈': ['Dr.ROBBIN', ],
    '도스타코스': ['Dostacos', ],
    '본도시락': ['Bondosirak', ],
    '온더보더': ['On The Border', ],
    '로봇김밥': ['Robot Kimbap', ],
    '그리너 샐러드': ['Greener Salad', ],
    '스윗밸런스': ['Sweet Balabce', ],
    '캘리포니아 피자키친': ['California Pizza Kitchen', ],
    '강가': ['Ganga', ],
    '두르가': ['Durga', ],
    '아그라': ['Agra', ],
    '에베레스트': ['Everest', ],
    '할랄가이즈': ['The Halal Guys', ],
    '포탈라': ['Potala', ],
    '올드델리': ['Old Delhi'],
    '어글리스토브': ['Ugly Stove'],
    '내여자를부탁해': ['My Lady Salad'],
    '반미362': ['Banhmi362'],
    '더벨로': ['The Velo', ],
    '샐러데이': ['Saladay', ],
    '더브레드블루': ['The Bread Blue', ],
    '옥루몽': ['Oglumong', ],
    '롤링파스타': ['Rolling-pasta', ],
    '머노까머나': ['Mano Kamana', ],
    '반미리': ['Banhmi lee', ],
}


def get_vege_types(menus):
    # print(menus)
    menu_list = menus.split(' ')
    vege_dict = { '비건': 'vegan', '락토': 'lacto', '오보': 'ovo', '락토오보': 'lacto-ovo', '페스코': 'pesco', '폴로': 'pollo' }
    vege_types_kr, vege_types_en = set(), set()
    for menu in menu_list:
        # print(menu_list)
        tmp = menu.split('(')
        # print(tmp)
        try:
            tmptmp = tmp[1].split(',')
        except:
            continue
        tmptmp[-1] = tmptmp[-1].strip(')')
        for vege in tmptmp:
            if vege != '일반식':
                vege = vege.strip('가능')
                vege_types_kr.add(vege)
                vege_types_en.add(vege_dict[vege])
    res_k, res_e = '', ''
    for v_kr in vege_types_kr:
        res_k += f'{v_kr} '
    for v_en in vege_types_en:
        res_e += f'{v_en} '
    return res_k.rstrip(), res_e.rstrip()


def get_en_address(address):
    keyword = '영문주소'
    NAVER_URL = f'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query={address}{keyword}'

    res = requests.get(NAVER_URL)
    soup = BeautifulSoup(res.content, 'html.parser')

    eng = soup.select_one('div.detail dd:nth-child(3)').get_text()
    return eng


def get_translate(name, code, menu=''):
    flag = 0
    try:
        tmp = franchise[name]
        return tmp[code]
    except IndexError:
        flag = 1
    except KeyError:
        pass

    check = '*'
    if code == 0:
        search = check + name
    elif code == 1:
        search = check + menu

    GOOGLE_URL = f'https://translate.google.com/?hl=ko&sl=en&tl=en&text={search}&op=translate'
    xpath = '//*[@id="yDmH0d"]/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[1]/div[2]/div[1]'

    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)
    driver.get(GOOGLE_URL)

    wait = WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.XPATH, xpath), '*')
    )

    eng_xpath = driver.find_element_by_xpath(xpath)
    eng = eng_xpath.text
    result = eng.strip('*').title()
    
    driver.close()

    if flag:
        franchise[name].append(result)
    return result


def check_trans(word):
    '''
    Ilbansig,Bigeonganeung
    '''
    word = word.replace('Bigeon', 'vegan')
    word = word.replace('Lagto', 'lacto')
    word = word.replace('Obo', 'ovo')
    word = word.replace('Lagtoovo', 'lacto-ovo')
    word = word.replace('Lagtoobo', 'lacto-ovo')
    word = word.replace('Peseuko', 'pesco')
    word = word.replace('Ilbansig,', '')
    word = word.replace('ganeung', ' possible')
    return word


input_path = r'./data/geo.csv'
output_path = r'./data/resinfo_table.csv'
e_output_path = r'./data/resinfo_table_e.csv'


# write 
with open(output_path,'a', newline="", encoding='utf-8') as write_f:
    headers = ['restaurant', 'language', 'name', 'address', 'menus', 'vege_types']

    writer = csv.DictWriter(write_f, fieldnames=headers)
    writer.writeheader()
    
    # write err
    with open(e_output_path,'a', newline="", encoding='utf-8') as write_e:
        headers_e = ['restaurant', 'language', 'name', 'vege_types', 'address', 'menus']
        writer_e = csv.DictWriter(write_e, fieldnames=headers_e)
        writer_e.writeheader()
        
        # open info file
        with open(input_path, encoding='utf-8') as csv_file:
            file = csv.reader(csv_file)
            # skip header
            next(file)

            for i, f in enumerate(file):
                print(f'{i}번 시작')
                name = f[1].rstrip()
                res_k = {
                    'restaurant': f[0],
                    'language': 0, 
                    'name': name,
                    'address': f[4],
                    'menus': f[7]
                }
                res_e = {
                    'restaurant': f[0],
                    'language': 1, 
                }
                try: 
                    vege_types = get_vege_types(f[7])
                    res_k['vege_types'] = vege_types[0]
                    res_e['vege_types'] = vege_types[1]
                    res_e['name'] = get_translate(name, 0)
                    res_e['address'] = get_en_address(f[4])
                    menus_en = get_translate(name, 1, menu=f[7])
                    res_e['menus'] = check_trans(menus_en)
                    
                    writer.writerow(res_k)
                    writer.writerow(res_e)
                    print(f'{i}번 성공 ^_______^')
                    time.sleep(2)
                except AttributeError:
                    writer_e.writerow(res_k)
                    print(f'{i}번 실패 ㅠㅠ')
                except KeyError:
                    writer_e.writerow(res_k)
                    print(f'{i}번 실패 ㅠㅠ')
                except TimeoutException:
                    writer_e.writerow(res_k)
                    print(f'{i}번 실패 ㅠㅠ')

print('끝')
