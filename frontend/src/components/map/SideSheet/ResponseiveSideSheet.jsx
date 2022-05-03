import MobileBottomSheet from './MobileBottomSheet';
import DesktopSideSheet from './DesktopSideSheet';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponseiveSideSheet() {
  const { width } = useWindowDimensions();

  return (
    <div>{width > 1024 ? <DesktopSideSheet /> : <MobileBottomSheet />}</div>
  );
}

export default ResponseiveSideSheet;
