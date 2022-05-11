import { useState } from 'react';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import ProfileImage from '../common/ProfileImage';
import SettingCenteredModalBase from './SettingCenteredModalBase';
import { userInfoAtom } from '../../atoms/accounts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ModifyProfile = styled.div`
  position: relative;
  padding: 3rem 0;
`;
const StyledEditIcon = styled(EditIcon)`
  position: absolute;
  right: 2%;
  top: 58%;
  border-radius: 50%;
  background-color: #f2f2f2;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.1));
  padding: 3px;
`;

const ModifyNickName = styled.div`
  input {
    border: none;
    border-bottom: 1px solid black;
    margin: 0 1rem;
    height: 30px;
    :focus {
      outline: none;
    }
  }
  button {
    border: 1px solid #fcb448;
    border-radius: 5px;
    color: #fcb448;
    font-weight: 600;
    padding: 0.3rem 1rem;
    background-color: white;
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
function SettingUserInfo() {
  const [userInfo] = useAtom(userInfoAtom);
  const nowVegeType = userInfo.vege_type;
  const [newVegeType, setVegeType] = useState(nowVegeType);
  const isBig = true;
  return (
    <>
      <Container>
        <ModifyProfile
          onClick={() => document.querySelector('#dialog').showModal()}
        >
          <ProfileImage vegeType={newVegeType} isBig={isBig} />
          <StyledEditIcon />
        </ModifyProfile>
        <ModifyNickName>
          <input defaultValue={userInfo.nickname || ''} />
          <button type="button">중복 확인</button>
        </ModifyNickName>
        <SettingCenteredModalBase
          vegeType={newVegeType}
          mainAction={setVegeType}
        />
      </Container>
      <ButtonContainer>
        <button type="button" className="delete-btn">
          수정
        </button>
        <button type="button" className="cancel-btn">
          취소
        </button>
      </ButtonContainer>
    </>
  );
}

export default SettingUserInfo;
