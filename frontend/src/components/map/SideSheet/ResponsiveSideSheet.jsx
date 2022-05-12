import PropTypes from 'prop-types';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopSideSheet from './DesktopSideSheet';
import useWindowDimensions from '../../../utils/windowDimension';

function ResponsiveSideSheet({
  getSearchRestau,
  setMapSearchKeyword,
  keyword,
  setKeyword,
  searchResults,
  getSummaryRestau,
  summaryRestau,
}) {
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
          getSearchRestau={getSearchRestau}
          searchResults={searchResults}
          getSummaryRestau={getSummaryRestau}
          summaryRestau={summaryRestau}
        />
      )}
    </div>
  );
}
ResponsiveSideSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  getSearchRestau: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      is_like: PropTypes.bool.isRequired,
      res_info: PropTypes.shape(),
      score: PropTypes.number.isRequired,
    }),
  ).isRequired,
  getSummaryRestau: PropTypes.func.isRequired,
  summaryRestau: PropTypes.shape().isRequired,
};

export default ResponsiveSideSheet;
