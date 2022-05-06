import { useAtom } from 'jotai';
import styled from 'styled-components';
import { categoryAtom } from '../../atoms/moim';

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 1rem 0;
`;

const Button = styled.button`
  width: 8.5rem;
  height: 2rem;
  color: #000;
  background: none;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
  cursor: pointer;
`;

function MoimButtons() {
  const [selectedCategory] = useAtom(categoryAtom);
  const buttonDict = {
    0: (
      <ButtonDiv>
        <Button type="button">호스트 문의</Button>
        <Button type="button">대기 취소</Button>
      </ButtonDiv>
    ),
    1: (
      <ButtonDiv>
        <Button type="button">참여 취소</Button>
        <Button type="button">채팅방 입장</Button>
      </ButtonDiv>
    ),
    4: (
      <ButtonDiv>
        <Button type="button">식당 리뷰</Button>
        <Button type="button">모임 평가</Button>
      </ButtonDiv>
    ),
    5: (
      <ButtonDiv>
        <Button type="button">멤버 관리</Button>
        <Button type="button">채팅방 입장</Button>
      </ButtonDiv>
    ),
  };

  return buttonDict[selectedCategory];
}

export default MoimButtons;
