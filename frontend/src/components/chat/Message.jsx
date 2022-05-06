import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledMessage = styled.div`
  display: flex;
  justify-content: ${props => (props.isMyMessage ? 'flex-end' : 'flex-start')};
  font-size: 1em;
  padding: 0 5%;
  margin-top: 3px;

  .messageBox {
    background: #f3f3f3;
    border-radius: 20px;
    padding: 5px 20px;
    display: inline-block;
    max-width: 80%;
    background: ${props => (props.isMyMessage ? '#ffd08a' : 'white')};
  }

  .content {
    display: flex;
    align-items: center;
    letter-spacing: 0.3px;
  }

  .sentBy {
    display: flex;
    align-items: center;
    font-family: Helvetica;
    letter-spacing: 0.3px;
  }

  .pl-10 {
    padding-left: ${props => props.isMyMessage && '10px'};
  }

  .pr-10 {
    padding-right: ${props => props.isMyMessage && '10px'};
  }
`;

function Message({ message, isMyMessage }) {
  return (
    <StyledMessage isMyMessage={isMyMessage}>
      <div className="messageBox">
        <p className="content">{message.content}</p>
      </div>
    </StyledMessage>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    sentBy: PropTypes.string,
    content: PropTypes.string,
    sentAt: PropTypes.shape({
      nanoseconds: PropTypes.number,
      seconds: PropTypes.number,
    }),
  }).isRequired,
  isMyMessage: PropTypes.bool.isRequired,
};

export default Message;
