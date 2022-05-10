/* eslint-disable react/jsx-props-no-spreading */
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Container = styled.div`
  width: 100%;

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
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 9rem;
  border-radius: 20px;
  background-color: #ffc774;

  &.item-two {
    background-color: #ffc4a3;
  }

  &.item-three {
    background-color: #ffaa7a;
  }

  &.item-four {
    background-color: #ffd493;
  }

  p {
    font-size: 1.1rem;
    font-weight: 600;
    margin-left: 0.5rem;
  }

  @media screen and (min-width: 1025px) {
    height: 17rem;

    p {
      font-size: 2rem;
    }
  }
`;

function HomeCarousel() {
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
        <div>
          <SliderItem>
            <p>그린메이트에서</p>
            <p>채식을 함께할 친구를 찾아보세요!</p>
          </SliderItem>
        </div>
        <div>
          <SliderItem className="item-two">
            <p>지속 가능한 채식,</p>
            <p>그린메이트와 함께</p>
          </SliderItem>
        </div>
        <div>
          <SliderItem className="item-three">
            <p>그린메이트에서</p>
            <p>채식을 함께할 친구를 찾아보세요!</p>
          </SliderItem>
        </div>
        <div>
          <SliderItem className="item-four">
            <p>그린메이트에서</p>
            <p>채식을 함께할 친구를 찾아보세요!</p>
          </SliderItem>
        </div>
      </Slider>
    </Container>
  );
}

export default HomeCarousel;
