import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid red;
  padding: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

function SettingDropUser() {
  return (
    <Container>
      <p className="title">회원 탈퇴</p>
      <p className="sub-title">탈퇴하기 전 반드시 확인해주세요</p>
      <ul>
        <li>회원 탈퇴 시 계정 정보는 복구 불가능합니다.</li>
        <li>
          재가입 제한은 없으나, 재가입 계정에서 이전 계정에서의 정보는 확인할 수
          없습니다.
        </li>
      </ul>
      <button type="button">탈퇴하기</button>
    </Container>
  );
}

export default SettingDropUser;
