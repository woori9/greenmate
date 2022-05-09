import PropTypes from 'prop-types';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopSideSheet from './DesktopSideSheet';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveSideSheet({ setMapSearchKeyword, keyword, setKeyword }) {
  const { width } = useWindowDimensions();

  return (
    <div>
      {width > 1024 ? (
        <DesktopSideSheet
          setMapSearchKeyword={setMapSearchKeyword}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      ) : (
        <MobileBottomSheet
          setMapSearchKeyword={setMapSearchKeyword}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      )}
    </div>
  );
}
ResponsiveSideSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
};

export default ResponsiveSideSheet;
