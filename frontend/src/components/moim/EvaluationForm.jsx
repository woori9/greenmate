// import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useAtom } from 'jotai';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { evaluationAtom } from '../../atoms/moim';

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 1rem 0;
`;

const ScoreButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 3.7rem;
    height: 3.7rem;
    color: ${props => (props.isSelected ? '#F5BD68' : '#a9a9a9')};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 1.5rem;
  }
`;

const scoreList = [
  { text: '별로에요', icon: <SentimentDissatisfiedIcon /> },
  { text: '좋아요', icon: <SentimentSatisfiedIcon /> },
  { text: '최고에요', icon: <SentimentVerySatisfiedIcon /> },
];

const badEvaluationList = [
  '이 분과 다시는 식사하고 싶지 않아요.',
  '약속 장소에 나타나지 않았어요.',
  '대화가 어려웠어요.',
  '응답이 느려요',
];

const goodEvaluationList = [
  '시간 약속을 잘 지켜요.',
  '친절하고 매너가 좋아요.',
  '대화가 잘 통해요.',
  '응답이 빨라요.',
];

function EvaluationForm({ selectedMateId, selectedMateNickname }) {
  const [evaluation, setEvaluation] = useAtom(evaluationAtom);

  const user = evaluation.find(mate => mate.mate === selectedMateId);
  const index = evaluation.findIndex(mate => mate.mate === selectedMateId);

  function handleScoreChange(value) {
    // 현재 유저의 데이터가 있는 경우
    if (index !== -1) {
      const newEval = [...evaluation];
      newEval[index].score = value;
      setEvaluation(newEval);
      // 현재 유저의 데이터가 없는 경우
    } else {
      const newData = {
        mate: selectedMateId,
        score: value,
      };
      setEvaluation(prev => [...prev, newData]);
    }
  }

  function getScore(value) {
    if (user) {
      return user.score === value;
    }
    return false;
  }

  function handleCheckChange(e) {
    const value = Number(e.target.value);
    // 현재 유저의 데이터가 있는 경우
    if (index !== -1) {
      const newEval = [...evaluation];
      // 현재 유저의 evaluation 데이터가 있는 경우
      if (newEval[index].evaluation) {
        // 이미 체크되어 있는 경우
        if (newEval[index].evaluation.includes(value)) {
          newEval[index].evaluation.splice(
            newEval[index].evaluation.indexOf(value),
            1,
          );
        } else {
          // 아직 체크되어 있지 않은 경우
          newEval[index].evaluation.push(value);
        }
      } else {
        // 현재 유저의 evaluation 데이터가 없는 경우
        newEval[index].evaluation = [value];
      }
      setEvaluation(newEval);
      // 현재 유저의 데이터가 없는 경우
    } else {
      const newData = {
        mate: selectedMateId,
        evaluation: [value],
      };
      setEvaluation(prev => [...prev, newData]);
    }
  }

  function getChecked(value) {
    if (user && user.evaluation) {
      return user.evaluation.includes(value);
    }
    return false;
  }

  return (
    <>
      <p>{selectedMateNickname} 님에 대해 솔직한 이야기를 들려주세요.</p>
      <form>
        <ScoreContainer>
          {scoreList.map((scoreItem, idx) => (
            <ScoreButton
              type="button"
              key={scoreItem.text}
              isSelected={getScore(idx)}
              onClick={() => handleScoreChange(idx)}
            >
              {scoreItem.icon}
              <p>{scoreItem.text}</p>
            </ScoreButton>
          ))}
        </ScoreContainer>
        <CheckboxContainer>
          {(evaluation[index] && evaluation[index].score === 0
            ? badEvaluationList
            : goodEvaluationList
          ).map((evaluationItem, idx) => (
            <FormControlLabel
              control={
                <Checkbox
                  type="checkbox"
                  name="evaluation"
                  label={evaluationItem}
                  value={idx + 1}
                  onChange={e => handleCheckChange(e)}
                  checked={getChecked(idx + 1)}
                  sx={{
                    color: '#a9a9a9',
                    '&.Mui-checked': {
                      color: '#f5bd68',
                    },
                  }}
                />
              }
              label={evaluationItem}
              key={evaluationItem}
            />
          ))}
        </CheckboxContainer>
      </form>
    </>
  );
}

EvaluationForm.propTypes = {
  selectedMateId: PropTypes.number.isRequired,
  selectedMateNickname: PropTypes.string.isRequired,
};

export default EvaluationForm;
