import PropTypes from 'prop-types';
import { BottomSheet } from 'react-spring-bottom-sheet';
import styled from 'styled-components';
import SearchBox from '../SearchBox';
// import SearchLst from '../SearchLst';
// import SummaryInfo from '../SummaryInfo';
// import DetailInfo from '../DetailInfo';
import 'react-spring-bottom-sheet/dist/style.css';

const BottomSheetBody = styled.div`
  padding: 0 1rem;
`;

function MobileBottomSheet({ setMapSearchKeyword }) {
  return (
    <BottomSheet
      open
      snapPoints={({ maxHeight }) => [160, 270, maxHeight - 60]}
      blocking={false}
    >
      <BottomSheetBody>
        {/* <SummaryInfo /> */}
        {/* <SearchLst /> */}
        {/* <DetailInfo /> */}
        <SearchBox setMapSearchKeyword={setMapSearchKeyword} />
      </BottomSheetBody>
    </BottomSheet>
  );
}
MobileBottomSheet.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
};

export default MobileBottomSheet;
