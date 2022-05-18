import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import Nickname from '../Nickname';
import FollowerStatus from '../FollowerStatus';
import ButtonContainer from '../ButtonContainer';
import ProfileLst from '../ProfileLst';
import ProfileImg from '../../common/ProfileImage';
import { userInfoAtom } from '../../../atoms/accounts';

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
  margin-top: 1.5rem;
`;

function DesktopProfile({ getProfileInfo, profileInfo, isDesktop }) {
  const [userInfo] = useAtom(userInfoAtom);
  const isBig = true;
  return (
    <LeftContainer>
      <NameNStatus>
        <ProfileImg vegeType={userInfo.vege_type} isBig={isBig} />
        <Nickname isDesktop={isDesktop} />
        <FollowerStatus profileInfo={profileInfo} isDesktop={isDesktop} />
      </NameNStatus>
      <ButtonContainer
        getProfileInfo={getProfileInfo}
        profileInfo={profileInfo}
      />
      <ProfileLst />
    </LeftContainer>
  );
}
DesktopProfile.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
  getProfileInfo: PropTypes.func.isRequired,
};
export default DesktopProfile;
