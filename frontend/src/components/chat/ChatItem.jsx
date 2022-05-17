import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatChatDateTime } from '../../utils/formattedDate';
import ProfileImage from '../common/ProfileImage';

const StyledChatItem = styled.li`
  background-color: ${props => props.isSelected && 'azure'};
  display: grid;
  grid-template-columns: 1.5fr 5fr 2fr;
  width: 100%;
  padding: 0.5rem 1rem;
  min-width: 200px;
  column-gap: 4%;
  border: gray 1px;

  .img-wrapper {
    max-width: 100%;
    height: auto;
    border-radius: 50%;
    grid-row: 1 / 3;
    margin: auto;
  }

  .nickname {
    font-size: 20px;
    font-weight: 500;
  }

  .horizon-align {
    margin: auto 0;
  }

  .color-gray {
    color: #a9a9a9;
  }

  .circle-red {
    background-color: #f9795d;
    border-radius: 50%;
    text-align: center;
    width: 100%;
    height: 0;
    padding-top: 100%;
    position: relative;
  }

  .text-right {
    text-align: right;
  }

  .m-5 {
    margin: 5px;
  }

  .temp {
    width: 40%;
    max-width: 20px;
    margin-left: auto;
    position: relative;
  }

  .count {
    position: absolute;
    color: white;
    font-size: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .font-12 {
    font-size: 12px;
  }

  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function ChatItem({ chat, onChatClick, user, countUnreadMessage, isSelected }) {
  const { recentMessage, membersInfo, members } = chat;
  const time = formatChatDateTime(recentMessage.sentAt);
  const pairId = members.find(member => member !== user);

  return (
    <StyledChatItem isSelected={isSelected} onClick={() => onChatClick(chat)}>
      <div className="img-wrapper">
        <ProfileImage vegeType={membersInfo[`vegeType${pairId}`]} isBig />
      </div>
      <p className="nickname horizon-align">
        {membersInfo[`nickname${pairId}`]}
      </p>
      <p className="color-gray text-right font-12 horizon-align">{time}</p>
      <p className="color-gray text-ellipsis">{recentMessage.content}</p>
      {countUnreadMessage > 0 && (
        <div className="m-5">
          <div className="temp">
            <div className="circle-red">
              <p className="count">{countUnreadMessage}</p>
            </div>
          </div>
        </div>
      )}
    </StyledChatItem>
  );
}

ChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string),
    membersInfo: PropTypes.shape(),
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
  }).isRequired,
  onChatClick: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  countUnreadMessage: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default ChatItem;
