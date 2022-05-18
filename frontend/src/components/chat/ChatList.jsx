import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChatItem from './ChatItem';

const StyledChatList = styled.div`
  position: fixed;
  width: calc((100% - 130px) * 0.4);
  min-height: calc(100vh - 52px);

  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: scroll;
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

function ChatList({ chats, onChatClick, user, unreadMessage, selectChatId }) {
  return (
    <StyledChatList>
      <ul>
        {chats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onChatClick={onChatClick}
            user={user}
            countUnreadMessage={unreadMessage[chat.id] || 0}
            isSelected={selectChatId === chat.id}
          />
        ))}
      </ul>
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
        readBy: PropTypes.arrayOf(PropTypes.string),
        sentBy: PropTypes.shape({
          id: PropTypes.string,
          nickname: PropTypes.string,
          vegeType: PropTypes.number,
        }),
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
  unreadMessage: PropTypes.shape(),
  selectChatId: PropTypes.string,
};

ChatList.defaultProps = {
  unreadMessage: {},
  selectChatId: undefined,
};

export default ChatList;
