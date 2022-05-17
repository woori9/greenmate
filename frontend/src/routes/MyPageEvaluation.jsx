import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import GoBackBar from '../components/common/GoBackBar';
import { getEvaluationLst } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';
import EvalueImg1 from '../assets/evalue-img1.png';
import EvalueImg2 from '../assets/evalue-img2.png';
import EvalueImg3 from '../assets/evalue-img3.png';

const Container = styled.div`
  margin: 62px 1rem 5rem 1rem;
  padding: 0 1rem;
  @media screen and (min-width: 1025px) {
    margin: 0 2rem 0 34rem;
    border: 1px solid #f2f2f2;
  }
`;
const TitleContainer = styled.div`
  padding: 1rem 0;
`;
const TitleHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #a9a9a9;
  img {
    width: 25px;
    height: 25px;
    margin-right: 1rem;
  }
`;
const EleContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  .count-box {
    display: flex;
    .count-num {
      padding-left: 1rem;
    }
  }
`;
const NoContent = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function MyPageEvaluation() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const evaluTable = {
    0: {
      title: '별로예요',
      icon: EvalueImg1,
      0: '이분과 다시는 식사하고 싶지 않아요',
      1: '약속 장소에 나타나지 않았어요',
      2: '대화가 어려웠어요',
      3: '응답이 느려요',
    },
    1: {
      title: '좋아요',
      icon: EvalueImg2,
      0: '시간 약속을 잘 지켜요',
      1: '친절하고 매너가 좋아요',
      2: '대화가 잘 통해요',
      3: '응답이 빨라요',
    },
    2: {
      title: '최고예요',
      icon: EvalueImg3,
      0: '시간 약속을 잘 지켜요',
      1: '친절하고 매너가 좋아요',
      2: '대화가 잘 통해요',
      3: '응답이 빨라요',
    },
  };
  const [evaluationLst, setEvaluationLst] = useState({});
  const { userPk } = useParams();
  useEffect(() => {
    getEvaluationLst(
      { userId: userPk },
      res => {
        setEvaluationLst(res.data);
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
        {evaluationLst.length ? (
          <>
            {Object.entries(evaluationLst).map(evaluationEle => {
              const idx = evaluationEle[0];
              const evalueStep = evaluTable[idx];
              const descriptionIdx = evaluationEle[1];
              return (
                <TitleContainer key={evaluationEle[0]}>
                  <TitleHeader>
                    <img src={evalueStep.icon} alt="evalue-img" />
                    <p>{evalueStep.title}</p>
                  </TitleHeader>
                  {Object.entries(descriptionIdx).map(ele => {
                    const desIdx = ele[0];
                    return (
                      <EleContent key={ele[0]}>
                        <p>{evaluTable[idx][desIdx]}</p>
                        <div className="count-box">
                          <PeopleAltOutlinedIcon />
                          <p className="count-num">{ele[1]}</p>
                        </div>
                      </EleContent>
                    );
                  })}
                </TitleContainer>
              );
            })}
          </>
        ) : (
          <NoContent>
            <p>받은 평가가 없습니다</p>
          </NoContent>
        )}
      </Container>
    </>
  );
}

export default MyPageEvaluation;
