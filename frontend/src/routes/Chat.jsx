import { useEffect, useState } from 'react';
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
  findPrivateChatRoom,
  createPrivateRoom,
  activateChatRoom,
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
  const user = {
    id: '1',
    veganType: 1,
    nickname: '1번유저',
  };
  const otherUser = {
    id: '2',
    veganType: 2,
    nickname: '2번유저',
  };
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState({});
  const goBackHandler = () => {
    if (selectedChat) {
      setSelectedChat(null);
    }
  };

  useEffect(() => {
    if (!user.id) return () => {};

    const roomsRef = collection(db, 'rooms');
    const q = query(
      roomsRef,
      where('members', 'array-contains', user.id),
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
  }, []);

  useEffect(() => {
    if (!user.id) return () => {};
    const q = query(
      collection(db, 'users', user.id, 'rooms'),
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
  }, []);

  const selectChat = chatRoomId => {
    setSelectedChat(chatRoomId);
  };

  const chatWithOtherUser = async (you, me) => {
    const chatRoom = await findPrivateChatRoom(you.id, me.id);
    if (chatRoom) {
      await activateChatRoom(user.id, chatRoom.id);
      setSelectedChat(chatRoom);
    } else {
      const createdRoom = await createPrivateRoom(you, me);
      await activateChatRoom(me.id, createdRoom.id);
      setSelectedChat(createdRoom);
    }
  };

  return (
    <StyledDiv>
      <button type="button" onClick={() => chatWithOtherUser(otherUser, user)}>
        2번 유저와 대화하기
      </button>
      {isDesktop ? (
        <>
          <DesktopNavbar />
          <GridChatContainer>
            <ChatList
              chats={chatList}
              onChatClick={selectChat}
              user={user.id}
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
              user={user.id}
              unreadMessage={unreadMessage}
            />
          ) : (
            <ChatRoom selectedChat={selectedChat} user={user.id} />
          )}
        </>
      )}
    </StyledDiv>
  );
}

export default Chat;
