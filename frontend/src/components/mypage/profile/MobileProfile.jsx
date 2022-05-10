import PropTypes from 'prop-types';
import styled from 'styled-components';
import Nickname from '../Nickname';
import FollowerStatus from '../FollowerStatus';
import ButtonContainer from '../ButtonContainer';
import ProfileLst from '../ProfileLst';
import logo from '../../../assets/logo.png';

const Containter = styled.div`
  padding: 78px 1rem;
`;
const NickNameBox = styled.div`
  display: flex;
  align-items: center;
`;

const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  object-fit: cover;
  margin-right: 1rem;
`;
const NameNStatus = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

function MobileProfile({ userInfo, isDesktop }) {
  return (
    <Containter>
      <NameNStatus>
        <NickNameBox>
          <Img src={logo} alt="profile-img" />
          <Nickname userInfo={userInfo} isDesktop={isDesktop} />
        </NickNameBox>
        <FollowerStatus userInfo={userInfo} isDesktop={isDesktop} />
      </NameNStatus>
      <ButtonContainer userInfo={userInfo} />
      <ProfileLst />
    </Containter>
  );
}
MobileProfile.propTypes = {
  userInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

export default MobileProfile;
