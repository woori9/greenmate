import { useAtom } from 'jotai';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import styled from 'styled-components';
import { baseBottomSheetAtom, onDismissAtom } from '../../atoms/bottomSheet';

const StyledBottomSheet = styled(BottomSheet)`
  [data-rsbs-scroll] {
    -webkit-overflow-scrolling: auto;
  }
`;

function BottomSheetBase() {
  const [bottomSheet] = useAtom(baseBottomSheetAtom);
  const [, onDismiss] = useAtom(onDismissAtom);

  return (
    <StyledBottomSheet
      open={bottomSheet.open}
      header={<p className="sheetHeader">{bottomSheet.header}</p>}
      onDismiss={() => onDismiss()}
    >
      {bottomSheet.component}
    </StyledBottomSheet>
  );
}

export default BottomSheetBase;
