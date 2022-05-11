import PropTypes from 'prop-types';
import styled from 'styled-components';
import Nickname from '../Nickname';
import FollowerStatus from '../FollowerStatus';
import ButtonContainer from '../ButtonContainer';
import ProfileLst from '../ProfileLst';
import ProfileImg from '../../common/ProfileImage';

const Containter = styled.div`
  padding: 62px 1rem;
`;
const NickNameBox = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
`;

const NameNStatus = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

function MobileProfile({ profileInfo, isDesktop }) {
  const isBig = true;
  return (
    <Containter>
      <NameNStatus>
        <NickNameBox>
          <ProfileImg
            className="profile-img"
            vegeType={profileInfo.vege_type}
            isBig={isBig}
          />
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
