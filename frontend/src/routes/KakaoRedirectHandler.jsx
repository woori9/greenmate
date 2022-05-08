import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, apiLogin } from '../api/accounts';
import apiInstance from '../utils/apiInstance';

function KakaoRedirectHandler() {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    getToken(
      {
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_REST_API_KEY,
        redirect_uri: 'https://k6b105.p.ssafy.io/oauth/callback/kakao',
        code,
      },
      response => {
        const accessToken = response.data.access_token;
        apiLogin({ access_token: accessToken }, res => {
          sessionStorage.setItem('Authorization', res.data.access_token);
          apiInstance.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;
          if (res.data.vege_type === null) {
            navigate('/signup');
          } else {
            navigate('/');
          }
        });
      },
    );
  });
  return (
    <>
      <h1>카카오</h1>
      <h1>로그인중</h1>
    </>
  );
}

export default KakaoRedirectHandler;
