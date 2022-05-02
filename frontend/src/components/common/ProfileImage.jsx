import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const ProfileImg = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  background-color: #c4c4c4;
  margin: 0 1rem;

  ${props =>
    props.isBig &&
    css`
      width: 4rem;
      height: 4rem;
    `}
`;

function ProfileImage({ isBig }) {
  return <ProfileImg isBig={isBig} className="profile-img" />;
}

ProfileImage.propTypes = {
  isBig: PropTypes.bool.isRequired,
};

export default ProfileImage;
