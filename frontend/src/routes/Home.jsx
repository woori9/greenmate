import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import MoimCard from '../components/moim/MoimCard';
import HomeCarousel from '../components/home/HomeCarousel';
import FilterSearchBar from '../components/home/FilterSearchBar';
import moim from '../atoms/moim';

const Hr = styled.hr`
  border: none;
  border-bottom: 1px solid #a9a9a9;
  margin: 1rem 0;
`;

function Home() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [, setSelectedCategory] = useAtom(moim);

  useEffect(() => {
    setSelectedCategory(null);
  }, []);

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
        vegeType: 3,
      },
      title: '야채 식당 가실 분!',
      content:
        '제주 여행 중인데 야채 식당 가보고 싶어서 글 올려요! 여러 메뉴 시켜서 같이 맛보면 너무 좋을 것 같아요',
      time: new Date('2022-06-02T19:35:00'),
      headCnt: 4,
      nowCnt: 2,
      status: 0,
      mates: [
        {
          userId: 2,
          nickname: '이이이',
          vegeType: 4,
          mateStatus: 1,
        },
        {
          userId: 3,
          nickname: '박박박',
          vegeType: 2,
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
      author: {
        id: 2,
        nickname: '박싸피',
        vegeType: 4,
      },
      title: '야채 식당 가실 분!',
      content: '이번주에 야채 식당 가실 분 구해요',
      time: new Date(),
      headCnt: 4,
      nowCnt: 2,
      status: 0,
      mates: [
        {
          userId: 4,
          nickname: '최싸피',
          vegeType: 3,
          mateStatus: 1,
        },
      ],
    },
  ];

  return (
    <>
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim />
      <HomeCarousel />
      <FilterSearchBar
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <Hr />
      {data.map(moimInfo => (
        <MoimCard
          key={moimInfo.id}
          moimInfo={moimInfo}
          hasBorder={false}
          showStatus={false}
        />
      ))}
    </>
  );
}

export default Home;
