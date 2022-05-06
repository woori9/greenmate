import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatItem from './ChatItem';

const StyledChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

function ChatList({ chats, onChatClick, user, unreadMessage }) {
  return (
    <StyledChatList>
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          onChatClick={onChatClick}
          user={user}
          countUnreadMessage={unreadMessage[chat.id]}
        />
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
        sentBy: PropTypes.string,
        readBy: PropTypes.arrayOf(PropTypes.string),
        sentAt: PropTypes.shape({
          nanoseconds: PropTypes.number,
          seconds: PropTypes.number,
        }),
      }),
      type: PropTypes.number,
    }),
  ).isRequired,
  onChatClick: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  unreadMessage: PropTypes.objectOf(PropTypes.number.isRequired),
};

ChatList.defaultProps = {
  unreadMessage: {},
};

export default ChatList;
