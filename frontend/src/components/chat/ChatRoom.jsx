import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import Message from './Message';

const StyledChatRoom = styled.div`
  background-color: azure;
  width: 50%;
  height: 500px;
`;

function ChatRoom({ roomId, user, sendMessage, messages }) {
  const messageRef = useRef();
  const handleSend = () => {
    const content = messageRef.current.value;
    if (!content) return;

    sendMessage(roomId, content, user);
  };

  return (
    <StyledChatRoom className="room">
      <ul>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
      </ul>
      <input ref={messageRef} type="text" />
      <button type="button" onClick={handleSend}>
        send message
      </button>
    </StyledChatRoom>
  );
}

ChatRoom.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      sentBy: PropTypes.string,
      content: PropTypes.string,
      sentAt: PropTypes.shape({
        nanoseconds: PropTypes.number,
        seconds: PropTypes.number,
      }),
    }),
  ).isRequired,
};

export default ChatRoom;
