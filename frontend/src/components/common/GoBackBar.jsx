import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';

const Bar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 52px;
  background-color: white;
  z-index: 3;

  svg {
    position: absolute;
    top: 8.5px;
    left: 0;
    cursor: pointer;
  }

  p {
    width: 100%;
    word-break: keep-all;
    font-size: 1.25rem;
    text-align: center;
  }

  div {
    margin-left: auto;
  }

  @media screen and (min-width: 1025px) {
    top: 60px;
    left: 130px;
    width: calc(100% - 130px);
  }
`;

function GoBackBar({ title, children, handleOnClick }) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const onClickHander = handleOnClick || goBack;

  return (
    <Bar className="go-back-bar">
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
