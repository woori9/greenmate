import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VegeTypeInform from '../components/common/VegeTypeInform';
import { userInfoAtom } from '../atoms/accounts';
import { apiCheckNickname, apiPutUserInfo } from '../api/accounts';
import { signInFirebase } from '../service/chat_service';
import vegeTypeList from '../utils/vegeTypeList';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @media screen and (min-width: 1025px) {
    flex-direction: row;
    justify-content: center;
  }
  background-color: #fcb448;
`;
const SignupContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 33rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  background-color: white;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
  .title {
    font-weight: 700;
  }
`;
const TextContainer = styled.div`
  width: 90%;
  max-width: 33rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  line-height: 150%;
  span {
    color: white;
  }
  img {
    padding: 1rem;
    width: 7rem;
    height: 7rem;
  }
`;
const NicknameContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .input-box {
    display: flex;
    flex-direction: column;
    width: 70%;
    input {
      height: 30px;
      border: none;
      border-bottom: 1px solid black;
      :focus {
        outline: none;
      }
    }
    p {
      padding: 5px 0;
      font-size: 13px;
    }
  }
`;
const VegeTypeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem 0;
`;
const VegeTypeLst = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
`;
const VegeTypeBox = styled.div`
  width: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .img-box {
    width: 2.2rem;
    height: 2.2rem;
    border: ${props => props.selected && '3px solid #fcb448'};
    border-radius: ${props => props.selected && '50%'};

    .vege-img {
      width: 100%;
    }
  }

  p {
    font-size: 0.7rem;
    white-space: nowrap;
    color: ${props => (props.selected ? '#fcb448' : 'black')};
  }

  @media screen and (min-width: 1025px) {
    .img-box {
      width: 4rem;
      height: 4rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;
const Page = styled.div`
  position: fixed;
  bottom: 10%;
  right: 11%;
  padding: 1rem;
  z-index: 6;
  background-color: #fff;
  border-radius: 10px;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;
const Description = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  color: #a9a9a9;
  p {
    margin: auto 0;
    font-size: 13px;
  }
  .descript-page {
    display: none;
  }
  :hover {
    cursor: pointer;
    .info-txt {
      color: #fcb448;
    }
    ${Page} {
      display: block;
    }
  }
`;

const Button = styled.button`
  position: absolute;
  bottom: 1rem;
  width: 90%;
  height: 2.8rem;
  color: ${props => (props.disabled ? '#a9a9a9' : '#fff')};
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background-color: ${props => (props.disabled ? '#f2f2f2' : '#fcb448')};
  cursor: ${props => (props.disabled ? 'null' : 'pointer')};
`;

function Signup() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [newSentence, setNewSentence] = useState('오늘 시작한');
  const [newNickname, setNewNickname] = useState(userInfo.nickname);
  const [nicknameStatus, SetNicknameStatus] = useState(false);
  const [newVegeType, setVegeType] = useState(null);

  function checkNickname(putNickname) {
    if (putNickname === '') {
      SetNicknameStatus(false);
      setNewNickname('');
      return;
    }
    apiCheckNickname(
      { nickname: putNickname },
      () => {
        SetNicknameStatus(true);
        setNewNickname(putNickname);
      },
      () => {
        SetNicknameStatus(false);
      },
    );
  }
  useEffect(() => {
    checkNickname(newNickname);
  }, []);
  return (
    <Container>
      <TextContainer>
        {newVegeType === null ? (
          <img src={vegeTypeList[6].icon} alt="lacto" />
        ) : (
          <img src={vegeTypeList[newVegeType].icon} alt="lacto" />
        )}
        <p>
          <span>{newSentence} </span>
          채식지향자도
        </p>
        <p>그린메이트</p>
      </TextContainer>
      <SignupContainer>
        <NicknameContainer>
          <p className="title">닉네임</p>
          <div className="input-box">
            <input
              value={newNickname}
              onChange={event => {
                checkNickname(event.target.value.trim());
              }}
            />
            {nicknameStatus ? (
              <p style={{ color: '#92c769' }}>사용 가능한 닉네임입니다</p>
            ) : (
              <p style={{ color: '#f9795d' }}>
                사용중이거나 잘못된 닉네임입니다
              </p>
            )}
          </div>
        </NicknameContainer>
        <VegeTypeContainer>
          <p className="title">채식 타입을 선택해주세요</p>
          <Description>
            <p className="info-txt">채식 타입 안내</p>
            <ChevronRightIcon />
            <Page className="descript-page">
              <VegeTypeInform />
            </Page>
          </Description>
          <VegeTypeLst>
            {vegeTypeList.map(type => (
              <VegeTypeBox
                key={type.id}
                selected={newVegeType === type.id}
                onClick={() => {
                  setNewSentence(type.sentence);
                  setVegeType(type.id);
                }}
              >
                <div className="img-box">
                  <img className="vege-img" src={type.icon} alt="vege-img" />
                </div>
                <p>{type.title}</p>
              </VegeTypeBox>
            ))}
          </VegeTypeLst>
        </VegeTypeContainer>
        <Button
          type="button"
          disabled={!nicknameStatus || newVegeType === null}
          onClick={() => {
            apiPutUserInfo(
              {
                nickname: newNickname,
                vege_type: newVegeType,
              },
              res => {
                setUserInfo({ ...userInfo, ...res.data });
                navigate('/');
              },
            );
            signInFirebase({
              id: `${userInfo.id}`,
              nickname: newNickname,
              vegeType: newVegeType,
            });
          }}
        >
          그린메이트 시작하기
        </Button>
      </SignupContainer>
    </Container>
  );
}

export default Signup;
