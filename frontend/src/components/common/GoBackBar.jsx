import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';

const Bar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 52px;
  background-color: white;
  z-index: 3;

  p {
    font-size: 1.25rem;
    text-align: center;
  }

  div {
    margin-left: auto;
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
      <div>{children}</div>
    </Bar>
  );
}

GoBackBar.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  handleOnClick: PropTypes.func,
};

GoBackBar.defaultProps = {
  handleOnClick: undefined,
};

export default GoBackBar;
