import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../atoms/accounts';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import SettingLst from '../components/mypage/SettingLst';
import SettingUserInfo from '../components/mypage/SettingUserInfo';
import SettingLanguage from '../components/mypage/SettingLanguage';
import SettingNewRestau from '../components/mypage/SettingNewRestau';
import SettingDropUser from '../components/mypage/SettingDropUser';
import useWindowDimensions from '../utils/windowDimension';
import GoBackBar from '../components/common/GoBackBar';
import SettingGoBackBar from '../components/mypage/SettingGoBackBar';

const Container = styled.div`
  padding: ${props =>
    props.isDesktop ? '0 2rem 0 34rem' : '62px 1rem 5rem 1rem'};
`;

function MyPageSetting() {
  const navigate = useNavigate();
  const [userInfo] = useAtom(userInfoAtom);
  const { language } = userInfo;
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [pageStatus, setPageStatus] = useState('settingLst');
  const getPage = {
    settingLst: (
      <SettingLst isDesktop={isDesktop} setPageStatus={setPageStatus} />
    ),
    setNickname: (
      <SettingUserInfo setPageStatus={setPageStatus} isDesktop={isDesktop} />
    ),
    setLanguage: <SettingLanguage />,
    registerNewRestau: (
      <SettingNewRestau isDesktop={isDesktop} setPageStatus={setPageStatus} />
    ),
    deleteUser: <SettingDropUser />,
  };
  const pageTitle = {
    settingLst: `${language === 0 ? '설정' : 'Settings'}`,
    setNickname: `${language === 0 ? '내 정보' : 'Account'}`,
    setLanguage: `${language === 0 ? '언어 설정' : 'Language'}`,
    registerNewRestau: `${language === 0 ? '식당 등록 요청' : 'Send Feedback'}`,
    deleteUser: '',
  };
  const settingGoBackHandler = () => {
    if (pageStatus !== 'settingLst') {
      setPageStatus('settingLst');
    } else {
      navigate(`/mypage/${userInfo.id}`);
    }
  };

  return (
    <>
      {isDesktop ? (
        <>
          <ResponsiveNavbar />
          <ResponsiveProfile />
        </>
      ) : (
        <GoBackBar
          title={pageTitle[pageStatus]}
          handleOnClick={settingGoBackHandler}
        />
      )}
      <Container isDesktop={isDesktop}>
        {isDesktop && pageStatus !== 'settingLst' ? (
          <SettingGoBackBar
            title={pageTitle[pageStatus]}
            setPageStatus={setPageStatus}
          />
        ) : null}
        {getPage[pageStatus]}
      </Container>
    </>
  );
}

export default MyPageSetting;
