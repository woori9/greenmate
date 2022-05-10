import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import getProfileInfo from '../api/mypage';

function MyPage() {
  const [userInfo, setUserInfo] = useState({});
  const { userPk } = useParams();
  useEffect(() => {
    getProfileInfo(
      { userId: userPk },
      res => {
        setUserInfo(res.data);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  return (
    <>
      <ResponsiveNavbar />
      <ResponsiveProfile userInfo={userInfo} />
    </>
  );
}

export default MyPage;
