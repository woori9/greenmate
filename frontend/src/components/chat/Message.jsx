import PropTypes from 'prop-types';
import styled from 'styled-components';
import ProfileImage from '../common/ProfileImage';

const StyledBox = styled.div`
  display: flex;
  justify-content: ${props => (props.isMyMessage ? 'flex-end' : 'flex-start')};
  font-size: 1em;
  padding: 0 5%;
  margin-top: 3px;

  .messageBox {
    background: #f3f3f3;
    border-radius: 20px;
    padding: 10px 20px;
    display: inline-block;
    max-width: 80%;
    background: ${props => (props.isMyMessage ? '#ffd08a' : 'white')};
  }

  .content {
    display: flex;
    align-items: center;
    white-space: break-spaces;
    word-break: break-all;
  }
`;

const StyledMessage = styled.div`
  display: flex;
  flex-direction: column;

  .profile {
    display: flex;
    justify-content: flex-start;
    font-size: 1em;
    margin-top: 3px;
    align-items: center;
    color: #454545;

    p {
      position: relative;
      left: -10px;
    }
  }
`;

function Message({ message, isMyMessage, showProfile }) {
  const { sentBy } = message;
  return (
    <StyledMessage isMyMessage={isMyMessage}>
      {showProfile && (
        <div className="profile">
          <ProfileImage vegeType={sentBy.vegeType} isBig />
          <p>{sentBy.nickname}</p>
        </div>
      )}
      <StyledBox isMyMessage={isMyMessage}>
        <div className="messageBox">
          <p className="content">{message.content}</p>
        </div>
      </StyledBox>
    </StyledMessage>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
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
  }).isRequired,
  isMyMessage: PropTypes.bool.isRequired,
  showProfile: PropTypes.bool.isRequired,
};

export default Message;
