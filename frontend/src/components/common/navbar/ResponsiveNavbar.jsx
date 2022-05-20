import MobileLayout from './MobileNavbar';
import DesktopLayout from './DesktopNavbar';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveNavbar() {
  const { width } = useWindowDimensions();

  return <div>{width > 1024 ? <DesktopLayout /> : <MobileLayout />}</div>;
}

export default ResponsiveNavbar;
