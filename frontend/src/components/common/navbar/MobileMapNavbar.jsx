import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../../atoms/accounts';

const defaultColor = '#a9a9a9';
const selectedColor = '#fcb448';
const NavBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 5;
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

function MobileMapNavbar() {
  const [userInfo] = useAtom(userInfoAtom);
  const { language } = userInfo;
  const { pathname } = useLocation();
  const links = [
    {
      name: `${language === 0 ? '홈' : 'Home'}`,
      path: '/',
      icon: <HomeIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: `${language === 0 ? '식당검색' : 'Nearby'}`,
      path: '/map',
      icon: <PlaceIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: `${language === 0 ? '커뮤니티' : 'Community'}`,
      path: '/community',
      icon: <WysiwygIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: `${language === 0 ? '그린메이트' : 'Greenmate'}`,
      path: '/mymoim',
      icon: <RestaurantOutlinedIcon sx={{ fontSize: 30 }} />,
    },
    {
      name: `${language === 0 ? '마이페이지' : 'MY'}`,
      path: `/mypage/${userInfo.id}`,
      icon: <PersonIcon sx={{ fontSize: 30 }} />,
    },
  ];

  return (
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
  );
}

export default MobileMapNavbar;
