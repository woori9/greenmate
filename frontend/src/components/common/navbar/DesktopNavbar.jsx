import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../../../assets/logo.png';
import KakaoLoginImg from '../../../assets/kakao_login.png';

const REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao';
const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
const KakaoImg = styled.div`
  height: 30px;
  img {
    height: 100%;
  }
`;

const defaultColor = '#a9a9a9';
const selectedColor = '#fcb448';

const NavTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-box {
    height: 100%;
    width: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 70%;
    }
  }
`;
const AlertMenus = styled.ul`
  display: flex;
  list-style-type: none;
  padding-inline-start: 0px;
  li {
    padding-right: 30px;
  }
`;
const NavSide = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 130px;
  background-color: #f1f1f1;
  padding-top: 100px;
  ul {
    list-style-type: none;
    padding-inline-start: 0px;
  }
`;
const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding-bottom: 40px;
  color: ${props => (props.selected ? selectedColor : defaultColor)};
  p {
    font-size: 10px;
  }
`;

function DesktopNavbar() {
  const accessToken = sessionStorage.getItem('Authorization');
  const { pathname } = useLocation();
  const links = [
    {
      name: '홈',
      path: '/',
      icon: <HomeIcon sx={{ fontSize: 35 }} />,
    },
    {
      name: '식당검색',
      path: '/map',
      icon: <PlaceIcon sx={{ fontSize: 35 }} />,
    },
    {
      name: '커뮤니티',
      path: '/community',
      icon: <WysiwygIcon sx={{ fontSize: 35 }} />,
    },
    {
      name: '내 활동',
      path: '/mymoim',
      icon: <EcoIcon sx={{ fontSize: 35 }} />,
    },
  ];
  return (
    <>
      <NavTop>
        <div className="logo-box">
          <img src={logo} alt="logo-img" />
        </div>
        <AlertMenus>
          {accessToken === null ? (
            <li>
              <a href={KAKAO_URL}>
                <KakaoImg>
                  <img src={KakaoLoginImg} alt="kakao-login" />
                </KakaoImg>
              </a>
            </li>
          ) : (
            <p>로그인완료</p>
          )}
          <li>
            <NotificationsNoneOutlinedIcon
              sx={{ color: 'black', fontSize: 30 }}
            />
          </li>
          <li>
            <Link to="/mypage" style={{ color: 'black' }}>
              <PersonIcon sx={{ fontSize: 30 }} />
            </Link>
          </li>
        </AlertMenus>
      </NavTop>
      <NavSide>
        <ul>
          {links.map(link => (
            <li key={link.path}>
              <StyledLink to={link.path} selected={pathname === `${link.path}`}>
                {link.icon}
              </StyledLink>
            </li>
          ))}
        </ul>
      </NavSide>
    </>
  );
}

export default DesktopNavbar;
