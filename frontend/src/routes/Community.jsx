import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import Feeds from '../components/community/Feeds';

const CommunityContainer = styled.div`
  min-height: calc(100vh + 62px);
  padding-bottom: 5rem;
  margin: 62px 0 5rem 0;
  display: grid;
  justify-content: center;
  @media screen and (min-width: 1025px) {
    margin: 60px 0 60px 130px;
  }
`;
const Container = styled.div`
  padding: 1rem 0;
  padding-bottom: 1rem;
  .control-box {
    padding: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`;

function Community() {
  const [category, setCategory] = useState(0);
  const [vegeType, setVegeType] = useState(0);
  const handleCategoryChange = event => {
    setCategory(event.target.value);
  };
  const handleVegeTypeChange = event => {
    setVegeType(event.target.value);
  };

  return (
    <CommunityContainer>
      <Container>
        <div className="control-box">
          <FormControl fullWidth sx={{ mx: 1 }}>
            <InputLabel id="category">분류</InputLabel>
            <Select
              labelId="category"
              id="standard"
              value={category}
              onChange={handleCategoryChange}
              label="category"
            >
              <MenuItem value={0}>전체</MenuItem>
              <MenuItem value={1}>일상</MenuItem>
              <MenuItem value={2}>식당 리뷰</MenuItem>
              <MenuItem value={3}>제품</MenuItem>
              <MenuItem value={4}>레시피</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mx: 1 }}>
            <InputLabel id="vegeType">채식타입</InputLabel>
            <Select
              labelId="vegeType"
              id="vegeType"
              value={vegeType}
              onChange={handleVegeTypeChange}
              label="vegeType"
            >
              <MenuItem value={0}>전체</MenuItem>
              <MenuItem value={1}>비건</MenuItem>
              <MenuItem value={2}>락토</MenuItem>
              <MenuItem value={3}>오보</MenuItem>
              <MenuItem value={4}>락토 오보</MenuItem>
              <MenuItem value={5}>페스코</MenuItem>
              <MenuItem value={6}>폴로</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Container>
      <Feeds categoryValue={category} vegeTypeValue={vegeType} />
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim={false} />
    </CommunityContainer>
  );
}

export default Community;
