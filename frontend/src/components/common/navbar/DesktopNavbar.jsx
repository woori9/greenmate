import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf';
import PersonIcon from '@mui/icons-material/Person';
import { useAtom } from 'jotai';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { userInfoAtom } from '../../../atoms/accounts';
import logo from '../../../assets/logo.png';
import NotificationIcon from '../../notification/NotificationIcon';

const defaultColor = '#a9a9a9';
const selectedColor = '#fcb448';

const NavTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 2000;
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
  padding-top: 1rem;
`;
const NavSide = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
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
  const [userInfo] = useAtom(userInfoAtom);
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
    {
      name: '채팅',
      path: '/chat',
      icon: <ChatBubbleOutlineIcon sx={{ fontSize: 35 }} />,
    },
  ];
  return (
    <>
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
      <NavTop>
        <div className="logo-box">
          <img src={logo} alt="logo-img" />
        </div>
        <AlertMenus>
          <li>
            <Link to="/notification">
              <NotificationIcon />
            </Link>
          </li>
          <li>
            <Link to={`/mypage/${userInfo.id}`} style={{ color: 'black' }}>
              <PersonIcon sx={{ fontSize: 30 }} />
            </Link>
          </li>
        </AlertMenus>
      </NavTop>
    </>
  );
}

export default DesktopNavbar;
