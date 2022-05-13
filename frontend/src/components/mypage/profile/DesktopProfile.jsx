import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesktopLeftContainer from './DesktopLeftContainer';

const Containter = styled.div`
  padding: calc(1rem + 60px) 2rem 0 calc(2rem + 130px);
  display: flex;
`;

function DesktopProfile({ getProfileInfo, profileInfo, isDesktop }) {
  return (
    <Containter>
      <DesktopLeftContainer
        getProfileInfo={getProfileInfo}
        profileInfo={profileInfo}
        isDesktop={isDesktop}
      />
    </Containter>
  );
}
DesktopProfile.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
  getProfileInfo: PropTypes.func.isRequired,
};
export default DesktopProfile;
