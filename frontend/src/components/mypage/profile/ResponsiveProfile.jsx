import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileProfile from './MobileProfile';
import DesktopProfile from './DesktopProfile';
import useWindowDimensions from '../../../utils/windowDimension';
import { apiGetProfileInfo } from '../../../api/mypage';

function ResponsiveProfile() {
  const { width } = useWindowDimensions();
  const isDesktop = true;
  const [profileInfo, setProfileInfo] = useState({});
  const { userPk } = useParams();
  const getProfileInfo = () => {
    apiGetProfileInfo(
      { userId: userPk },
      res => {
        setProfileInfo(res.data);
      },
      err => {
        console.log(err);
      },
    );
  };
  useEffect(() => {
    getProfileInfo();
  }, []);
  return (
    <div>
      {width > 1024 ? (
        <DesktopProfile
          profileInfo={profileInfo}
          isDesktop={isDesktop}
          getProfileInfo={getProfileInfo}
        />
      ) : (
        <MobileProfile
          profileInfo={profileInfo}
          isDesktop={!isDesktop}
          getProfileInfo={getProfileInfo}
        />
      )}
    </div>
  );
}

export default ResponsiveProfile;
