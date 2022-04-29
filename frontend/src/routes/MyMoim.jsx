import styled from 'styled-components';
import { useAtom } from 'jotai';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import MoimCategory from '../components/moim/MoimCategory';
import MoimInfo from '../components/moim/MoimInfo';
import moim from '../atoms/moim';

const FloatButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 1rem;
  bottom: 5rem;
  color: #fff;
  background-color: #fcb448;
  border: none;
  border-radius: 20px;
  padding: 0.5rem;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 1rem 0.5rem;
`;

const CategoryDiv = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding-left: 0px;
`;

function MyMoim() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useAtom(moim);
  const moimCategories = ['대기', '참여', '진행', '완료'];

  const data = [
    {
      id: 1,
      restaurant: {
        restaurantId: 1,
        nameKr: '야채 식당',
        addressKr: '대전시 유성구 oo동',
      },
      author: 1,
      authorNickname: '김싸피',
      authorVegeType: '락토오보',
      title: '야채 식당 가실 분!',
      content: '이번주에 야채 식당 가실 분 구해요',
      time: new Date(),
      headCnt: 4,
      nowCnt: 2,
      status: 0,
      mates: [
        {
          userId: 2,
          userNickname: '이이이',
          vegeType: '락토',
          mateStatus: 1,
        },
      ],
    },
    {
      id: 2,
      restaurant: {
        restaurantId: 1,
        nameKr: '채소 식당',
        addressKr: '대전시 유성구 oo동',
      },
      author: 1,
      authorNickname: '김싸피',
      authorVegeType: '락토오보',
      title: '야채 식당 가실 분!',
      content: '이번주에 야채 식당 가실 분 구해요',
      time: new Date(),
      headCnt: 4,
      nowCnt: 2,
      status: 0,
      mates: [
        {
          userId: 2,
          userNickname: '빅빅빅',
          vegeType: '락토',
          mateStatus: 1,
        },
      ],
    },
  ];

  return (
    <>
      <ResponsiveNavbar />
      <FloatButton type="button" onClick={() => navigate('/moim/create')}>
        <AddIcon />
        모임 열기
      </FloatButton>
      <Title>그린메이트</Title>
      <CategoryDiv>
        {moimCategories.map((category, index) => (
          <MoimCategory
            name={category}
            index={index}
            isSelected={selectedCategory === index}
            setSelectedCategory={setSelectedCategory}
            key={category}
          />
        ))}
      </CategoryDiv>
      <hr />
      {data.map(moimInfo => (
        <MoimInfo
          key={moimInfo.id}
          moimInfo={moimInfo}
          hasBorder={false}
          showStatus
        />
      ))}
    </>
  );
}

export default MyMoim;
