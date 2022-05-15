import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { userInfoAtom } from '../atoms/accounts';
import { apiCheckNickname, apiPutUserInfo } from '../api/accounts';
import { signInFirebase } from '../service/chat_service';
import veganIcon from '../assets/vegan-icon.png';
import lactoIcon from '../assets/lacto-icon.png';
import ovoIcon from '../assets/ovo-icon.png';
import lactoOvoUcon from '../assets/lacto-ovo-icon.png';
import pescoIcon from '../assets/pesco-icon.png';
import poloIcon from '../assets/polo-icon.png';
import flexiIcon from '../assets/flexi-icon.png';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
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
  padding: 2rem 1rem;
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
  padding: 5rem 0;
  span {
    color: white;
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
`;
const VegeTypeBox = styled.div`
  filter: ${props => (props.selected ? 'grayscale(100%)' : null)};
  width: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img-box {
    height: 4.5rem;
    .vege-img {
      width: 100%;
    }
  }
  p {
    font-size: 0.65rem;
    color: ${props => (props.selected ? '#fcb448' : 'black')};
  }
  cursor: pointer;
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
    ${Page} {
      display: block;
    }
  }
`;
const DescriptionVegeTypeContainer = styled.div`
  display: flex;
  justify-content: start;
  p {
    font-size: 10px;
  }
`;
const DescriptionVegeTypeTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 3rem;
  padding-bottom: 0.3rem;
  margin-right: 1rem;
  img {
    width: 60%;
  }
  p {
    color: black;
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
  const [userInfo] = useAtom(userInfoAtom);
  const [newSentence, setNewSentence] = useState('');
  const [newNickname, setNewNickname] = useState(userInfo.nickname);
  const [nicknameStatus, SetNicknameStatus] = useState(false);
  const [newVegeType, setVegeType] = useState(null);

  const vegeTypeLst = [
    {
      id: 0,
      title: '비건',
      sentence: '비건',
      icon: veganIcon,
      rule: '식물식',
    },
    {
      id: 1,
      title: '락토',
      sentence: '락토',
      icon: lactoIcon,
      rule: '채식 + 우유 + 유제품',
    },
    {
      id: 2,
      title: '오보',
      sentence: '오보',
      icon: ovoIcon,
      rule: '채식 + 난류',
    },
    {
      id: 3,
      title: '락토오보',
      sentence: '락토오보',
      icon: lactoOvoUcon,
      rule: '채식 + 우유 + 유제품 + 난류',
    },
    {
      id: 4,
      title: '페스코',
      sentence: '페스코',
      icon: pescoIcon,
      rule: '채식 + 우유 + 유제품 + 난류 + 바다동물',
    },
    {
      id: 5,
      title: '폴로',
      sentence: '폴로',
      icon: poloIcon,
      rule: '채식 + 우유 + 유제품 + 난류 + 바다동물 + 가금류',
    },
    {
      id: 6,
      title: '관심있어요',
      sentence: '',
      icon: flexiIcon,
      rule: '채식 + 우유 + 유제품',
    },
  ];
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
        <p>
          <span>{newSentence} </span>
          채식 지향을
        </p>
        <p>응원합니다</p>
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
            <p>채식 타입 안내</p>
            <ChevronRightIcon />
            <Page className="descript-page">
              {vegeTypeLst.map(type => {
                return (
                  <DescriptionVegeTypeContainer key={type.title}>
                    <DescriptionVegeTypeTitle>
                      <img src={type.icon} alt={type.id} />
                      <p>{type.title}</p>
                    </DescriptionVegeTypeTitle>
                    <p>{type.rule}</p>
                  </DescriptionVegeTypeContainer>
                );
              })}
            </Page>
          </Description>
          <VegeTypeLst>
            {vegeTypeLst.map(type => (
              <VegeTypeBox
                selected={newVegeType === type.id}
                key={type.vegeType}
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
              () => navigate('/'),
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
