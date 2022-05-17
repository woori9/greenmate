import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../../atoms/accounts';
import logo from '../../../assets/logo.png';

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

  .logo-btn {
    display: inline-block;
    width: auto;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;

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
  const navigate = useNavigate();

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
        <button
          type="button"
          className="logo-btn"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="logo-img" />
        </button>
        <AlertMenus>
          <li>
            <NotificationsNoneOutlinedIcon
              sx={{ color: 'black', fontSize: 30 }}
            />
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
