import PropTypes from 'prop-types';
import { BottomSheet } from 'react-spring-bottom-sheet';
import styled from 'styled-components';
import SearchBox from '../SearchBox';
import SearchLst from '../SearchLst';
import SummaryInfo from '../SummaryInfo';
import DetailInfo from '../DetailInfo';
import 'react-spring-bottom-sheet/dist/style.css';

const BottomSheetBody = styled.div`
  padding: 0 1rem;
`;

function MobileBottomSheet({
  getSearchRestau,
  setMapSearchKeyword,
  keyword,
  setKeyword,
  searchResults,
  getSummaryRestau,
  summaryRestau,
  searchPage,
  setSearchPage,
  getDetailRestau,
  detailRestau,
}) {
  return (
    <BottomSheet
      open
      snapPoints={({ minHeight }) => [minHeight + 85]}
      blocking={false}
    >
      <BottomSheetBody>
        {searchPage === 'searchBox' ? (
          <SearchBox
            setMapSearchKeyword={setMapSearchKeyword}
            setSearchPage={setSearchPage}
            setKeyword={setKeyword}
            getSearchRestau={getSearchRestau}
          />
        ) : null}
        {searchPage === 'searchLst' ? (
          <SearchLst
            keyword={keyword}
            setSearchPage={setSearchPage}
            searchResults={searchResults}
            getSummaryRestau={getSummaryRestau}
          />
        ) : null}
        {searchPage === 'summary' ? (
          <SummaryInfo
            setSearchPage={setSearchPage}
            summaryRestau={summaryRestau}
            getDetailRestau={getDetailRestau}
            searchResults={searchResults}
          />
        ) : null}
        {searchPage === 'detail' ? (
          <DetailInfo
            setSearchPage={setSearchPage}
            detailRestau={detailRestau}
          />
        ) : null}
      </BottomSheetBody>
    </BottomSheet>
  );
}
MobileBottomSheet.propTypes = {
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
  searchPage: PropTypes.string.isRequired,
  setSearchPage: PropTypes.func.isRequired,
  getDetailRestau: PropTypes.func.isRequired,
  detailRestau: PropTypes.shape().isRequired,
};

export default MobileBottomSheet;
