import { useAtom } from 'jotai';
import styled from 'styled-components';
import moim from '../../atoms/moim';

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 0.5rem 0;
`;

const Button = styled.button`
  width: 9rem;
  height: 2rem;
  color: #000;
  background: none;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
  cursor: pointer;
`;

function MoimButtons() {
  const [selectedCategory] = useAtom(moim);
  const buttonsList = [
    <ButtonDiv>
      <Button type="button">호스트 문의</Button>
      <Button type="button">대기 취소</Button>
    </ButtonDiv>,
    <ButtonDiv>
      <Button type="button">참여 취소</Button>
      <Button type="button">채팅방 입장</Button>
    </ButtonDiv>,
    <ButtonDiv>
      <Button type="button">멤버 관리</Button>
      <Button type="button">채팅방 입장</Button>
    </ButtonDiv>,
    <ButtonDiv>
      <Button type="button">식당 리뷰</Button>
      <Button type="button">모임 평가</Button>
    </ButtonDiv>,
  ];

  return buttonsList[selectedCategory];
}

export default MoimButtons;
