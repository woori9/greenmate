import styled from 'styled-components';
import Rating from '@mui/material/Rating';
import PropTypes from 'prop-types';

const StarContainer = styled.div`
  label {
    width: 3rem !important;
  }

  svg {
    width: 30px !important;
    height: 30px !important;
  }
`;

function RatingForm({ rating, setRating }) {
  return (
    <StarContainer>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
    </StarContainer>
  );
}

RatingForm.propTypes = {
  rating: PropTypes.number,
  setRating: PropTypes.func.isRequired,
};

RatingForm.defaultProps = {
  rating: 0,
};

export default RatingForm;
