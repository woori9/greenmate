/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SearchList = styled.ul`
  position: absolute;
  list-style-type: none;
  width: 90%;
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

function RestaurantSearch({ setSelectedRestaurantId }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const searchResult = [
    { restaurantId: 1, name: '검색 결과1', lattitude: 112.2, longitude: 155.5 },
    { restaurantId: 2, name: '검색 결과2', lattitude: 112.2, longitude: 155.5 },
    { restaurantId: 3, name: '검색 결과3', lattitude: 112.2, longitude: 155.5 },
    { restaurantId: 4, name: '검색 결과4', lattitude: 112.2, longitude: 155.5 },
  ];

  function onKeyUp(e) {
    if (e.keyCode === 13 && searchKeyword.length > 0) {
      setIsSearch(true);
      setSearchKeyword(e.target.value);
    }
  }

  function handleChange(e) {
    setSearchKeyword(e.target.value);
  }

  return (
    <>
      <label htmlFor="title" className="input-label">
        장소
      </label>
      <div>
        <Input
          id="restaurant"
          name="restaurant"
          value={searchKeyword}
          onChange={event => handleChange(event)}
          onKeyUp={event => onKeyUp(event)}
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
                  key={searchItem.restaurantId}
                  onClick={() => {
                    setSelectedRestaurantId(searchItem.restaurantId);
                    setSearchKeyword(searchItem.name);
                    setIsSearch(false);
                  }}
                >
                  {searchItem.name}
                </li>
              ))
            ) : (
              <li>검색 결과가 없습니다.</li>
            )}
          </SearchList>
        )}
      </div>
    </>
  );
}

RestaurantSearch.propTypes = {
  setSelectedRestaurantId: PropTypes.func.isRequired,
};

export default RestaurantSearch;
