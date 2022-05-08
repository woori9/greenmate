import { useState } from 'react';
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

function MobileBottomSheet({ setMapSearchKeyword, keyword, setKeyword }) {
  const [searchPage, setSearchPage] = useState('searchBox');

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
          />
        ) : null}
        {searchPage === 'searchLst' ? (
          <SearchLst keyword={keyword} setSearchPage={setSearchPage} />
        ) : null}
        {searchPage === 'summary' ? (
          <SummaryInfo setSearchPage={setSearchPage} />
        ) : null}
        {searchPage === 'detail' ? (
          <DetailInfo setSearchPage={setSearchPage} />
        ) : null}
      </BottomSheetBody>
    </BottomSheet>
  );
}
MobileBottomSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
};

export default MobileBottomSheet;
