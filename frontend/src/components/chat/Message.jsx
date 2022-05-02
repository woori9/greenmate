import PropTypes from 'prop-types';

function Message({ message }) {
  return (
    <h3>
      {message.author}로 부터의 메세지 {message.content}
    </h3>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    author: PropTypes.string,
    content: PropTypes.string,
    timestamp: PropTypes.shape({
      seconds: PropTypes.number,
      nanoseconds: PropTypes.number,
    }),
  }).isRequired,
};

export default Message;
