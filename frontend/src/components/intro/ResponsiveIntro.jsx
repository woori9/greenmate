import MobileIntro from './MobileIntro';
import DesktopInto from './DesktopInto';
import useWindowDimensions from '../../utils/windowDimension';

function ResponsiveIntro() {
  const { width } = useWindowDimensions();

  return <div>{width > 1024 ? <DesktopInto /> : <MobileIntro />}</div>;
}

export default ResponsiveIntro;
