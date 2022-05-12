/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';
import styled from 'styled-components';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { grey } from '@mui/material/colors';
// import StarIcon from '@mui/icons-material/Star';

const StarContainer = styled.div`
  StarBorderIcon {
    margin: 20px 10px 20px 0;
    opacity: 0.1;
    cursor: pointer;
    font-size: 50px;
  }

  .yellowStar {
    color: orange;
    opacity: 1;
  }
`;

function Rating() {
  const [hovered, setHovered] = useState(null);
  // const [clicked, setClicked] = useState(null);

  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map(el => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <StarBorderIcon
          sx={{ color: grey[300] }}
          fontSize="large"
          className={hovered >= el && 'yellowStar'}
          key={el}
          id={el}
          onMouseEnter={() => setHovered(el)}
          onMouseLeave={() => setHovered(null)}
          // onClick={() => setClicked(el)}
        />
      ))}
    </StarContainer>
  );
}

export default Rating;
