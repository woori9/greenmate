import MobileMapNavbar from './MobileMapNavbar';
import DesktopMapNavbar from './DesktopMapNavbar';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveMapNavbar() {
  const { width } = useWindowDimensions();

  return <div>{width > 1024 ? <DesktopMapNavbar /> : <MobileMapNavbar />}</div>;
}

export default ResponsiveMapNavbar;
