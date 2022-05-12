import PropTypes from 'prop-types';
import styled from 'styled-components';
import Message from './Message';

const StyledMessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

function MessageList({ messages, userId }) {
  return (
    <StyledMessageList>
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          isMyMessage={message.sentBy.id === userId}
        />
      ))}
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
