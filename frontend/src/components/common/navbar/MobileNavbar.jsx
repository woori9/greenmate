import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import KakaoLoginImg from '../../../assets/kakao_login.png';

const REDIRECT_URI = 'https://k6b105.p.ssafy.io/oauth/callback/kakao';
const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
const KakaoImg = styled.div`
  height: 1rem;
  img {
    height: 100%;
  }
`;

const defaultColor = '#a9a9a9';
const selectedColor = '#fcb448';
const NavBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 62px;
  background-color: #ffffff;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
  ul {
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    list-style-type: none;
    padding-inline-start: 0px;
  }
`;
const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${props => (props.selected ? selectedColor : defaultColor)};
  p {
    font-size: 10px;
  }
`;
const NavTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-size: 28px;
    color: #a9a9a9;
  }
`;

function MobileNavbar() {
  const accessToken = sessionStorage.getItem('Authorization');
  const { pathname } = useLocation();
  const links = [
    {
      name: '홈',
      path: '/',
      icon: <HomeIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: '식당검색',
      path: '/map',
      icon: <PlaceIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: '커뮤니티',
      path: '/community',
      icon: <WysiwygIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: '내 활동',
      path: '/mymoim',
      icon: <EcoIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: '마이페이지',
      path: '/mypage',
      icon: <PersonIcon sx={{ fontSize: 30 }} />,
    },
  ];

  return (
    <>
      <NavTop>
        <p>그린메이트</p>
        {accessToken === null ? (
          <a href={KAKAO_URL}>
            <KakaoImg>
              <img src={KakaoLoginImg} alt="kakao-login" />
            </KakaoImg>
          </a>
        ) : (
          <p>로그인완료</p>
        )}
        <NotificationsNoneOutlinedIcon sx={{ color: 'black', fontSize: 30 }} />
      </NavTop>
      <NavBottom>
        <ul>
          {links.map(link => (
            <li key={link.path}>
              <StyledLink to={link.path} selected={pathname === `${link.path}`}>
                {link.icon}
                <p>{link.name}</p>
              </StyledLink>
            </li>
          ))}
        </ul>
      </NavBottom>
    </>
  );
}

export default MobileNavbar;
