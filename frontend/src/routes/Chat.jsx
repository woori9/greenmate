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
  getPrivateRoomId,
  createPrivateRoom,
  activateChatRoom,
  // deactivateChatRoom,
} from '../service/chat_service';
import GoBackBar from '../components/common/GoBackBar';
import useWindowDimensions from '../utils/windowDimension';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import ChatList from '../components/chat/ChatList';

const db = getFirestore(app);

const StyledDiv = styled.div`
  padding-top: 52px;
`;

const GridChatContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
`;

function Chat() {
  const isDesktop = useWindowDimensions().width > 1024;
  const userRef = useRef();
  const moimRef = useRef();
  const [user, setUser] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState({});
  const goBackHandler = () => {
    if (selectedChat) {
      setSelectedChat(null);
    }
  };

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
    if (!user) return () => {};
    const q = query(
      collection(db, 'users', user, 'rooms'),
      where('type', '==', 1),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const unreadMessageObj = snapshot.docs.reduce((obj, docUserRoom) => {
        const copyObj = { ...obj };
        copyObj[docUserRoom.id] = docUserRoom.data().countUnreadMessage;
        return copyObj;
      }, {});

      setUnreadMessage(unreadMessageObj);
    });

    return unsubscribe;
  }, [user]);

  const selectChat = chatRoomId => {
    setSelectedChat(chatRoomId);
  };

  return (
    <StyledDiv>
      {isDesktop ? (
        <>
          <DesktopNavbar />
          <GridChatContainer>
            <ChatList
              chats={chatList}
              onChatClick={selectChat}
              user={user}
              unreadMessage={unreadMessage}
            />
            <ChatRoom selectedChat={selectedChat} user={user} />
          </GridChatContainer>
        </>
      ) : (
        <>
          <GoBackBar title="채팅" handleOnClick={selectChat && goBackHandler}>
            {!selectedChat && (
              <ForwardToInboxIcon
                sx={{ fontSize: 28, marginRight: '1rem', marginTop: '0.5rem' }}
              />
            )}
          </GoBackBar>
          {!selectedChat ? (
            <ChatList
              chats={chatList}
              onChatClick={selectChat}
              user={user}
              unreadMessage={unreadMessage}
            />
          ) : (
            <ChatRoom selectedChat={selectedChat} user={user} />
          )}
        </>
      )}

      {user ? null : (
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
          <input ref={moimRef} type="text" placeholder="room" />
          <button
            type="button"
            onClick={async () => {
              if (!moimRef.current.value) return;
              const roomId = await getRoomId(moimRef.current.value, user);
              await activateChatRoom(user, roomId);
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
                await activateChatRoom(user, roomId);
                setSelectedChat(roomId);
              } else {
                const createdRoomId = await createPrivateRoom('5', user);
                await activateChatRoom(user, createdRoomId);
                setSelectedChat(createdRoomId);
              }
            }}
          >
            5번 유저와 채팅하기(상대 프로필의 메세지 아이콘)
          </button>
        </>
      )}
    </StyledDiv>
  );
}

export default Chat;
