import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  input {
    border: none;
    border-bottom: 1px solid black;
    margin: 0 1rem;
    height: 30px;
    margin-bottom: 1.5rem;
    :focus {
      outline: none;
    }
  }
  textarea {
    border: none;
    margin: 0 1rem;
    padding: 1rem;
    background-color: #f2f2f2;
    border-radius: 5px;
    height: 40vh;
    resize: none;
    :focus {
      outline: none;
    }
  }
`;
const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1rem 0;
  border-top: 1px solid #f2f2f2;

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
function SettingNewRestau() {
  return (
    <>
      <Container>
        <input placeholder="식당명" />
        <input placeholder="주소" />
        <textarea placeholder="메뉴정보 및 상세내용" />
      </Container>
      <ButtonContainer>
        <button type="button" className="cancel-btn">
          취소
        </button>
        <button type="button" className="delete-btn">
          등록요청
        </button>
      </ButtonContainer>
    </>
  );
}

export default SettingNewRestau;
