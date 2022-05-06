import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import MoimCard from '../components/moim/MoimCard';
import HomeCarousel from '../components/home/HomeCarousel';
import FilterSearchBar from '../components/home/FilterSearchBar';
import { categoryAtom, moimListAtom } from '../atoms/moim';
import { getMoimList } from '../api/moim';
import { snakeToCamel } from '../utils/formatKey';

const Hr = styled.hr`
  border: none;
  border-bottom: 1px solid #a9a9a9;
  margin: 1rem 0;
`;

function Home() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [, setSelectedCategory] = useAtom(categoryAtom);
  const [moimList, setMoimList] = useAtom(moimListAtom);

  useEffect(() => {
    setSelectedCategory(null);
    getMoimList(
      res => {
        const formattedData = res.data.map(item => ({
          ...snakeToCamel(item),
          time: new Date(item.time),
        }));
        setMoimList(formattedData);
      },
      err => {
        // TODO: 백엔드에서 404 대신 빈 배열로 변경될 경우 res에서 처리
        if (err.response.status === 404) {
          setMoimList([]);
        }
      },
    );
  }, []);

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
      {moimList.length > 0 &&
        moimList.map(moimInfo => (
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
