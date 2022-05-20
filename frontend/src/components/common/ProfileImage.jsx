import styled from 'styled-components';
import PropTypes from 'prop-types';
import vegan from '../../assets/vegan-icon.png';
import lacto from '../../assets/lacto-icon.png';
import ovo from '../../assets/ovo-icon.png';
import lactoOvo from '../../assets/lacto-ovo-icon.png';
import pesco from '../../assets/pesco-icon.png';
import polo from '../../assets/polo-icon.png';
import flexi from '../../assets/flexi-icon.png';

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => (props.isBig ? '4rem' : '2.8rem')};
  height: ${props => (props.isBig ? '4rem' : '2.8rem')};
  border-radius: 50%;
  background-color: #f2f2f2;
  margin: 0 0.5rem;

  img {
    display: block;
    width: 85%;
    height: 85%;
    object-fit: contain;
  }
`;

const vegeTypeList = [vegan, lacto, ovo, lactoOvo, pesco, polo, flexi];

function ProfileImage({ vegeType, isBig }) {
  return (
    <ImgContainer isBig={isBig} className="profile-img">
      <img src={vegeTypeList[vegeType]} alt="사용자의 채식 타입" />
    </ImgContainer>
  );
}

ProfileImage.propTypes = {
  vegeType: PropTypes.number,
  isBig: PropTypes.bool.isRequired,
};

ProfileImage.defaultProps = {
  vegeType: null,
};

export default ProfileImage;
