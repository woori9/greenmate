import PropTypes from 'prop-types';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopSideSheet from './DesktopSideSheet';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveSideSheet({ getMapwithCommand }) {
  const { width } = useWindowDimensions();
  return (
    <div>
      {width > 1024 ? (
        <DesktopSideSheet getMapwithCommand={getMapwithCommand} />
      ) : (
        <MobileBottomSheet getMapwithCommand={getMapwithCommand} />
      )}
    </div>
  );
}
ResponsiveSideSheet.propTypes = {
  getMapwithCommand: PropTypes.func.isRequired,
};

export default ResponsiveSideSheet;
