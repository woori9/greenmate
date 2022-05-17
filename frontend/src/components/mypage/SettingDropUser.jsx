import { useNavigate } from 'react-router-dom';
// import { useAtom } from 'jotai';
import styled from 'styled-components';
import { apiDeleteUser } from '../../api/accounts';
// import { userInfoAtom } from '../../atoms/accounts';

const Container = styled.div`
  padding: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 55vh;
  .title {
    font-size: 20px;
    font-weight: 400;
  }
  .sub-title {
    color: #f9795d;
    padding-top: 1.5rem;
    padding-bottom: 2rem;
  }
  ul {
    padding: 2rem;
  }
  li {
    padding: 0.5rem 0;
  }
`;
const Button = styled.div`
  color: white;
  background-color: #f9795d;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 2.5rem;
  margin-top: 2rem;
  cursor: pointer;
`;

function SettingDropUser() {
  const navigate = useNavigate();
  // const [userInfo] = useAtom(userInfoAtom);
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
      <Button
        type="button"
        onClick={() =>
          apiDeleteUser(
            () => {
              sessionStorage.clear();
              navigate('/intro');
            },
            () => alert('진행 중인 모임이 있어 회원탈퇴가 불가합니다'),
          )
        }
      >
        탈퇴하기
      </Button>
    </Container>
  );
}

export default SettingDropUser;
