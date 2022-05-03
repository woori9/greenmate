import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledChatItem = styled.li`
  margin: 0;
`;

function ChatItem({ chat, onChatClick }) {
  return (
    <StyledChatItem onClick={() => onChatClick(chat.id)}>
      <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="sample" />
      CHAT ITEM
    </StyledChatItem>
  );
}

ChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string),
    recentMessage: PropTypes.shape({
      content: PropTypes.string,
      sentAt: PropTypes.number,
      sentBy: PropTypes.string,
      readBy: PropTypes.arrayOf(PropTypes.string),
    }),
    type: PropTypes.number,
  }).isRequired,
  onChatClick: PropTypes.func.isRequired,
};

export default ChatItem;
