import PropTypes from 'prop-types';
import styled from 'styled-components';
import { postReqNewRestau } from '../../api/mypage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
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
const DesktopBtn = styled.div`
  color: #fff;
  padding: 0.5rem;
  border: none;
  border-radius: 20px;
  background-color: #fcb448;
  width: 6rem;
  text-align: center;
  float: right;
  margin: 2rem 1rem;
  cursor: pointer;
`;
function SettingNewRestau({ isDesktop, setPageStatus }) {
  const handleSubmit = event => {
    event.preventDefault();
    const inputName = event.target[0].value;
    const inputAddress = event.target[1].value;
    const inputContent = event.target[2].value;
    postReqNewRestau(
      {
        name: inputName,
        address: inputAddress,
        content: inputContent,
      },
      () => {
        alert('식당 등록 요청이 완료되었습니다');
        setPageStatus('settingLst');
      },
      () => {
        alert('양식을 다시 한 번 확인해주세요');
      },
    );
  };
  return (
    <form id="fr" onSubmit={handleSubmit}>
      <Container>
        <input placeholder="식당명" />
        <input placeholder="주소" />
        <textarea placeholder="메뉴정보 및 상세내용" />
      </Container>
      {isDesktop ? (
        <DesktopBtn type="submit">등록요청</DesktopBtn>
      ) : (
        <ButtonContainer>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setPageStatus('settingLst')}
          >
            취소
          </button>
          <button type="submit" className="delete-btn">
            등록요청
          </button>
        </ButtonContainer>
      )}
    </form>
  );
}
SettingNewRestau.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  setPageStatus: PropTypes.func.isRequired,
};
export default SettingNewRestau;
