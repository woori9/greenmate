import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import GoBackBar from '../components/common/GoBackBar';
import { getEvaluationLst } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  border: 1px solid red;
  margin: ${props =>
    props.isDesktop ? '0 2rem 0 34rem' : '62px 1rem 5rem 1rem'};
`;

function MyPageEvaluation() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const evaluTable = [
    {
      0: {
        title: '이분과 다시는 식사하고 싶지 않아요',
      },
      1: {
        title: '약속 장소에 나타나지 않았어요',
      },
      2: {
        title: '대화가 어려웠어요',
      },
      3: {
        title: '응답이 느려요',
      },
    },
    {
      0: {
        title: '시간 약속을 잘 지켜요',
      },
      1: {
        title: '친절하고 매너가 좋아요',
      },
      2: {
        title: '대화가 잘 통해요',
      },
      3: {
        title: '응답이 빨라요',
      },
    },
    {
      0: {
        title: '시간 약속을 잘 지켜요',
      },
      1: {
        title: '친절하고 매너가 좋아요',
      },
      2: {
        title: '대화가 잘 통해요',
      },
      3: {
        title: '응답이 빨라요',
      },
    },
  ];
  const [evaluation, setEvaluation] = useState([]);
  const { userPk } = useParams();
  console.log(evaluation);
  console.log(evaluTable);
  useEffect(() => {
    getEvaluationLst(
      { userId: userPk },
      res => {
        setEvaluation(res.data);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  return (
    <>
      {width > 1024 ? (
        <>
          <ResponsiveNavbar />
          <ResponsiveProfile />
        </>
      ) : (
        <GoBackBar title="평가" />
      )}
      <Container isDesktop={isDesktop}>
        <ul>
          <p>d</p>
        </ul>
      </Container>
    </>
  );
}

export default MyPageEvaluation;
