import { BottomSheet } from 'react-spring-bottom-sheet';
import styled from 'styled-components';
import SearchBox from '../SearchBox';
import 'react-spring-bottom-sheet/dist/style.css';

const BottomSheetBody = styled.div`
  padding: 0 1rem;
`;

function DesktopSideSheet() {
  return (
    <BottomSheet
      open
      snapPoints={({ maxHeight }) => [160, maxHeight * 0.4, maxHeight - 60]}
      blocking={false}
    >
      <BottomSheetBody>
        <SearchBox />
      </BottomSheetBody>
    </BottomSheet>
  );
}

export default DesktopSideSheet;
