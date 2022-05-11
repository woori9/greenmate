import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  padding: 1rem 0;
  button {
    margin: 0 0.5rem;
    padding: 5px 0;
    width: 100%;
    border: none;
    border-radius: 5px;
  }
  .inactive {
    color: #fcb448;
    border: 1px solid #fcb448;
    background-color: #fff;
  }
  .active {
    color: #fff;
    background-color: #fcb448;
  }
`;

function ButtonContainer({ profileInfo }) {
  const navigate = useNavigate();
  const followingStatus = profileInfo.following_status;
  function getRightButton(statusNum) {
    let rightButton = '';
    if (statusNum === 0) {
      rightButton = (
        <button type="button" className="active">
          팔로우
        </button>
      );
    } else if (statusNum === 1) {
      rightButton = (
        <button type="button" className="inactive">
          팔로잉
        </button>
      );
    } else if (statusNum === 2) {
      rightButton = (
        <button type="button" className="active">
          글쓰기
        </button>
      );
    } else {
      return null;
    }
    return rightButton;
  }
  const rightButton = getRightButton(followingStatus);

  return (
    <Container>
      <button type="button" className="inactive" onClick={() => navigate('/')}>
        메시지
      </button>
      {rightButton}
    </Container>
  );
}
ButtonContainer.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
};
export default ButtonContainer;
