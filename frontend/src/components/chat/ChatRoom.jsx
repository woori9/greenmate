/* eslint-disable no-param-reassign */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from 'react-router-dom';
import MessageList from './MessageList';
import {
  getMessages,
  sendMessage,
  activateChatRoom,
  deactivateChatRoom,
  increaseUnreadMessage,
  resetUnreadMessage,
} from '../../service/chat_service';
import GoBackBar from '../common/GoBackBar';
import useUserInfo from '../../hooks/useUserInfo';
import formatUserInfo from '../../utils/formatUserInfo';
import { sendNotification } from '../../api/notification';
import useWindowDimensions from '../../utils/windowDimension';
import DesktopNavbar from '../common/navbar/DesktopNavbar';

const StyledChatRoom = styled.div`
  width: 100%;
  padding-top: ${props => (props.needDesktopNavbar ? '110px' : '52px')};
  padding-top: ${props => props.isFromChatPage && '0px'};
  padding-left: ${props => props.needDesktopNavbar && '150px'};
  min-height: 100vh;
  padding-bottom: 4.5rem;
  background-color: #f5f5f5;
  position: relative;

  .input-container {
    width: ${props =>
      props.needDesktopNavbar ? 'calc(100% - 130px)' : '100%'};
    width: ${props => props.isFromChatPage && 'calc((100% - 130px)*0.6)'};
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0px;
    right: 0;
    padding: 0rem 0.5rem;
    @media screen and (max-width: 1024px) {
      width: 100%;
    }
    input {
      width: 100%;
      height: 3rem;
      border: 1px solid #a9a9a9;
      border-radius: 25px;
    }
  }
`;

function ChatRoom({ selectedChat, isFromChatPage }) {
  const userInfo = useUserInfo();
  const user = formatUserInfo(userInfo);
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const location = useLocation();
  const currentChat = isFromChatPage ? selectedChat : location.state;
  const needDesktopNavbar = isFromChatPage
    ? false
    : useWindowDimensions().width > 1024;

  useEffect(() => {
    if (!currentChat) return () => {};
    const listener = e => {
      deactivateChatRoom(user.id, currentChat.id);
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, [currentChat]);

  const handleSend = async () => {
    const content = messageRef.current.value;
    if (!content) return;

    const { id, notificationTargetId, type } = currentChat;

    await sendMessage(id, content, user);
    const { members } = currentChat;

    for (let i = 0; i < members.length; i += 1) {
      if (members[i] !== user.id) {
        increaseUnreadMessage(id, members[i]);
      }
    }

    sendNotification(notificationTargetId, type, id);
  };

  useEffect(() => {
    if (!currentChat) return () => {};

    const callback = snapshot => {
      setMessages(
        snapshot.docs.map(docMessage => ({
          ...docMessage.data(),
          id: docMessage.id,
        })),
      );
    };

    const unsubscribe = getMessages(currentChat, callback);
    activateChatRoom(user.id, currentChat.id);
    resetUnreadMessage(user.id, currentChat.id);

    return () => {
      unsubscribe();
      deactivateChatRoom(user.id, currentChat.id);
    };
  }, [currentChat]);

  return (
    <StyledChatRoom
      className="room"
      isFromChatPage={isFromChatPage}
      needDesktopNavbar={needDesktopNavbar}
    >
      {needDesktopNavbar && <DesktopNavbar />}
      {!isFromChatPage && (
        <GoBackBar title={currentChat ? currentChat.chatTitle : ''} />
      )}
      {currentChat ? (
        <>
          <MessageList messages={messages} userId={user.id} />

          <div className="input-container">
            <input ref={messageRef} type="text" />
            <button type="button" onClick={handleSend}>
              <SendIcon sx={{ fontSize: 30 }} />
            </button>
          </div>
        </>
      ) : (
        <h3>대화를 시작해보세요</h3>
      )}
    </StyledChatRoom>
  );
}

ChatRoom.propTypes = {
  selectedChat: PropTypes.shape({
    id: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string),
    membersInfo: PropTypes.shape(),
    type: PropTypes.number.isRequired,
    chatTitle: PropTypes.string.isRequired,
    joinDate: PropTypes.shape({
      nanoseconds: PropTypes.number,
      seconds: PropTypes.number,
    }),
    notificationTargetId: PropTypes.string.isRequired,
  }),
  isFromChatPage: PropTypes.bool,
};

ChatRoom.defaultProps = {
  selectedChat: undefined,
  isFromChatPage: undefined,
};

export default ChatRoom;
