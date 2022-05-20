import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms/accounts';

const Ul = styled.ul`
  padding: 0;
  margin: 1rem 1rem;
`;
const Li = styled.li`
  padding: 0.8rem 0;
  list-style: none;
  display: ${props => (props.isAvailable ? null : 'none')};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => (props.selected ? '#fcb448' : 'black')};
  .icon {
    display: flex;
    padding-right: 1rem;
  }
  cursor: pointer;
`;

function ProfileLst() {
  const [userInfo] = useAtom(userInfoAtom);
  const userPk = userInfo.id;
  const userLanguage = userInfo.language;
  const { pathname } = useLocation();
  const profileUserPk = pathname.split('/')[2];
  const profilePageTitle = pathname.split('/')[3];
  const isMypage = userPk.toString() === profileUserPk;
  const mypageLst = [
    {
      icon: <BookmarkIcon />,
      pageStatus: 'liked-restaurants',
      pageName: `${userLanguage === 0 ? '저장한 식당' : 'Saved Restaurants'}`,
      path: `/mypage/${profileUserPk}/liked-restaurants`,
      isAvailable: isMypage,
    },
    {
      icon: <PeopleAltOutlinedIcon />,
      pageStatus: 'evaluation',
      pageName: `${userLanguage === 0 ? '받은 메이트 평가' : 'Feedback'}`,
      path: `/mypage/${profileUserPk}/evaluation`,
      isAvailable: true,
    },
    {
      icon: <SettingsIcon />,
      pageStatus: 'setting',
      pageName: `${userLanguage === 0 ? '설정' : 'Settings'}`,
      path: `/mypage/${profileUserPk}/setting`,
      isAvailable: isMypage,
    },
  ];
  return (
    <Ul>
      {mypageLst.map(lst => (
        <Li key={lst.pageStatus} isAvailable={lst.isAvailable}>
          <StyledLink
            to={lst.path}
            selected={profilePageTitle === `${lst.pageStatus}`}
          >
            <div className="icon">{lst.icon}</div>
            <p>{lst.pageName}</p>
          </StyledLink>
        </Li>
      ))}
    </Ul>
  );
}

export default ProfileLst;
