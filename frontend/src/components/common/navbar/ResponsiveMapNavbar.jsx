import MobileMapNavbar from './MobileMapNavbar';
import DesktopLayout from './DesktopNavbar';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveMapNavbar() {
  const { width } = useWindowDimensions();

  return <div>{width > 1024 ? <DesktopLayout /> : <MobileMapNavbar />}</div>;
}

export default ResponsiveMapNavbar;
