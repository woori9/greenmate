import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { moimListAtom } from '../../atoms/moim';
import { searchMoim } from '../../api/moim';
import { snakeToCamel } from '../../utils/formatKey';
import useUserInfo from '../../hooks/useUserInfo';

const Container = styled.div`
  .MuiInputBase-fullWidth {
    width: 100%;
  }

  @media screen and (min-width: 1025px) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .MuiInputBase-fullWidth {
      width: 30rem;
    }
  }
`;

function FilterSearchBar({ searchKeyword, setSearchKeyword }) {
  const [period, setPeriod] = useState(0);
  const [day, setDay] = useState(0);
  const [, setMoimList] = useAtom(moimListAtom);
  const userInfo = useUserInfo();

  function apiSearch(periodInput, dayInput) {
    searchMoim(
      searchKeyword,
      periodInput > 0 ? periodInput : null,
      dayInput > 0 ? dayInput : null,
      res => {
        const formattedData = res.data.map(item => ({
          ...snakeToCamel(item),
          time: new Date(item.time),
        }));
        setMoimList(formattedData);
      },
      err => console.log(err),
    );
  }

  function handlePeriodChange(e) {
    setPeriod(e.target.value);
    apiSearch(e.target.value > 0 ? e.target.value : undefined, day);
  }

  function handleDayChange(e) {
    setDay(e.target.value);
    apiSearch(period, e.target.value > 0 ? e.target.value : undefined);
  }

  function handleKeywordChange(e) {
    setSearchKeyword(e.target.value);
  }

  function onSearchKeyUp(e) {
    if (e.keyCode === 13 && searchKeyword.length > 0) {
      apiSearch();
    }
  }

  return (
    <Container>
      {userInfo.language === 0 ? (
        <>
          <div>
            <FormControl sx={{ width: 100, margin: '0 0.5rem 0.5rem 0' }}>
              <InputLabel id="period">기간</InputLabel>
              <Select
                labelId="period"
                id="period"
                value={period}
                label="기간"
                displayEmpty
                onChange={event => handlePeriodChange(event)}
              >
                <MenuItem value={0}>전체</MenuItem>
                <MenuItem value={7}>7일 이내</MenuItem>
                <MenuItem value={14}>14일 이내</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 80 }}>
              <InputLabel id="day">요일</InputLabel>
              <Select
                labelId="day"
                id="day"
                value={day}
                label="요일"
                displayEmpty
                onChange={event => handleDayChange(event)}
              >
                <MenuItem value={0}>전체</MenuItem>
                <MenuItem value={1}>일</MenuItem>
                <MenuItem value={2}>월</MenuItem>
                <MenuItem value={3}>화</MenuItem>
                <MenuItem value={4}>수</MenuItem>
                <MenuItem value={5}>목</MenuItem>
                <MenuItem value={6}>금</MenuItem>
                <MenuItem value={7}>토</MenuItem>
              </Select>
            </FormControl>
          </div>
          <OutlinedInput
            id="restaurant"
            name="restaurant"
            type="text"
            value={searchKeyword}
            onChange={event => handleKeywordChange(event)}
            onKeyUp={event => onSearchKeyUp(event)}
            fullWidth
            margin="dense"
            placeholder="지역/식당 이름/호스트 닉네임"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            inputProps={{
              'aria-label': 'search keyword',
            }}
            sx={{
              width: '18rem',
              maxWidth: '100%',
              borderRadius: '15px',
            }}
          />
        </>
      ) : (
        <>
          <div>
            <FormControl sx={{ width: 100, margin: '0 0.5rem 0.5rem 0' }}>
              <InputLabel id="period">Period</InputLabel>
              <Select
                labelId="period"
                id="period"
                value={period}
                label="Period"
                displayEmpty
                onChange={event => handlePeriodChange(event)}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={7}>7 Days</MenuItem>
                <MenuItem value={14}>14 Days</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 80 }}>
              <InputLabel id="day">Day</InputLabel>
              <Select
                labelId="day"
                id="day"
                value={day}
                label="요일"
                displayEmpty
                onChange={event => handleDayChange(event)}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Sun</MenuItem>
                <MenuItem value={2}>Mon</MenuItem>
                <MenuItem value={3}>Tue</MenuItem>
                <MenuItem value={4}>Wed</MenuItem>
                <MenuItem value={5}>Thu</MenuItem>
                <MenuItem value={6}>Fri</MenuItem>
                <MenuItem value={7}>Sat</MenuItem>
              </Select>
            </FormControl>
          </div>
          <OutlinedInput
            id="restaurant"
            name="restaurant"
            type="text"
            value={searchKeyword}
            onChange={event => handleKeywordChange(event)}
            onKeyUp={event => onSearchKeyUp(event)}
            fullWidth
            margin="dense"
            placeholder="Region or restaurant/host name"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            inputProps={{
              'aria-label': 'search keyword',
            }}
            sx={{
              width: '18rem',
              maxWidth: '100%',
              borderRadius: '15px',
            }}
          />
        </>
      )}
    </Container>
  );
}

FilterSearchBar.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  setSearchKeyword: PropTypes.func.isRequired,
};
export default FilterSearchBar;
