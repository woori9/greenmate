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
import GoBackBar from '../components/common/GoBackBar';
import useWindowDimensions from '../utils/windowDimension';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import ChatList from '../components/chat/ChatList';

const db = getFirestore(app);

const StyledDiv = styled.div`
  padding-top: ${props => (props.isDesktop ? '70px' : '52px')};
  padding-left: ${props => props.isDesktop && '140px'};
`;

const GridChatContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
`;

function Chat() {
  const isDesktop = useWindowDimensions().width > 1024;
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState({});
  const goBackHandler = () => {
    if (selectedChat) {
      setSelectedChat(null);
    }
  };

  const user = {
    id: '1',
    vegeType: 1,
    nickname: '1번유저',
  };

  useEffect(() => {
    // 내 채팅 목록 실시간 업데이트(최근메세지)
    if (!user) return () => {};

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
    // 목록에서 count를 실시간으로 보기 위함
    if (!user) return () => {};
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

  const selectChat = chatRoom => {
    setSelectedChat(chatRoom);
  };

  return (
    <StyledDiv isDesktop={isDesktop}>
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
            <ChatRoom selectedChat={selectedChat} isFromChatPage />
          </GridChatContainer>
        </>
      ) : (
        <>
          <GoBackBar title="채팅" handleOnClick={goBackHandler}>
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
            <ChatRoom selectedChat={selectedChat} isFromChatPage />
          )}
        </>
      )}
    </StyledDiv>
  );
}

export default Chat;
