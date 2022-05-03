import { useEffect, useRef, useState } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import styled from 'styled-components';
import ChatRoom from '../components/chat/ChatRoom';
import app from '../service/firebase';
import {
  signIn,
  getRoomId,
  sendMessage,
  getPrivateRoomId,
  createPrivateRoom,
} from '../service/chat_service';
import GoBackBar from '../components/common/GoBackBar';
import useWindowDimensions from '../utils/windowDimension';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import ChatList from '../components/chat/ChatList';

const db = getFirestore(app);

const StyledDiv = styled.div`
  padding-top: 100px;
`;

function Chat() {
  const isDesktop = useWindowDimensions().width > 1024;
  const userRef = useRef();
  const moimRef = useRef();
  const [user, setUser] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    if (!user) return () => {};

    const roomsRef = collection(db, 'rooms');
    const q = query(
      roomsRef,
      where('members', 'array-contains', user),
      where('type', '==', 1),
      orderBy('recentMessage.sentAt'),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setChatList(
        snapshot.docs.map(docChatRoom => ({
          ...docChatRoom.data(),
          id: docChatRoom.id,
        })),
      );
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return () => {};
    const q = query(
      collection(db, 'message', selectedChat, 'messages'),
      // 내가 join 한 시점 이후의 메세지만
      // where('timestamp', '>', 'joinTimestamp'),
      orderBy('sentAt'),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(
        snapshot.docs.map(docMessage => ({
          ...docMessage.data(),
          id: docMessage.id,
        })),
      );
    });

    return unsubscribe;
  }, [selectedChat]);

  const selectChat = chatRoomId => {
    setSelectedChat(chatRoomId);
  };

  return (
    <StyledDiv>
      {isDesktop && <DesktopNavbar />}
      <GoBackBar title="채팅">
        <ForwardToInboxIcon sx={{ fontSize: 30 }} />
      </GoBackBar>
      {user ? (
        <>
          <h3>접속한 유저: {user}</h3>

          <h3>{user}의 개인 채팅방 리스트</h3>
          <ChatList chats={chatList} onChatClick={selectChat} />
        </>
      ) : (
        <>
          <input ref={userRef} type="text" placeholder="user" />
          <button
            type="button"
            onClick={() => {
              setUser(userRef.current.value);
              signIn(userRef.current.value);
            }}
          >
            set User
          </button>
        </>
      )}

      <input ref={moimRef} type="text" placeholder="room" />
      <button
        type="button"
        onClick={async () => {
          if (!moimRef.current.value) return;
          const roomId = await getRoomId(moimRef.current.value, user);
          setSelectedChat(roomId);
        }}
      >
        채팅방 입장
      </button>

      <button
        type="button"
        onClick={async () => {
          // 임시로 상대방을 5번 유저로 설정
          // 현재 유저를 설정하지 않으면 에러남..
          const roomId = await getPrivateRoomId('5', user);
          if (roomId) {
            setSelectedChat(roomId);
          } else {
            const createdRoomId = await createPrivateRoom('5', user);
            setSelectedChat(createdRoomId);
          }
        }}
      >
        5번 유저와 채팅하기(상대 프로필의 메세지 아이콘)
      </button>

      {user && selectedChat && (
        <ChatRoom
          roomId={selectedChat}
          user={user}
          sendMessage={sendMessage}
          messages={messages}
        />
      )}
    </StyledDiv>
  );
}

export default Chat;
