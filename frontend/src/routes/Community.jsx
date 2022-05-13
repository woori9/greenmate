import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import Feeds from '../components/community/Feeds';
import GoBackBar from '../components/common/GoBackBar';

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
    <>
      <div>
        <GoBackBar />
        <FormControl
          variant="standard"
          sx={{ mt: 5, ml: 3, mr: 3, minWidth: 120 }}
        >
          <InputLabel id="category">카테고리</InputLabel>
          <Select
            labelId="category"
            id="standard"
            value={category}
            onChange={handleCategoryChange}
            label="category"
          >
            <MenuItem value={0}>전체</MenuItem>
            <MenuItem value={1}>일상</MenuItem>
            <MenuItem value={2}>식당</MenuItem>
            <MenuItem value={3}>제품</MenuItem>
            <MenuItem value={4}>레시피</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ mt: 5, minWidth: 120 }}>
          <InputLabel id="vegeType">채식 타입</InputLabel>
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
      <Feeds categoryValue={category} vegeTypeValue={vegeType} />
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim={false} />
    </>
  );
}

export default Community;
