import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import MoimCategory from '../components/moim/MoimCategory';
import MoimCard from '../components/moim/MoimCard';
import { categoryAtom, moimListAtom } from '../atoms/moim';
import { getMyMoimList } from '../api/moim';
import { snakeToCamel } from '../utils/formatKey';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  padding: 5rem 1rem 5rem 1rem;

  @media screen and (min-width: 1025px) {
    padding: 60px 2rem 0 calc(130px + 2rem);
  }
`;

const CategoryDiv = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding-left: 0px;

  @media screen and (min-width: 1025px) {
    justify-content: flex-end;
  }
`;

function MyMoim() {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useAtom(categoryAtom);
  const [moimList, setMoimList] = useAtom(moimListAtom);
  const [needUpdate, setNeedUpdate] = useState(0);
  const moimCategories = [
    ['대기', 0],
    ['참여', 1],
    ['진행', 5],
    ['완료', 4],
  ];

  useEffect(() => {
    if (selectedCategory === 6) {
      setSelectedCategory(0);
    }
  }, []);

  useEffect(() => {
    getMyMoimList(
      selectedCategory === 6 ? 0 : selectedCategory,
      res => {
        const formattedData = res.data.map(item => ({
          ...snakeToCamel(item),
          time: new Date(item.time),
        }));
        setMoimList(formattedData);
      },
      () => {},
    );
  }, [selectedCategory, needUpdate]);

  return (
    <Container>
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim />
      <CategoryDiv>
        {moimCategories.map(category => (
          <MoimCategory
            name={category[0]}
            value={category[1]}
            isSelected={selectedCategory === category[1]}
            setSelectedCategory={setSelectedCategory}
            key={category}
          />
        ))}
      </CategoryDiv>
      {width <= 1024 && <hr />}
      {moimList.length > 0 &&
        moimList.map(moimInfo => (
          <MoimCard
            key={moimInfo.id}
            moimInfo={moimInfo}
            setNeedUpdate={setNeedUpdate}
            showStatus
          />
        ))}
    </Container>
  );
}

export default MyMoim;
