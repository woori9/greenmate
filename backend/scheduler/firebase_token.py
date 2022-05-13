import datetime
from dateutil.relativedelta import relativedelta
from notifications.models import FirebaseToken


now = datetime.datetime.now()
delta = relativedelta(months=2)


def delete_token():
    '''
    2개월 이상 업데이트 되지 않은 토큰 삭제
    '''
    two_months_ago = now - delta
    FirebaseToken.objects.filter(updated_at__lte=two_months_ago).delete()