from django.contrib.auth import get_user_model
from django.shortcuts import (
    get_list_or_404,
    get_object_or_404,
)
from rest_framework.decorators import api_view
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
)
from rest_framework.response import Response
from ..models import (
    Feed,
    Restaurant,
    Comment,
)
from ..serializers.Feed import (
    FeedSerializer,
    FeedPostPutSerializer,
    FeedTransSerializer,
)
from ..serializers.comment import (
    CommentSerializer,
    CommentPostPutSerializer,
    CommentTransSerializer,
)
from accounts.views.login import get_request_user
import os
import sys
import urllib.request
import json


def detectLangs(text):
    client_id = "F3Ceu1ZR2dYqgZrlY0DE"
    client_secret = "YTmJHBLiFC"
    encQuery = urllib.parse.quote(text)
    data = "query=" + encQuery
    url = "https://openapi.naver.com/v1/papago/detectLangs"
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        trans_json = json.loads(response_body.decode('utf-8'))
        return trans_json['langCode']


def n2mt(text):
    source = detectLangs(text)
    target = ''
    if source == 'ko':
        target = 'en'
    elif source == 'en':
        target = 'ko'
    client_id = "F3Ceu1ZR2dYqgZrlY0DE" # 개발자센터에서 발급받은 Client ID 값
    client_secret = "YTmJHBLiFC" # 개발자센터에서 발급받은 Client Secret 값
    encText = urllib.parse.quote(text)
    data = f"source={source}&target={target}&text=" + encText
    url = "https://openapi.naver.com/v1/papago/n2mt"
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        trans_json = json.loads(response_body.decode('utf-8'))
        return trans_json['message']['result']['translatedText']


User = get_user_model()

######
# TODO : 전체적인 유저정보 받기, 로그인 필수 붙이기.

