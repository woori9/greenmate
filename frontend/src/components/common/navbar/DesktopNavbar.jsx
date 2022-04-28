import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../../assets/logo.png';

const NavTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1;
  border: 1px solid black;
  background-color: #ffffff;
  .logo-box {
    height: 100%;
    img {
      height: 100%;
    }
  }
`;
const NavSide = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 150px;
  background-color: #f1f1f1;
  padding-top: 100px;
`;

function DesktopNavbar() {
  return (
    <>
      <NavTop>
        <div className="logo-box">
          <img src={logo} alt="logo-img" />
        </div>
      </NavTop>
      <NavSide>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/map">식당 검색</Link>
        </li>
        <li>
          <Link to="/mymoim">내 활동</Link>
        </li>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
      </NavSide>
    </>
  );
}

export default DesktopNavbar;
