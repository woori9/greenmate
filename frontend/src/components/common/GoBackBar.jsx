import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';

const Bar = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 52px;
  background-color: white;
  z-index: 3;

  p {
    align-self: center;
    font-size: 1.25rem;
  }
`;

function GoBackBar({ title, children }) {
  const navigate = useNavigate();

  return (
    <Bar>
      <ChevronLeftIcon
        sx={{ width: '35px', height: '35px' }}
        onClick={() => navigate(-1)}
      />
      <p>{title}</p>
      {children}
    </Bar>
  );
}

GoBackBar.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
};

export default GoBackBar;
