import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms/accounts';

const Ul = styled.ul`
  padding: 0;
  margin: 1rem 0;
`;
const Li = styled.li`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  list-style: none;
  cursor: pointer;
  color: ${props => (props.selected ? '#fcb448' : 'black')};
  display: ${props => (props.isAvailable ? null : 'none')};
  .icon {
    display: flex;
    align-items: center;
    padding-right: 1rem;
  }
`;

function ProfileLst() {
  const [nowStatus, setNowStatus] = useState('');
  const [userInfo] = useAtom(userInfoAtom);
  const userPk = userInfo.id;
  const { pathname } = useLocation();
  const isMypage = userPk.toString() === pathname.split('/')[2];
  const mypageLst = [
    {
      icon: <BookmarkIcon />,
      pageStatus: 'liked-restaurants',
      pageName: '저장한 식당',
      isAvailable: isMypage,
    },
    {
      icon: <FavoriteIcon />,
      pageStatus: 'liked-feeds',
      pageName: '좋아요',
      isAvailable: isMypage,
    },
    {
      icon: <PeopleAltOutlinedIcon />,
      pageStatus: 'evaluation',
      pageName: '메이트 평가',
      isAvailable: true,
    },
    {
      icon: <StarIcon />,
      pageStatus: 'reviews',
      pageName: '리뷰',
      isAvailable: true,
    },
    {
      icon: <ArticleIcon />,
      pageStatus: 'feeds',
      pageName: '피드',
      isAvailable: true,
    },
    {
      icon: <SettingsIcon />,
      pageStatus: 'setting',
      pageName: '설정',
      isAvailable: isMypage,
    },
  ];
  return (
    <Ul>
      {mypageLst.map(lst => (
        <Li
          key={lst.pageStatus}
          selected={nowStatus === `${lst.pageStatus}`}
          isAvailable={lst.isAvailable}
          onClick={() => setNowStatus(lst.pageStatus)}
        >
          <div className="icon">{lst.icon}</div>
          <p>{lst.pageName}</p>
        </Li>
      ))}
    </Ul>
  );
}

export default ProfileLst;
