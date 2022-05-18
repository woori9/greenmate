import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../common/ProfileImage';

const InfoDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;

  .profile-btn {
    display: flex;
    align-items: center;
    font-size: 1rem;
    background: none;
    padding: 0;
    border: none;
    cursor: pointer;
  }
`;

function UserInfo({ userInfo }) {
  const navigate = useNavigate();

  return (
    <InfoDiv>
      <button
        type="button"
        className="profile-btn"
        onClick={() => navigate(`/mypage/${userInfo.userId}`)}
      >
        <ProfileImage vegeType={userInfo.vegeType} isBig={false} />
        <p>{userInfo.nickname}</p>
      </button>
    </InfoDiv>
  );
}

UserInfo.propTypes = {
  userInfo: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    mateStatus: PropTypes.number.isRequired,
    nickname: PropTypes.string.isRequired,
    vegeType: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserInfo;
