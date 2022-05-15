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
import { useNavigate } from 'react-router-dom';
import ChatRoom from '../components/chat/ChatRoom';
import app from '../service/firebase';
import GoBackBar from '../components/common/GoBackBar';
import useWindowDimensions from '../utils/windowDimension';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import ChatList from '../components/chat/ChatList';
import useUserInfo from '../hooks/useUserInfo';
import formatUserInfo from '../utils/formatUserInfo';
import { getJoinDate } from '../service/chat_service';

const db = getFirestore(app);

const StyledDiv = styled.div`
  padding-top: ${props => (props.isDesktop ? '60px' : '52px')};
  padding-left: ${props => props.isDesktop && '130px'};
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
  const userInfo = formatUserInfo(useUserInfo());
  const navigate = useNavigate();

  const goBackHandler = () => {
    if (selectedChat) {
      setSelectedChat(null);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    // 내 채팅 목록 실시간 업데이트(최근메세지)
    if (!userInfo) return () => {};

    const roomsRef = collection(db, 'rooms');
    const q = query(
      roomsRef,
      where('members', 'array-contains', userInfo.id),
      where('type', '==', 1),
      orderBy('recentMessage.sentAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setChatList(
        snapshot.docs.map(docChatRoom => {
          return {
            ...docChatRoom.data(),
            id: docChatRoom.id,
          };
        }),
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // 목록에서 count를 실시간으로 보기 위함
    if (!userInfo) return () => {};
    const q = query(
      collection(db, 'users', userInfo.id, 'rooms'),
      where('type', '==', 1),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const unreadMessageObj = snapshot.docs.reduce((obj, docUserRoom) => {
        const copyObj = { ...obj };
        copyObj[docUserRoom.id] = docUserRoom.data().countUnreadMessage;
        return copyObj;
      }, unreadMessage);
      setUnreadMessage(unreadMessageObj);
    });

    return unsubscribe;
  }, []);

  const selectChat = async chatRoom => {
    const { id, members, membersInfo } = chatRoom;
    const joinDate = await getJoinDate(userInfo.id, id);
    const pairId = members.find(member => member !== userInfo.id);
    setSelectedChat({
      ...chatRoom,
      joinDate,
      notificationTargetId: pairId,
      chatTitle: membersInfo[`nickname${pairId}`],
    });
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
              user={userInfo.id}
              unreadMessage={unreadMessage}
              selectChatId={selectedChat && selectedChat.id}
            />
            <ChatRoom selectedChat={selectedChat} isFromChatPage />
          </GridChatContainer>
        </>
      ) : (
        <>
          <GoBackBar
            title={selectedChat ? selectedChat.chatTitle : '채팅'}
            handleOnClick={goBackHandler}
          >
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
              user={userInfo.id}
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
