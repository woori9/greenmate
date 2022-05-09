from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(executable_path='chromedriver', options=options)
menu = '*'
GOOGLE_URL = f'https://translate.google.com/?hl=ko&sl=en&tl=en&text={menu}&op=translate'
xpath = '//*[@id="yDmH0d"]/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[1]/div[2]/div[1]'
driver.get(GOOGLE_URL)

wait = WebDriverWait(driver, 10).until(
    EC.text_to_be_present_in_element((By.XPATH, xpath), '*')
)

eng_xpath = driver.find_element_by_xpath(xpath)
eng = eng_xpath.text

print(eng)

driver.close()
