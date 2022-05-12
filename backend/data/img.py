import csv
import time
from selenium import webdriver
from selenium.common.exceptions import TimeoutException 
from selenium.common.exceptions import NoSuchElementException 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys


franchise = {
    '강가': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/ganga.jpg',
    '그리너 샐러드': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/greenersalad.jpg',
    '내여자를부탁해': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/myladysalad.jpg',
    '닥터로빈': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/dr.robbin.jpg',
    '더벨로': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/thevelo.jpg',
    '더브레드블루': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/thebreadblue.jpg',
    '도스타코스': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/dostacos.jpg',
    '두르가': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/durga.jpg',
    '로봇김밥': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/robotkimbap.jpg',
    '롤링파스타': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/rolling-pasta.jpg',
    '롯데리아': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/lotteria.jpg',
    '머노까머나': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/manokamana.jpg',
    '반미362': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/banhmi362.jpg',
    '반미리': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/banhmilee.jpg',
    '본도시락': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/bondosirak.jpg',
    '본죽': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/bonjuk.jpg',
    '본죽&비빔밥cafe': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/bonjuk&bibimbapcafe.jpg',
    '샐러데이': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/saladay.jpg',
    '샐러디': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/salady.jpg',
    '스무디킹': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/smoothieking.jpg',
    '스윗밸런스': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/sweetbalabce.jpg',
    '아그라': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/agra.jpg',
    '어글리스토브': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/uglystove.jpg',
    '에베레스트': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/everest.jpg',
    '옥루몽': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/oglumong.jpg',
    '온더보더': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/ontheborder.jpg',
    '올드델리': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/olddelhi.jpg',
    '죠샌드위치': "https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/joessandwich.jpg",
    '캘리포니아 피자키친': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/cpk.jpg',
    '퀴즈노스': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/quiznos.jpg',
    '투고샐러드': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/togosalad.jpg',
    '포탈라': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/potala.jpg',
    '할랄가이즈': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/thehalalguys.jpg'
}


def get_google_img(name, address):
    GOOGLE_MAP = 'https://www.google.co.kr/maps/'
    search_word = f'{address} {name}'

    try:
        return franchise[name]

    except KeyError:
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(executable_path='chromedriver', options=options)
        driver.get(GOOGLE_MAP)

        search = driver.find_element_by_css_selector("#searchboxinput")
        time.sleep(1)

        wait = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'searchbox'))
        )

        search.clear()
        search.send_keys(search_word)
        search.send_keys(Keys.ENTER)
        # driver.implicitly_wait(3)

        wait = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'screen-mode'))
        )

        time.sleep(5)
        try:
            pic = '//*[@id="pane"]/div/div[1]/div/div/div[1]/div[1]/button/img'
            img = driver.find_element_by_xpath(pic)
        except NoSuchElementException:
            try:
                pic = '//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[1]/button/img'
                img = driver.find_element_by_xpath(pic)
            except NoSuchElementException:
                return 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/default.jpg'
        
        img_url = img.get_attribute('src')
        driver.close()

        return img_url


input_path = r'./data/geo.csv'
output_path = r'./data/res_img.csv'
e_output_path = r'./data/res_img_e.csv'


# write 
with open(output_path,'a', newline="", encoding='utf-8') as write_f:
    headers = ['id', 'img_url']

    writer = csv.DictWriter(write_f, fieldnames=headers)
    # writer.writeheader()
    
    # write err
    with open(e_output_path,'a', newline="", encoding='utf-8') as write_e:
        headers_e = ['id', 'name', 'err']
        writer_e = csv.DictWriter(write_e, fieldnames=headers_e)
        # writer_e.writeheader()
        
        # open info file
        with open(input_path, encoding='utf-8') as csv_file:
            file = csv.reader(csv_file)
            # skip header
            next(file)

            for i, f in enumerate(file):
                if i > 40:
                    time.sleep(2)
                    print(f'{i}번 시작')
                    name = f[1].rstrip()
                    address = f[4]
                    res = {
                        'id': f[0],
                        'img_url': 'https://greenmate-ssafy.s3.ap-northeast-2.amazonaws.com/res/default.jpg',
                    }
                    res_e = {
                        'id': f[0],
                        'name': name,
                    }
                    try: 
                        res['img_url'] = get_google_img(name, address)
                        writer.writerow(res)
                        print(f'{i}번 성공 ^_______^')

                    except TypeError:
                        res_e['err'] = 'TypeError'
                        writer.writerow(res)
                        writer_e.writerow(res_e)
                        print(f'{i}번 실패 ㅠㅠ')
                    except AttributeError:
                        res_e['err'] = 'AttributeError'
                        writer.writerow(res)
                        writer_e.writerow(res_e)
                        print(f'{i}번 실패 ㅠㅠ')
                    except KeyError:
                        res_e['err'] = 'KeyError'
                        writer.writerow(res)
                        writer_e.writerow(res_e)
                        print(f'{i}번 실패 ㅠㅠ')
                    except TimeoutException:
                        res_e['err'] = 'TimeoutException'
                        writer.writerow(res)
                        writer_e.writerow(res_e)
                        print(f'{i}번 실패 ㅠㅠ')

print('끝')

