import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  height: 50px;
  color: #fff;
  background-color: #fcb448;
  border: none;
  border-radius: 10px;
  font-size: 15px;
`;

function ButtonLetsEat() {
  return <Button>같이 먹기</Button>;
}

export default ButtonLetsEat;
