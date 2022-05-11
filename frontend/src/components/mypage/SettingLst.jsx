import PropTypes from 'prop-types';
import styled from 'styled-components';

const Ul = styled.ul`
  list-style: none;
  padding: 1rem 0;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
`;
const Li = styled.li`
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
`;
const LastLi = styled.li`
  padding: 0.8rem 1.5rem;
  cursor: pointer;
`;
const Div = styled.div`
  text-align: end;
  padding-top: 0.5rem;
  display: flex;
  justify-content: end;
`;
const P = styled.p`
  color: #a9a9a9;
  font-size: 12px;
  cursor: pointer;
`;

function SettingLst({ setPageStatus }) {
  return (
    <>
      <Ul>
        <Li onClick={() => setPageStatus('setNickname')}>내 정보</Li>
        <Li onClick={() => setPageStatus('setLanguage')}>언어설정</Li>
        <Li onClick={() => setPageStatus('registerNewRestau')}>식당등록요청</Li>
        <LastLi>로그아웃</LastLi>
      </Ul>
      <Div>
        <P onClick={() => setPageStatus('deleteUser')}>탈퇴하기</P>
      </Div>
    </>
  );
}

SettingLst.propTypes = {
  setPageStatus: PropTypes.func.isRequired,
};
export default SettingLst;
