import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { onDismissAtom } from '../../atoms/bottomSheet';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;

  .content-text {
    font-size: 1.1rem;
    margin: 1.5rem 0;
  }

  button {
    width: 80%;
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

function ConfirmLogout() {
  const navigate = useNavigate();
  const [, onDismiss] = useAtom(onDismissAtom);
  return (
    <Container>
      <p className="content-text">정말 로그아웃하시겠습니까?</p>
      <button
        type="button"
        className="delete-btn"
        onClick={() => {
          sessionStorage.clear();
          onDismiss();
          navigate('/intro');
        }}
      >
        로그아웃
      </button>
      <button type="button" className="cancel-btn" onClick={() => onDismiss()}>
        취소
      </button>
    </Container>
  );
}

export default ConfirmLogout;