@api_view(['GET', 'POST'])
def get_create_feedlist(request):
    '''
    GET: 모든 피드를 조회한다.
    POST: 새로운 피드를 작성한다.
    '''
    # user = get_object_or_404(User, pk=1)
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        feed_list = get_list_or_404(Feed)
        serializer = FeedSerializer(feed_list, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = FeedPostPutSerializer(data=request.data, context={"request": request})
        author = User.objects.get(pk=user.id)
        content_trans = n2mt(request.data['content'])
        if 'restaurant_id' in request.data:
            restaurant = Restaurant.objects.get(pk=request.data['restaurant_id'])
            if serializer.is_valid(raise_exception=True):
                serializer.save(author=author, restaurant=restaurant, content_trans=content_trans)
        else:
            if serializer.is_valid(raise_exception=True):
                serializer.save(author=author, content_trans=content_trans)
        
        return Response(
            data='피드가 정상적으로 작성되었습니다.',
            status=HTTP_201_CREATED
        )


@api_view(['PUT', 'DELETE'])
def update_delete_feed(request, feed_id):
    '''
    PUT: 해당 피드를 수정한다.
    DELETE: 해당 피드를 삭제한다.
    '''
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    feed = get_object_or_404(Feed, pk=feed_id)

    # if request.user.id != feed.author.id:
    if user.id != feed.author.id:
        return Response(
            data='피드에 접근 권한이 없습니다.',
            status=HTTP_403_FORBIDDEN
        )
    if request.method == 'PUT':
        serializer = FeedPostPutSerializer(instance=feed, data=request.data)
        
        if request.data['content'] == serializer.instance.content:
            content_trans = serializer.instance.content_trans
        else:
            content_trans = n2mt(request.data['content'])

        if 'restaurant_id' in request.data:
            restaurant = Restaurant.objects.get(pk=request.data['restaurant_id'])
            if serializer.is_valid(raise_exception=True):
                serializer.save(restaurant=restaurant, content_trans=content_trans)
        else:
            if serializer.is_valid(raise_exception=True):
                serializer.save(content_trans=content_trans)

        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        # if request.user.id != feed.author.id:
        if user.id != feed.author.id:
            return Response(
                data='피드에 접근 권한이 없습니다.',
                status=HTTP_403_FORBIDDEN
            )
        feed.delete()
        return Response(
            data=f'{feed_id}번 피드가 정상적으로 삭제되었습니다.',
            status=HTTP_204_NO_CONTENT
        )


@api_view(['GET', 'POST'])
def get_create_comment(request, feed_id):
    '''
    GET: 해당 피드의 댓글들을 모두 조회한다.
    POST: 해당 피드에 새로운 댓글을 작성한다.
    '''
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        comment = get_list_or_404(Comment, feed_id=feed_id)
        serializer = CommentSerializer(comment, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CommentPostPutSerializer(data=request.data)
        author = User.objects.get(pk=user.id)
        feed = Feed.objects.get(pk=feed_id)
        content_trans = n2mt(request.data['content'])
        if 'parent_id' in request.data:
            parent = Comment.objects.get(pk=request.data['parent_id'])
            if serializer.is_valid(raise_exception=True):
                serializer.save(author=author, feed=feed, parent=parent, content_trans=content_trans)
        else:
            if serializer.is_valid(raise_exception=True):
                serializer.save(author=author, feed=feed, content_trans=content_trans)
        
        return Response(
            data='댓글이 정상적으로 작성되었습니다.',
            status=HTTP_201_CREATED
        )


@api_view(['PUT', 'DELETE'])
def update_delete_comment(request, comment_id):
    '''
    PUT: 해당 댓글을 수정한다.
    DELETE: 해당 댓글을 삭제한다.
    '''
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    comment = get_object_or_404(Comment, pk=comment_id)
    if request.method == 'PUT':
        # if request.user.id != feed.author.id:
        if user.id != comment.author.id:
            return Response(
                data='댓글에 접근 권한이 없습니다.',
                status=HTTP_403_FORBIDDEN
            )
        serializer = CommentPostPutSerializer(instance=comment, data=request.data)
        content_trans = n2mt(request.data['content'])
        if serializer.is_valid(raise_exception=True):
            serializer.save(content_trans=content_trans)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        # if request.user.id != feed.author.id:
        if user.id != comment.author.id:
            return Response(
                data='댓글에 접근 권한이 없습니다.',
                status=HTTP_403_FORBIDDEN
            )
        comment.delete()
        return Response(
            data=f'{comment_id}번 댓글이 정상적으로 삭제되었습니다.',
            status=HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
def like_feed(request, feed_id):
    '''
    POST: 해당 피드에 좋아요를 표시하거나 지운다.
    '''
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    feed = get_object_or_404(Feed, pk=feed_id)
    if feed.like_users.filter(pk=user.id).exists():
        feed.like_users.remove(user)
    else:
        feed.like_users.add(user)
    serializer = FeedSerializer(feed)
    return Response(serializer.data)


@api_view(['POST'])
def like_comment(request, comment_id):
    '''
    POST: 해당 댓글에 좋아요를 표시하거나 지운다.
    '''
    user = get_request_user(request)

    if not user:
        return Response(status=HTTP_401_UNAUTHORIZED)
    elif user == 'EXPIRED_TOKEN':
        return Response(data='EXPIRED_TOKEN', status=HTTP_400_BAD_REQUEST)

    comment = get_object_or_404(Comment, pk=comment_id)
    if comment.like_users.filter(pk=user.id).exists():
        comment.like_users.remove(user)
    else:
        comment.like_users.add(user)
    serializer = CommentSerializer(comment)
    return Response(serializer.data)


@api_view(['GET'])
def get_trans_feed(request, feed_id):
    '''
    GET: 해당 피드의 번역한 내용을 조회한다.
    '''
    if request.method == 'GET':
        feed = get_object_or_404(Feed, pk=feed_id)
        serializer = FeedTransSerializer(feed)
        return Response(serializer.data)


@api_view(['GET'])
def get_trans_comment(request, comment_id):
    '''
    GET: 해당 댓글의 번역한 내용을 조회한다.
    '''
    if request.method == 'GET':
        comment = get_object_or_404(Comment, pk=comment_id)
        serializer = CommentTransSerializer(comment)
        return Response(serializer.data)