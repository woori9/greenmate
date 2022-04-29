import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import Message from './Message';

const StyledChatRoom = styled.div`
  background-color: azure;
  width: 50%;
  height: 500px;
`;

function ChatRoom({ sendMessage, messages }) {
  const messageRef = useRef();

  return (
    <StyledChatRoom className="room">
      <ul>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </ul>
      <input ref={messageRef} type="text" />
      <button
        type="button"
        onClick={() => sendMessage(messageRef.current.value)}
      >
        send message
      </button>
    </StyledChatRoom>
  );
}

ChatRoom.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      author: PropTypes.string,
      content: PropTypes.string,
      timestamp: PropTypes.shape({
        seconds: PropTypes.number,
        nanoseconds: PropTypes.number,
      }),
    }),
  ).isRequired,
};

export default ChatRoom;
