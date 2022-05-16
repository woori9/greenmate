import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../../atoms/accounts';

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
  z-index: 2;

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
  const [userInfo] = useAtom(userInfoAtom);
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
      path: `/mypage/${userInfo.id}`,
      icon: <PersonIcon sx={{ fontSize: 30 }} />,
    },
  ];

  return (
    <>
      <NavTop>
        <p>그린메이트</p>
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
