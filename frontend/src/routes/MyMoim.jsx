import styled from 'styled-components';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import MoimCategory from '../components/moim/MoimCategory';
import MoimCard from '../components/moim/MoimCard';
import { categoryAtom, moimListAtom } from '../atoms/moim';
import { getMyMoimList } from '../api/moim';
import { snakeToCamel } from '../utils/formatKey';

const CategoryDiv = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding-left: 0px;
`;

function MyMoim() {
  const [selectedCategory, setSelectedCategory] = useAtom(categoryAtom);
  const [moimList, setMoimList] = useAtom(moimListAtom);
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
      err => {
        // TODO: 백엔드에서 404 대신 빈 배열로 변경될 경우 res에서 처리
        if (err.response.status === 404) {
          setMoimList([]);
        }
      },
    );
  }, [selectedCategory]);

  return (
    <>
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
      <hr />
      {moimList.length > 0 &&
        moimList.map(moimInfo => (
          <MoimCard key={moimInfo.id} moimInfo={moimInfo} showStatus />
        ))}
    </>
  );
}

export default MyMoim;
