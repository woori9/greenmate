/* eslint-disable react/jsx-props-no-spreading */
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PropTypes from 'prop-types';

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
`;

function ImgCarousel({ props }) {
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
        {props.map(img => {
          // console.log(img);
          return (
            <div key={img.img_path}>
              <SliderItem>
                <img height="300" src={img.img_path} alt="사진" />
              </SliderItem>
            </div>
          );
        })}
      </Slider>
    </Container>
  );
}
ImgCarousel.propTypes = {
  props: PropTypes.arrayOf(PropTypes.shape({ img_path: PropTypes.string })),
}.isRequired;
export default ImgCarousel;
