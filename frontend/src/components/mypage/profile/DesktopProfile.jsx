import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesktopLeftContainer from './DesktopLeftContainer';

const Containter = styled.div`
  padding: calc(1rem + 60px) 2rem 0 calc(2rem + 130px);
  display: flex;
`;

function DesktopProfile({ profileInfo, isDesktop }) {
  return (
    <Containter>
      <DesktopLeftContainer profileInfo={profileInfo} isDesktop={isDesktop} />
    </Containter>
  );
}
DesktopProfile.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};
export default DesktopProfile;
