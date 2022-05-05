import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatChatDateTime } from '../../utils/formattedDate';

const StyledChatItem = styled.li`
  display: grid;
  grid-template-columns: 1.5fr 5fr 2fr;
  width: 100%;
  padding: 0.5rem 1rem;
  min-width: 200px;
  column-gap: 4%;
  border: gray 1px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 50%;
    background-color: azure;
    grid-row: 1 / 3;
    margin: auto;
  }

  .nickname {
    font-size: 20px;
    font-weight: 500;
  }

  .color-gray {
    color: #a9a9a9;
  }

  .data-unread {
    display: inline-block;
    background-color: #f9795d;
    color: white;
    border-radius: 50%;
    min-width: 20px;
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .m-5 {
    margin: 5px;
  }
`;

function ChatItem({ chat, onChatClick, user, countUnreadMessage }) {
  const { membersInfo, recentMessage } = chat;
  const time = formatChatDateTime(recentMessage.sentAt);
  const pair = membersInfo.find(member => member.id !== user);
  return (
    <StyledChatItem onClick={() => onChatClick(chat.id)}>
      <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="sample" />
      <p className="nickname">{pair.nickname}</p>
      <p className="color-gray text-right m-5">{time}</p>
      <p className="color-gray">{recentMessage.content}</p>
      {!countUnreadMessage && (
        <div className="text-right m-5">
          <span className="data-unread">5</span>
        </div>
      )}
    </StyledChatItem>
  );
}

ChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string),
    membersInfo: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        joinDate: PropTypes.shape({
          nanoseconds: PropTypes.number,
          seconds: PropTypes.number,
        }),
        nickname: PropTypes.string,
        veganType: PropTypes.string,
      }),
    ),
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
  }).isRequired,
  onChatClick: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  countUnreadMessage: PropTypes.number.isRequired,
};

export default ChatItem;
