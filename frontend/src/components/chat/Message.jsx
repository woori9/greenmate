import PropTypes from 'prop-types';

function Message({ message }) {
  return (
    <h3>
      {message.sentBy}로 부터의 메세지 {message.content}
    </h3>
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
};

export default Message;
