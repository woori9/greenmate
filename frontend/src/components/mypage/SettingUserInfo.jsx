import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import ProfileImage from '../common/ProfileImage';
import SettingCenteredModalBase from './SettingCenteredModalBase';
import { userInfoAtom } from '../../atoms/accounts';
import { apiCheckNickname, apiPutUserInfo } from '../../api/accounts';
import { updateUserInfo } from '../../service/chat_service';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ModifyProfile = styled.div`
  position: relative;
  padding: 3rem 0;
  cursor: pointer;
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
    width: 13rem;
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
    cursor: pointer;
  }
`;
const ButtonContainer = styled.div`
  position: fixed;
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

function SettingUserInfo({ setPageStatus, isDesktop }) {
  const isBig = true;
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const { language } = userInfo;
  const nowNickname = userInfo.nickname;
  const [newNickname, setNewNickname] = useState(nowNickname);
  const nowVegeType = userInfo.vege_type;
  const [newVegeType, setVegeType] = useState(nowVegeType);

  function checkNickname(putNickname) {
    if (putNickname === '') {
      setNewNickname(null);
      alert('입력한 닉네임을 확인해주세요');
      return;
    }
    apiCheckNickname(
      { nickname: putNickname },
      () => {
        alert('사용 가능한 닉네임입니다');
        setNewNickname(putNickname);
      },
      () => {
        alert('이미 사용중인 닉네임입니다');
      },
    );
  }
  function putUserInfo(putNickname, putVegeType) {
    apiCheckNickname(
      { nickname: putNickname },
      () => {
        apiPutUserInfo(
          {
            nickname: putNickname,
            vege_type: putVegeType,
          },
          res => {
            setPageStatus('settingLst');
            setUserInfo({ ...userInfo, ...res.data });
          },
          () => {
            alert('수정이 불가능합니다');
          },
        );
      },
      () => {
        alert('이미 사용중인 닉네임입니다');
      },
    );
  }
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
          <input
            className="inputNickname"
            defaultValue={userInfo.nickname || ''}
            onChange={event => setNewNickname(event.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              checkNickname(newNickname.trim());
            }}
          >
            {language === 0 ? '중복 확인' : 'check'}
          </button>
        </ModifyNickName>
        <SettingCenteredModalBase
          vegeType={newVegeType}
          mainAction={setVegeType}
          language={language}
        />
      </Container>
      {isDesktop ? (
        <DesktopBtn
          type="button"
          onClick={() => {
            putUserInfo(newNickname, newVegeType);
            updateUserInfo(`${userInfo.id}`, newNickname, newVegeType);
          }}
        >
          수정
        </DesktopBtn>
      ) : (
        <ButtonContainer>
          <button
            type="button"
            className="delete-btn"
            onClick={() => {
              putUserInfo(newNickname, newVegeType);
              updateUserInfo(`${userInfo.id}`, newNickname, newVegeType);
            }}
          >
            수정
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setPageStatus('settingLst')}
          >
            취소
          </button>
        </ButtonContainer>
      )}
    </>
  );
}
SettingUserInfo.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  setPageStatus: PropTypes.func.isRequired,
};
export default SettingUserInfo;
