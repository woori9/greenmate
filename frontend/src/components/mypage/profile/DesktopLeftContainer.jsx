import PropTypes from 'prop-types';
import styled from 'styled-components';
import Nickname from '../Nickname';
import FollowerStatus from '../FollowerStatus';
import ButtonContainer from '../ButtonContainer';
import ProfileLst from '../ProfileLst';
import logo from '../../../assets/logo.png';

const LeftContainer = styled.div`
  position: fixed;
  min-width: 23rem;
  width: 23rem;
  border: 1px solid #f2f2f2;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;
const NameNStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  object-fit: cover;
  margin-top: 1rem;
`;
function DesktopProfile({ profileInfo, isDesktop }) {
  return (
    <LeftContainer>
      <NameNStatus>
        <Img src={logo} alt="profile-img" />
        <Nickname profileInfo={profileInfo} isDesktop={isDesktop} />
        <FollowerStatus profileInfo={profileInfo} isDesktop={isDesktop} />
      </NameNStatus>
      <ButtonContainer profileInfo={profileInfo} />
      <ProfileLst />
    </LeftContainer>
  );
}
DesktopProfile.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};
export default DesktopProfile;
