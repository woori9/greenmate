import PropTypes from 'prop-types';
import MobileProfile from './MobileProfile';
import DesktopProfile from './DesktopProfile';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveProfile({ userInfo }) {
  const { width } = useWindowDimensions();
  const isDesktop = true;
  return (
    <div>
      {width > 1024 ? (
        <DesktopProfile userInfo={userInfo} isDesktop={isDesktop} />
      ) : (
        <MobileProfile userInfo={userInfo} isDesktop={!isDesktop} />
      )}
    </div>
  );
}

ResponsiveProfile.propTypes = {
  userInfo: PropTypes.shape().isRequired,
};

export default ResponsiveProfile;
