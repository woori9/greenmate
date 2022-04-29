import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 72px;
  border: 1px solid black;
`;
const NavTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  border: 1px solid black;
`;
const Ul = styled.div`
  display: flex;
`;

function MobileNavbar() {
  return (
    <>
      <NavTop>
        <p>상단바</p>
      </NavTop>
      <NavBottom>
        <Ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/map">식당 검색</Link>
          </li>
          <li>
            <Link to="/mymoim">내활동</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
        </Ul>
      </NavBottom>
    </>
  );
}

export default MobileNavbar;
