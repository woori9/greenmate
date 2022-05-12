from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .moim import update_status
from .firebase_token import delete_token

def start():
    scheduler = BackgroundScheduler(timezone='Asia/Seoul')
    scheduler.add_job(update_status, 'cron', minute='*/10')  # 10 분 간격으로 status 업데이트
    scheduler.add_job(delete_token, 'cron', hour='3')        # 새벽 3시에 업데이트 
    scheduler.start()
