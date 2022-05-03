import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';

const FloatButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 1rem;
  bottom: 5rem;
  color: #fcb448;
  background-color: #fff;
  border: 2px solid #fcb448;
  border-radius: 20px;
  padding: 0.5rem;
  cursor: pointer;

  ${props =>
    props.isForMoim &&
    css`
      color: #fff;
      background-color: #fcb448;
      border: none;
    `}
`;

function FloatingActionBtn({ isForMoim }) {
  const navigate = useNavigate();

  function navigateTo() {
    if (isForMoim) {
      navigate('/moim/form');
    }
    // TODO: else문으로 navigate(커뮤니티 글 작성) 추가
  }

  return (
    <FloatButton
      type="button"
      isForMoim={isForMoim}
      onClick={() => navigateTo()}
    >
      <AddIcon />
      {isForMoim ? '모임 열기' : '작성하기'}
    </FloatButton>
  );
}

FloatingActionBtn.propTypes = {
  isForMoim: PropTypes.bool.isRequired,
};

export default FloatingActionBtn;