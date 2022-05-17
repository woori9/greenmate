import datetime
from greenmates.models import Moim, Mate
from notifications.views import send_message, create_multiple_alirm
from notifications.models import FirebaseToken

now = datetime.datetime.now()

def make_messages(tokens, body):
    if tokens:
        if send_message(list(tokens), body):
            users_list = tokens.values_list('user', flat=True).distinct()
            create_multiple_alirm(users_list, 2, '모임 자동 취소', body, users_list[0])

def update_status():
    '''
    1. 모임 시간 2시간 전 & 인원부족: 모집 취소 
    2. 모임 시간 이후 & 인원 충족: 모집 종료 
    '''
    two_hrs = now + datetime.timedelta(hours=2)
    # 1. 모임 2시간 전인데, 모임 모집이 안된 경우 => moim status 0(모집중) -> 2(모집취소)
        ## mate_status 1(합류) -> 3(취소)
    Moim.objects.filter(time__lte=two_hrs, status=0).update(status=2)
    mates =  Mate.objects.filter(mate_status=1, moim__status=2)
    tokens = FirebaseToken.objects.filter(user__mate__in=mates).distinct().values_list('registration_token', flat=True)
    body = f'인원부족으로 취소된 모임이 있습니다.'
    make_messages(tokens, body)
    mates.update(mate_status=3)
    
    # 2. 모임 시간 후, moim status가 1(모집 완료)인 모임 => moim status 1(모집완료) -> 3(모임 종료)
        ## mate_status 1(합류) -> 4(완료)
    Moim.objects.filter(time__lte=now, status=1).update(status=3)
    Mate.objects.filter(mate_status=1, moim__status=3).update(mate_status=4)
