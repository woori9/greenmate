import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MobileProfile from './MobileProfile';
import DesktopProfile from './DesktopProfile';
import useWindowDimensions from '../../../utils/windowDimension';
import { getProfileInfo } from '../../../api/mypage';

function ResponsiveProfile() {
  const { width } = useWindowDimensions();
  const isDesktop = true;
  const [profileInfo, setProfileInfo] = useState({});
  const { userPk } = useParams();
  useEffect(() => {
    getProfileInfo(
      { userId: userPk },
      res => {
        setProfileInfo(res.data);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  return (
    <div>
      {width > 1024 ? (
        <DesktopProfile profileInfo={profileInfo} isDesktop={isDesktop} />
      ) : (
        <MobileProfile profileInfo={profileInfo} isDesktop={!isDesktop} />
      )}
    </div>
  );
}

export default ResponsiveProfile;
