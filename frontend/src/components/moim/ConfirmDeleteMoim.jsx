import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { onDismissAtom } from '../../atoms/bottomSheet';
import { exitMoim } from '../../api/moim';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .content-text {
    font-size: 1.1rem;
    margin: 1.5rem 0;
  }

  button {
    width: 18rem;
    height: 2.8rem;
    font-size: 1rem;
    border: none;
    border-radius: 10px;
    margin-bottom: 0.5rem;

    &.delete-btn {
      color: #fff;
      background-color: #fcb448;
    }

    &.cancel-btn {
      color: #000;
      background-color: #f2f2f2;
    }
  }
`;

function ConfirmDeleteMoim({ mateId }) {
  const [, onDismiss] = useAtom(onDismissAtom);
  const navigate = useNavigate();

  return (
    <Container>
      <p className="content-text">정말 삭제하시겠습니까?</p>
      <button
        type="button"
        className="delete-btn"
        onClick={() =>
          exitMoim(mateId)
            .then(() => {
              navigate('/');
              onDismiss();
            })
            .catch(err => console.log(err))
        }
      >
        삭제
      </button>
      <button type="button" className="cancel-btn" onClick={() => onDismiss()}>
        취소
      </button>
    </Container>
  );
}

ConfirmDeleteMoim.propTypes = {
  mateId: PropTypes.number.isRequired,
};

export default ConfirmDeleteMoim;
