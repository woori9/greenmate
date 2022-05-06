import PropTypes from 'prop-types';
import styled from 'styled-components';
import Message from './Message';

const StyledMessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

function MessageList({ messages, user }) {
  return (
    <StyledMessageList>
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          isMyMessage={message.sentBy === user}
        />
      ))}
    </StyledMessageList>
  );
}

MessageList.propTypes = {
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
  user: PropTypes.string.isRequired,
};

export default MessageList;
