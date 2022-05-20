import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import { BottomSheet } from 'react-spring-bottom-sheet';
import styled from 'styled-components';
import SearchBox from '../SearchBox';
import SearchLst from '../SearchLst';
import SummaryInfo from '../SummaryInfo';
import DetailInfo from '../DetailInfo';
import 'react-spring-bottom-sheet/dist/style.css';
import { pageStatusAtom } from '../../../atoms/map';

const BottomSheetBody = styled.div`
  padding: 0 1rem;
`;

function MobileBottomSheet({ getMapwithCommand }) {
  const [pageStatus] = useAtom(pageStatusAtom);
  return (
    <BottomSheet
      open
      snapPoints={({ minHeight }) => [minHeight + 85]}
      blocking={false}
    >
      <BottomSheetBody>
        {pageStatus === 'searchBox' ? (
          <SearchBox getMapwithCommand={getMapwithCommand} />
        ) : null}
        {pageStatus === 'searchLst' ? (
          <SearchLst getMapwithCommand={getMapwithCommand} />
        ) : null}
        {pageStatus === 'summary' ? (
          <SummaryInfo getMapwithCommand={getMapwithCommand} />
        ) : null}
        {pageStatus === 'detail' ? <DetailInfo /> : null}
      </BottomSheetBody>
    </BottomSheet>
  );
}
MobileBottomSheet.propTypes = {
  getMapwithCommand: PropTypes.func.isRequired,
};

export default MobileBottomSheet;
