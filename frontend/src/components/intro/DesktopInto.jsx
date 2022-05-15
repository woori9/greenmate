import styled from 'styled-components';
import KakaoLoginImg from '../../assets/kakao-login.png';
import IntroImg from '../../assets/intro-img.jpg';

const REDIRECT_URI = 'https://k6b105.p.ssafy.io/oauth/callback/kakao';
const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

const Container = styled.div`
  background-color: #fcddc0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 20rem;
  }
`;
const BottomContainer = styled.div`
  p {
    line-height: 150%;
    font-size: 20px;
  }
  .title {
    font-weight: 700;
  }
`;
const KakaoImg = styled.img`
  margin-top: 5rem;
`;

function DesktopInto() {
  return (
    <Container>
      <div>
        <img src={IntroImg} alt="intro" />
      </div>
      <BottomContainer>
        <p>지속 가능한 채식 생활을 위한</p>
        <p>우리들의 식사공간,</p>
        <p className="title">그린메이트</p>
        <a href={KAKAO_URL}>
          <KakaoImg src={KakaoLoginImg} alt="kakao-login" />
        </a>
      </BottomContainer>
    </Container>
  );
}

export default DesktopInto;
