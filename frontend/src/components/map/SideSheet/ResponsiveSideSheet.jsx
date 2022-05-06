import PropTypes from 'prop-types';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopSideSheet from './DesktopSideSheet';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveSideSheet({ setMapSearchKeyword }) {
  const { width } = useWindowDimensions();

  return (
    <div>
      {width > 1024 ? (
        <DesktopSideSheet setMapSearchKeyword={setMapSearchKeyword} />
      ) : (
        <MobileBottomSheet setMapSearchKeyword={setMapSearchKeyword} />
      )}
    </div>
  );
}
ResponsiveSideSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
};

export default ResponsiveSideSheet;
