/* eslint-disable react/jsx-props-no-spreading */
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import carouselImage1 from '../../assets/carousel-img1.png';
import carouselImage2 from '../../assets/carousel-img2.png';
import carouselImage3 from '../../assets/carousel-img3.png';
import carouselImage4 from '../../assets/carousel-img4.png';
import useUserInfo from '../../hooks/useUserInfo';

const Container = styled.div`
  width: 100%;

  // 슬라이드별 배경
  .slick-slide:nth-child(2) {
    .item {
      background-color: #ffc774;
    }
  }

  .slick-slide:nth-child(3) {
    .item {
      background-color: #ffea9f;
    }
  }

  .slick-slide:nth-child(4) {
    .item {
      background-color: #ffbf9b;
    }
  }

  .slick-slide:nth-child(5) {
    .item {
      background-color: #ffd493;
    }
  }

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
    color: #ffffff;
  }
`;

const SliderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10rem;
  border-radius: 20px;

  .text-container {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    word-break: keep-all;

    p {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  img {
    width: auto;
    height: 85%;
    margin-right: 0.5rem;
  }

  @media screen and (min-width: 1025px) {
    height: 17rem;

    .text-container {
      margin-left: 2rem;

      p {
        font-size: 2.5rem;
      }
    }

    img {
      height: 90%;
      margin-right: 2rem;
    }
  }
`;

const sliderItems = [
  <div className="text-container">
    <p>그린메이트에서</p>
    <p>채식을 함께할 친구를 찾아보세요!</p>
  </div>,
  <div className="text-container">
    <p>나의 채식메이트</p>
    <p>그린메이트에 있어요.</p>
  </div>,
  <div className="text-container">
    <p>지속 가능한 채식,</p>
    <p>그린메이트와 함께</p>
  </div>,
  <div className="text-container">
    <p>채식은</p>
    <p>함께할수록 좋으니까</p>
  </div>,
];

const sliderItemsEng = [
  <div className="text-container">
    <p>Find a friend to share a vegetarian diet with</p>
    <p>at Greenmate!</p>
  </div>,
  <div className="text-container">
    <p>My vegan mates?</p>
    <p>They&apos;re at Greenmate</p>
  </div>,
  <div className="text-container">
    <p>Sustainable vegetarianism,</p>
    <p>with Greenmate</p>
  </div>,
  <div className="text-container">
    <p>It&apos;s better to eat vegetables</p>
    <p>together!</p>
  </div>,
];

const sliderImages = [
  <img src={carouselImage1} alt="춤추는 사람들" />,
  <img src={carouselImage2} alt="손을 잡고 있는 사람들" />,
  <img src={carouselImage3} alt="음료를 마시며 쉬고 있는 사람" />,
  <img src={carouselImage4} alt="음료를 마시며 대화하는 사람들" />,
];

function HomeCarousel() {
  const userInfo = useUserInfo();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
  };

  return (
    <Container>
      <Slider {...settings} dotsClass="slider-dots">
        {(userInfo.language === 0 ? sliderItems : sliderItemsEng).map(
          (item, index) => (
            <div key={item}>
              <SliderItem className="item">
                {item}
                {sliderImages[index]}
              </SliderItem>
            </div>
          ),
        )}
      </Slider>
    </Container>
  );
}

export default HomeCarousel;
