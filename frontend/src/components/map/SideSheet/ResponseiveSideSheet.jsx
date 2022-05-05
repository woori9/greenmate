import PropTypes from 'prop-types';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopSideSheet from './DesktopSideSheet';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponseiveSideSheet({ setMapSearchKeyword }) {
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
ResponseiveSideSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
};

export default ResponseiveSideSheet;
