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
  getCurrentMembers,
  increaseUnreadMessage,
  resetUnreadMessage,
} from '../../service/chat_service';
import GoBackBar from '../common/GoBackBar';

const StyledChatRoom = styled.div`
  width: 100%;
  padding-top: ${props => !props.isFromChatPage && '52px'};
  height: 90vh;
  background-color: #f5f5f5;
  overflow: auto;

  .input-container {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    right: 0;
    background-color: azure;

    input {
      width: 90%;
      height: 2.5rem;
      border: 1px solid #a9a9a9;
      border-radius: 25px;
    }
  }
`;

function ChatRoom({ selectedChat, isFromChatPage }) {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const location = useLocation();
  const user = {
    id: '1',
    vegeType: 1,
    nickname: '1번유저',
  };

  const currentChat = isFromChatPage ? selectedChat : location.state;

  const handleSend = async () => {
    const content = messageRef.current.value;
    if (!content) return;

    await sendMessage(currentChat.id, content, user);
    const members = await getCurrentMembers(currentChat.id);

    for (let i = 0; i < members.length; i += 1) {
      if (members[i] !== user.id) {
        increaseUnreadMessage(currentChat.id, members[i]);
      }
    }
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
    <StyledChatRoom className="room" isFromChatPage={isFromChatPage}>
      {!isFromChatPage && (
        <GoBackBar title={isFromChatPage ? '' : currentChat.chatTitle} />
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
    membersInfo: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        nickname: PropTypes.string,
        vegeType: PropTypes.number,
      }),
    ),
    type: PropTypes.number.isRequired,
    chatTitle: PropTypes.string.isRequired,
    joinDate: PropTypes.shape({
      nanoseconds: PropTypes.number,
      seconds: PropTypes.number,
    }),
  }),
  isFromChatPage: PropTypes.bool,
};

ChatRoom.defaultProps = {
  selectedChat: undefined,
  isFromChatPage: undefined,
};

export default ChatRoom;
