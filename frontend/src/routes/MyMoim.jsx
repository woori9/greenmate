import styled from 'styled-components';
import { useAtom } from 'jotai';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import MoimCategory from '../components/moim/MoimCategory';
import MoimInfo from '../components/moim/MoimInfo';
import moim from '../atoms/moim';

const CategoryDiv = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding-left: 0px;
`;

function MyMoim() {
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
      author: {
        id: 1,
        nickname: '김싸피',
        vegeType: '락토오보',
      },
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
      <FloatingActionBtn isForMoim />
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
