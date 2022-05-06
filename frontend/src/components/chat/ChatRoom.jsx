import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import MessageList from './MessageList';
import { getMessages, sendMessage } from '../../service/chat_service';

const StyledChatRoom = styled.div`
  width: 100%;
  height: 90vh;
  padding-top: 10px;
  background-color: #f5f5f5;
  overflow: auto;

  .input-container {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: azure;

    input {
      width: 100%;
      height: 2.5rem;
      border: 1px solid #a9a9a9;
      border-radius: 25px;
    }
  }
`;

function ChatRoom({ selectedChat, user }) {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const handleSend = () => {
    const content = messageRef.current.value;
    if (!content) return;

    sendMessage(selectedChat, content, user);
  };

  useEffect(() => {
    if (!selectedChat) return () => {};

    const callback = snapshot => {
      setMessages(
        snapshot.docs.map(docMessage => ({
          ...docMessage.data(),
          id: docMessage.id,
        })),
      );
    };

    const unsubscribe = getMessages(selectedChat, callback);

    return unsubscribe;
  }, [selectedChat]);

  return (
    <StyledChatRoom className="room">
      {selectedChat ? (
        <>
          <MessageList messages={messages} user={user} />

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
  selectedChat: PropTypes.string,
  user: PropTypes.string.isRequired,
};

ChatRoom.defaultProps = {
  selectedChat: null,
};

export default ChatRoom;
