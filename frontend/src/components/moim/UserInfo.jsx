import PropTypes from 'prop-types';
import styled from 'styled-components';
import ProfileImage from '../common/ProfileImage';

const InfoDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

function UserInfo({ userInfo }) {
  return (
    <InfoDiv>
      <ProfileImage isBig={false} />
      <p>{userInfo.nickname}</p>
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
