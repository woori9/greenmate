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
  justify-content: space-between;

  p {
    font-size: 1.25rem;
  }
`;

function GoBackBar({ title, children, handleOnClick }) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const onClickHander = handleOnClick || goBack;

  return (
    <Bar>
      <ChevronLeftIcon
        sx={{ width: '35px', height: '35px' }}
        onClick={onClickHander}
      />
      <p>{title}</p>
      {children}
    </Bar>
  );
}

GoBackBar.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  handleOnClick: PropTypes.func,
};

GoBackBar.defaultProps = {
  handleOnClick: undefined,
};

export default GoBackBar;
