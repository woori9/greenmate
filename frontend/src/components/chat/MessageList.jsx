import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Message from './Message';

const StyledMessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  padding-bottom: 90px;
`;

function MessageList({ messages, userId }) {
  const messagesEndRef = useRef(null);
  const messageListRef = useRef([]);
  const scrollToBottom = () => {
    if (!messageListRef.current) return;

    // (window.innerWidth > 1024 ? 130 : 50)
    if (messageListRef.current.scrollHeight > window.innerHeight - 110) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages]);
  return (
    <StyledMessageList ref={messageListRef}>
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          isMyMessage={message.sentBy.id === userId}
          showProfile={
            (message.sentBy.id !== userId && index === 0) ||
            (message.sentBy.id !== userId &&
              index > 0 &&
              messages[index - 1].sentBy.id !== message.sentBy.id)
          }
        />
      ))}
      <div ref={messagesEndRef} />
    </StyledMessageList>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      sentBy: PropTypes.shape({
        id: PropTypes.string,
        vegeType: PropTypes.number,
        nickname: PropTypes.string,
      }),
      sentAt: PropTypes.shape({
        nanoseconds: PropTypes.number,
        seconds: PropTypes.number,
      }),
    }),
  ).isRequired,
  userId: PropTypes.string.isRequired,
};

export default MessageList;
