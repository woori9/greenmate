from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .moim import update_status, delete_moim

def start():
    scheduler = BackgroundScheduler(timezone='Asia/Seoul')
    scheduler.add_job(update_status, 'cron', minute='*/10')  # 10 분 간격으로 status 업데이트
    scheduler.add_job(delete_moim, 'cron', hour='00', minute='00')  # 자정에 3개월 지난 모임은 삭제
    scheduler.start()
