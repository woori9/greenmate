import styled from 'styled-components';

const Header = styled.div`
  height: 48px;
  position: relative;
  padding-top: 16px;
`;

const TopHandle = styled.div`
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background-color: #a1a1a1;
  margin: auto;
`;

function BottomSheetHeader() {
  return (
    <Header>
      <TopHandle />
    </Header>
  );
}

export default BottomSheetHeader;
