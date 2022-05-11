import json
from rest_framework.decorators import api_view
from firebase_admin import messaging
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

@api_view(['POST'])
def test(request):
    # This registration token comes from the client FCM SDKs.
    data = json.loads(request.body)
    registration_token = data['token']

    # See documentation on defining a message payload.
    message = messaging.Message(
        data={
            'title': '타이틀',
            'body': '테스트입니다',
        },
        token=registration_token,
    )

    messaging.send(message)
    return Response(status=HTTP_200_OK)
