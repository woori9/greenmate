/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { searchRestaurant } from '../../api/restaurant';
import { snakeToCamel } from '../../utils/formatKey';

// TODO: 테스트 필요

const SearchContainer = styled.div`
  position: relative;
`;

const SearchList = styled.ul`
  position: absolute;
  clear: both;
  list-style-type: none;
  width: 100%;
  background-color: #fff;
  padding-left: 0;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
  z-index: 1;

  li {
    padding: 0.5rem;

    &:not(:last-child) {
      border-bottom: 1px solid #a9a9a9;
    }
  }
`;

function RestaurantSearchForm({
  isForUpdate,
  searchKeyword,
  setSearchKeyword,
  setSelectedRestaurantId,
}) {
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  // const searchResult = [
  //   {
  //     id: 1,
  //     resInfo: {
  //       name: '검색 결과 1',
  //       address: '대전시 유성구 봉명동',
  //       menus: '김밥',
  //       vegeType: 2,
  //     },
  //   },
  //   {
  //     id: 2,
  //     resInfo: {
  //       name: '검색 결과 2',
  //       address: '대전시 유성구 봉명동',
  //       menus: '김밥',
  //       vegeType: 3,
  //     },
  //   },
  //   {
  //     id: 3,
  //     resInfo: {
  //       name: '검색 결과 3',
  //       address: '대전시 유성구 봉명동',
  //       menus: '김밥',
  //       vegeType: 4,
  //     },
  //   },
  // ];

  function handleKeyUp(e) {
    if (e.keyCode === 13 && searchKeyword.length > 0) {
      setIsSearch(true);
      setSearchKeyword(e.target.value);
      searchRestaurant(
        searchKeyword,
        res => {
          const formattedData = res.data.map(item => ({
            ...snakeToCamel(item),
          }));
          setSearchResult(formattedData);
        },
        err => console.log(err),
      );
    }
  }

  return (
    <SearchContainer>
      <label htmlFor="title" className="input-label">
        장소
      </label>
      <div>
        <Input
          id="restaurant"
          name="restaurant"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onKeyUp={event => handleKeyUp(event)}
          disabled={!!isForUpdate}
          margin="dense"
          startAdornment={<InputAdornment position="start">@</InputAdornment>}
          inputProps={{
            'aria-label': 'restaurant',
          }}
          sx={{
            width: '100%',
          }}
        />
        {isSearch && (
          <SearchList>
            {searchResult.length > 0 ? (
              searchResult.map(searchItem => (
                <li
                  key={searchItem.id}
                  onClick={() => {
                    setSelectedRestaurantId(searchItem.id);
                    setSearchKeyword(searchItem.resInfo.name);
                    setIsSearch(false);
                  }}
                >
                  {searchItem.resInfo.name}
                </li>
              ))
            ) : (
              <li>검색 결과가 없습니다.</li>
            )}
          </SearchList>
        )}
      </div>
    </SearchContainer>
  );
}

RestaurantSearchForm.propTypes = {
  isForUpdate: PropTypes.bool.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  setSearchKeyword: PropTypes.func.isRequired,
  setSelectedRestaurantId: PropTypes.func.isRequired,
};

export default RestaurantSearchForm;
