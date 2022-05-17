import styled from 'styled-components';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms/accounts';

const Button = styled.button`
  width: 100%;
  height: 50px;
  color: #fff;
  background-color: #fcb448;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
`;

function ButtonLetsEat() {
  const [userInfo] = useAtom(userInfoAtom);

  return (
    <Button>{userInfo.language === 0 ? '같이 먹기' : "Let's greenmate"}</Button>
  );
}

export default ButtonLetsEat;
