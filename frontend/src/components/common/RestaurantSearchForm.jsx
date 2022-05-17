/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { apiGetSearchRestau } from '../../api/map';
import { snakeToCamel } from '../../utils/formatKey';

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

    p:last-child {
      color: #a9a9a9;
      font-size: 0.8rem;
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

  async function handleKeyUp(e) {
    e.preventDefault();
    if (e.keyCode === 13 && searchKeyword.length > 0) {
      setIsSearch(true);
      setSearchKeyword(e.target.value);
      apiGetSearchRestau({ keyword: searchKeyword }).then(res => {
        const formattedData = res.map(item => ({
          ...snakeToCamel(item),
        }));
        setSearchResult(formattedData);
      });
    }
  }
  return (
    <SearchContainer>
      <label htmlFor="restaurant" className="input-label">
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
                  <p>{searchItem.resInfo.name}</p>
                  <p>{searchItem.resInfo.address}</p>
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
