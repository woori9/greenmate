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
  const [evaluation, setEvaluation] = useState([]);
  const { userPk } = useParams();
  console.log(evaluation);
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
        <p>평가</p>
      </Container>
    </>
  );
}

export default MyPageEvaluation;
