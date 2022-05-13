import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import EvaluationForm from '../components/moim/EvaluationForm';
import ProfileImage from '../components/common/ProfileImage';
import GoBackBar from '../components/common/GoBackBar';
import { evaluateMoim } from '../api/moim';
import { evaluationAtom } from '../atoms/moim';

const Container = styled.div`
  max-width: 500px;
  padding: 52px 1rem;
  margin: 0 auto;

  @media screen and (min-width: 1025px) {
    margin: 112px auto 0 auto;
    padding: 0 2rem;
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  top: 0.9rem;
  right: 2rem;
  color: ${props => (props.isActive ? '#f5bd68' : '#a9a9a9')};
  font-size: 1.15rem;
  background: none;
  border: none;
`;

const TextContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  margin: 2.5rem 0;

  p {
    font-size: 1.03rem;
  }
`;

const UserList = styled.ul`
  list-style: none;
  display: flex;
  padding-left: 0;
  overflow-x: auto;
`;

const UserListItem = styled.li`
  button {
    background: none;
    border: none;

    div {
      border: ${props => props.isSelected && '2px solid #f5bd68'};
      margin-bottom: 0.5rem;
    }

    p {
      font-weight: ${props => props.isSelected && '700'};
    }
  }
`;

const Hr = styled.hr`
  border: none;
  border-bottom: 1px solid #a9a9a9;
  margin: 1rem 0;
`;

function EvaluateMoim() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mateList } = location.state;
  const [selectedMate, setSelectedMate] = useState(mateList[1]);
  const [evaluationResult] = useAtom(evaluationAtom);

  function handleSubmit() {
    evaluateMoim(
      evaluationResult,
      () => navigate(-1),
      err => console.log(err),
    );
  }

  function checkIsValidData() {
    if (mateList.length - 1 === evaluationResult.length) {
      return evaluationResult.every(
        evalItem =>
          Object.keys(evalItem).length === 3 && evalItem.evaluation.length > 0,
      );
    }
    return false;
  }

  return (
    <Container>
      <GoBackBar title="">
        <SubmitButton
          type="button"
          disabled={!checkIsValidData()}
          isActive={checkIsValidData()}
          onClick={() => handleSubmit()}
        >
          완료
        </SubmitButton>
      </GoBackBar>
      <TextContainer>
        <p>이번 만남은 어떠셨나요?</p>
        <p>함께한 상대에 대한 의견을 들려주세요.</p>
      </TextContainer>
      <UserList>
        {mateList.slice(1).map(mate => (
          <UserListItem key={mate.id} isSelected={mate.id === selectedMate.id}>
            <button type="button" onClick={() => setSelectedMate(mate)}>
              <ProfileImage vegeType={mate.vegeType} isBig={false} />
              <p>{mate.nickname}</p>
            </button>
          </UserListItem>
        ))}
      </UserList>
      <Hr />
      <EvaluationForm
        selectedMateNickname={selectedMate.nickname}
        selectedMateId={selectedMate.id}
      />
    </Container>
  );
}

export default EvaluateMoim;
