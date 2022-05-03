import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledChatItem = styled.ul`
  margin: 0;
`;

function ChatItem({ chat }) {
  console.log('chatItem', chat);
  return (
    <StyledChatItem>
      <li>CHAT ITEM</li>
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
};

export default ChatItem;
