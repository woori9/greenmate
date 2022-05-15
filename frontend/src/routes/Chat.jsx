import { useEffect, useState } from 'react';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ChatRoom from '../components/chat/ChatRoom';
import GoBackBar from '../components/common/GoBackBar';
import useWindowDimensions from '../utils/windowDimension';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import ChatList from '../components/chat/ChatList';
import useUserInfo from '../hooks/useUserInfo';
import formatUserInfo from '../utils/formatUserInfo';
import {
  getJoinDate,
  getChatRoomList,
  getCountUnreadMessages,
} from '../service/chat_service';

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

    const callback = snapshot => {
      setChatList(
        snapshot.docs.map(docChatRoom => {
          return {
            ...docChatRoom.data(),
            id: docChatRoom.id,
          };
        }),
      );
    };

    const unsubscribe = getChatRoomList(userInfo.id, callback);

    return unsubscribe;
  }, []);

  useEffect(() => {
    // 목록에서 count를 실시간으로 보기 위함
    if (!userInfo) return () => {};

    const callback = snapshot => {
      const unreadMessageObj = snapshot.docs.reduce((obj, docUserRoom) => {
        const copyObj = { ...obj };
        copyObj[docUserRoom.id] = docUserRoom.data().countUnreadMessage;
        return copyObj;
      }, unreadMessage);
      setUnreadMessage(unreadMessageObj);
    };

    const unsubscribe = getCountUnreadMessages(userInfo.id, callback);

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
