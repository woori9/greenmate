import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getMoimChatRoom,
  checkUserIsInMember,
  createMoimChat,
  findPrivateChatRoom,
  createPrivateRoom,
} from '../service/chat_service';

function Test() {
  const navigate = useNavigate();
  const [now, setNow] = useState(true);
  const user1 = {
    id: '1',
    veganType: 1,
    nickname: '1번유저',
  };
  const user2 = {
    id: '2',
    veganType: 2,
    nickname: '2번유저',
  };

  const user = now ? user1 : user2;
  const otherUser = now ? user2 : user1;

  const moimChatHandler = async (moimId, me) => {
    const moimChat = await getMoimChatRoom(moimId);

    if (moimChat) {
      await checkUserIsInMember(moimChat.roomId, me);
      return moimChat.roomId;
    }

    const newRoomId = await createMoimChat(moimId, me);

    return newRoomId;
  };

  const chatWithOtherUser = async (you, me) => {
    console.log('you', you);
    console.log('me', me);
    const chatRoom = await findPrivateChatRoom(you.id, me.id);
    if (chatRoom) {
      return chatRoom.id;
    }
    const createdRoom = await createPrivateRoom(you, me);
    return createdRoom.id;
  };
  return (
    <>
      <button type="button" onClick={() => setNow(false)}>
        2번 유저로 접속하기
      </button>
      <button
        type="button"
        onClick={async () => {
          const moimChatId = await moimChatHandler('1', user);
          navigate('/chatRoom', {
            state: {
              type: 2,
              id: moimChatId,
              chatTitle: '모임 이름',
            },
          });
        }}
      >
        채팅방 입장(1번 모임 참여)
      </button>
      <button
        type="button"
        onClick={async () => {
          const privateChatId = await chatWithOtherUser(otherUser, user);
          navigate('/chatRoom', {
            state: {
              type: 1,
              id: privateChatId,
              chatTitle: otherUser.nickname,
            },
          });
        }}
      >
        번 유저의 프로필. 2번 유저와 대화
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/chat');
        }}
      >
        내 프로필!
      </button>
    </>
  );
}

export default Test;
