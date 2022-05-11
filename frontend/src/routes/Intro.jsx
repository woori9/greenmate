import styled from 'styled-components';
import KakaoLoginImg from '../assets/kakao_login.png';

const REDIRECT_URI = 'https://k6b105.p.ssafy.io/oauth/callback/kakao';
const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
const KakaoImg = styled.div`
  height: 30px;
  img {
    height: 100%;
  }
`;

function Intro() {
  return (
    <a href={KAKAO_URL}>
      <KakaoImg>
        <img src={KakaoLoginImg} alt="kakao-login" />
      </KakaoImg>
    </a>
  );
}

export default Intro;
