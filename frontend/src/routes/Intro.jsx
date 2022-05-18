/* eslint-disable react/jsx-props-no-spreading */
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import carouselImage1 from '../assets/intro-img1.png';
import carouselImage2 from '../assets/intro-img2.png';
import carouselImage3 from '../assets/intro-img3.png';
import carouselImage4 from '../assets/intro-img4.png';

const REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao';
const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

const Container = styled.div`
  // Slider custom css
  .slider-dots {
    position: relative;
    bottom: 30px;
    width: 100%;
    list-style: none;
    text-align: center;
    padding: 0;
  }
  .slider-dots li {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    /*margin: 1px;*/
    padding: 0;
    cursor: pointer;
  }
  .slider-dots li button {
    font-size: 0;
    line-height: 0;
    display: block;
    width: 20px;
    height: 20px;
    padding: 5px;
    cursor: pointer;
    color: #fff;
    border: 0;
    outline: 0;
    background: 0 0;
  }
  .slider-dots li button:before {
    font-size: 2.7rem;
    line-height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    content: '•';
    text-align: center;
    opacity: 0.75;
    color: rgba(169, 169, 169, 0.5);
  }
  .slider-dots li.slick-active button:before {
    opacity: 0.75;
    color: #fcb448;
  }
`;
const SliderItem = styled.div`
  min-height: 90vh;
  display: grid;
  place-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 1025px) {
    flex-direction: row;
  }
  img {
    max-height: 16rem;
    max-width: 16rem;
    @media screen and (min-width: 1025px) {
      margin-right: 2rem;
    }
  }
  .text-container {
    padding: 2rem 0;
    width: 16rem;
    .title {
      font-size: 1.3rem;
      font-weight: 600;
      line-height: 150%;
    }
    .sub-title {
      padding: 1rem 0;
      line-height: 150%;
    }
    .strong {
      color: #fcb448;
    }
  }
`;

const BottomContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  a {
    text-decoration: none;
  }
  .kakao-button {
    width: 16rem;
    padding: 0.7rem 0;
    border-radius: 20px;
    border: 2px solid #fcb448;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0;
    p {
      color: #fcb448;
    }
  }
`;
const sliderItems = [
  <>
    <img src={carouselImage1} alt="" />
    <div className="text-container">
      <div className="title">
        <p>내 입맛에 딱 맞는</p>
        <p>채식 식당 정보가 있으니까</p>
      </div>
      <div className="sub-title">
        <p>채식 식당 정보에는</p>
        <p>메뉴별 채식타입부터 후기까지</p>
        <p>한 번에 확인하고</p>
        <p>그린메이트에 저장해보세요</p>
      </div>
    </div>
  </>,
  <>
    <img src={carouselImage2} alt="" />
    <div className="text-container">
      <div className="title">
        <p>그린메이트들의</p>
        <p>생생한 채식 정보들이</p>
        <p>있으니까</p>
      </div>
      <div className="sub-title">
        <p>채식 일상부터</p>
        <p>식당, 제품 리뷰와 채식 레시피까지</p>
        <p>모든 정보를 지금 바로 확인해보세요</p>
      </div>
    </div>
  </>,
  <>
    <img src={carouselImage3} alt="" />
    <div className="text-container">
      <div className="title">
        <p>함께 채식을 실천하는</p>
        <p>그린메이트가 있으니까</p>
      </div>
      <div className="sub-title">
        <p>누구나 열고 참여할 수 있는 채식모임</p>
        <p>마음 속에 저장한 식당을</p>
        <p>함께 할 그린메이트를 찾아보세요</p>
      </div>
    </div>
  </>,
  <>
    <img src={carouselImage4} alt="" />
    <div className="text-container">
      <div className="title">
        <p>지속 가능한 채식 생활을 위한</p>
        <p>우리들의 식사공간,</p>
        <p className="strong">그린메이트</p>
      </div>
      <BottomContainer>
        <a href={KAKAO_URL}>
          <div className="kakao-button">
            <p>카카오로 시작하기</p>
          </div>
        </a>
      </BottomContainer>
    </div>
  </>,
];
function Intro() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
  };
  return (
    <Container>
      <Slider {...settings} dotsClass="slider-dots">
        {sliderItems.map(item => (
          <div key={item}>
            <SliderItem>{item}</SliderItem>
          </div>
        ))}
      </Slider>
    </Container>
  );
}

export default Intro;
