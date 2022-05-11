import PropTypes from 'prop-types';
import styled from 'styled-components';
import Nickname from '../Nickname';
import FollowerStatus from '../FollowerStatus';
import ButtonContainer from '../ButtonContainer';
import ProfileLst from '../ProfileLst';
import logo from '../../../assets/logo.png';

const Containter = styled.div`
  padding: 62px 1rem;
`;
const NickNameBox = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
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

function MobileProfile({ profileInfo, isDesktop }) {
  return (
    <Containter>
      <NameNStatus>
        <NickNameBox>
          <Img src={logo} alt="profile-img" />
          <Nickname profileInfo={profileInfo} isDesktop={isDesktop} />
        </NickNameBox>
        <FollowerStatus profileInfo={profileInfo} isDesktop={isDesktop} />
      </NameNStatus>
      <ButtonContainer profileInfo={profileInfo} />
      <ProfileLst />
    </Containter>
  );
}
MobileProfile.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

export default MobileProfile;
