import { useState, useRef } from 'react';
import styled from 'styled-components';
import BottomSheetHeader from './BottomSheet/BottomSheetHeader';

const BottomSheet = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100vw;
  border-radius: 8px 8px 0px 0px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
  touch-action: none;
`;

function MobileBottomSheet() {
  const bottomSheet = useRef();
  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = window.innerHeight - 60;
  const endTouchLst = [150, 400];
  const newHeightLst = [MIN_HEIGHT, 300, MAX_HEIGHT];

  const [bsHeight, setBsHeight] = useState(MIN_HEIGHT);

  function moveTouch(e) {
    // 예외처리
    if (!bottomSheet.current) {
      return;
    }
    // BottomSheet이 아닐 때
    if (e.target !== bottomSheet.current) {
      return;
    }
    // 최소 높이
    setBsHeight(window.innerHeight - e.changedTouches[0].clientY);
    bottomSheet.current.style.transition = '0.5s ease-in';
  }
  function endTouch(e) {
    const endToucHeight = window.innerHeight - e.changedTouches[0].clientY; // 전체 높이 - 터치가 끝나는 좌표y 값
    // 예외처리
    if (!bottomSheet.current) {
      return;
    }
    // BottomSheet이 아닐 때
    if (
      e.target !== bottomSheet.current &&
      e.target.parentElement !== bottomSheet.current
    ) {
      return;
    }
    if (endToucHeight < endTouchLst[0]) {
      setBsHeight(newHeightLst[0]);
      // 중간 높이
    } else if (endToucHeight < endTouchLst[1]) {
      setBsHeight(newHeightLst[1]);
      bottomSheet.current.style.transition = '0.5s ease-in';
      // 최대 높이
    } else if (
      endToucHeight > endTouchLst[1] ||
      e.changedTouches[0].clientY < 0
    ) {
      setBsHeight(newHeightLst[2]);
      bottomSheet.current.style.transition = '0.5s ease-in';
    }
  }
  window.addEventListener('touchmove', moveTouch);
  window.addEventListener('touchend', endTouch);

  return (
    <BottomSheet
      id="bottom-sheet"
      style={{ height: `${bsHeight}px` }}
      ref={bottomSheet}
    >
      <BottomSheetHeader />
      <h1>bottom</h1>
      <h1>bottom</h1>
    </BottomSheet>
  );
}

export default MobileBottomSheet;
