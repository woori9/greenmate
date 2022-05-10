import PropTypes from 'prop-types';
import styled from 'styled-components';
import Nickname from '../Nickname';
import FollowerStatus from '../FollowerStatus';
import ButtonContainer from '../ButtonContainer';
import ProfileLst from '../ProfileLst';
import logo from '../../../assets/logo.png';

const Containter = styled.div`
  padding: calc(1rem + 60px) 1rem 1rem calc(1rem + 130px);
`;
const LeftContainer = styled.div`
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
function DesktopProfile({ userInfo, isDesktop }) {
  return (
    <Containter>
      <LeftContainer>
        <NameNStatus>
          <Img src={logo} alt="profile-img" />
          <Nickname userInfo={userInfo} isDesktop={isDesktop} />
          <FollowerStatus userInfo={userInfo} isDesktop={isDesktop} />
        </NameNStatus>
        <ButtonContainer userInfo={userInfo} />
        <ProfileLst />
      </LeftContainer>
      <div />
    </Containter>
  );
}
DesktopProfile.propTypes = {
  userInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};
export default DesktopProfile;
