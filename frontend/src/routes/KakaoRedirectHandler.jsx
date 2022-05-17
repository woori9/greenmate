import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import styled, { keyframes } from 'styled-components';
import { userInfoAtom } from '../atoms/accounts';
import { getToken, apiLogin } from '../api/accounts';
import apiInstance from '../utils/apiInstance';
import veganIcon from '../assets/vegan-icon.png';
import lactoIcon from '../assets/lacto-icon.png';
import ovoIcon from '../assets/ovo-icon.png';
import lactoOvoUcon from '../assets/lacto-ovo-icon.png';
import pescoIcon from '../assets/pesco-icon.png';
import poloIcon from '../assets/polo-icon.png';
import flexiIcon from '../assets/flexi-icon.png';
import { getNotifications } from '../api/notification';
import useNotificationList from '../hooks/useNotificationList';

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const chgbackground = keyframes`
  0%, 100% {
    background: center url(${veganIcon});
    background-size: 5rem 5rem;
  }
  16.6% {
    background: center url(${lactoIcon});
    background-size: 5rem 5rem;
  }
  33.3% {
    background: center url(${ovoIcon});
    background-size: 5rem 5rem;
  }
  50% {
    background: center url(${lactoOvoUcon})
    background-size: 5rem 5rem;
  }
  66.6% {
    background: center url(${pescoIcon});
    background-size: 5rem 5rem;
  }
  80%  {
    background: center url(${poloIcon});
    background-size: 5rem 5rem;
  }
  93.3% {
    background: center url(${flexiIcon});
    background-size: 5rem 5rem;;
  }
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: #f2f2f2;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
  animation: ${chgbackground} 3s linear infinite;
  opacity: 0.5;
`;

function KakaoRedirectHandler() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');
  const [, setUserInfo] = useAtom(userInfoAtom);
  const { setNotifications } = useNotificationList();

  useEffect(() => {
    getToken(
      {
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_REST_API_KEY,
        redirect_uri: 'http://localhost:3000/oauth/callback/kakao',
        code,
      },
      response => {
        const accessToken = response.data.access_token;
        apiLogin({ access_token: accessToken }, res => {
          sessionStorage.setItem('Authorization', res.data.access_token);
          setUserInfo(res.data);

          apiInstance.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;
          getNotifications(setNotifications);
          // 알림 가져오는 요청
          if (res.data.vege_type === null) {
            navigate('/signup');
          } else {
            navigate('/');
          }
        });
      },
    );
  }, []);
  return (
    <Container>
      <ImageContainer />
    </Container>
  );
}

export default KakaoRedirectHandler;
