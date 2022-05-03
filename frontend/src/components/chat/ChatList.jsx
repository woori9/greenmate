import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatItem from './ChatItem';

const StyledChatList = styled.ul`
  list-style: none;
  padding-top: 50px;
  margin: 0;
`;

function ChatList({ chats }) {
  return (
    <StyledChatList>
      {chats.map(chat => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </StyledChatList>
  );
}

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      members: PropTypes.arrayOf(PropTypes.string),
      recentMessage: PropTypes.shape({
        content: PropTypes.string,
        sentAt: PropTypes.number,
        sentBy: PropTypes.string,
        readBy: PropTypes.arrayOf(PropTypes.string),
      }),
      type: PropTypes.number,
    }),
  ).isRequired,
};

export default ChatList;
