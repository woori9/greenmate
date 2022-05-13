import PropTypes from 'prop-types';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  background-color: #f2f2f2;
  color: #a9a9a9;
  border-radius: 10px;
  height: 48px;
  #search-input {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    font-size: 16px;
    &:focus {
      outline: none;
    }
  }
`;

function SearchBox({
  getSearchRestau,
  setMapSearchKeyword,
  setSearchPage,
  setKeyword,
}) {
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      setMapSearchKeyword(event.target.value);
      setKeyword(event.target.value);
      getSearchRestau(event.target.value);
      document.getElementById('search-input').value = '';
      setSearchPage('searchLst');
    }
  }
  return (
    <SearchContainer>
      <SearchIcon />
      <input
        id="search-input"
        placeholder="장소, 음식, 채식 타입 검색"
        onKeyPress={handleKeyPress}
      />
    </SearchContainer>
  );
}
SearchBox.propTypes = {
  setMapSearchKeyword: PropTypes.func.isRequired,
  setSearchPage: PropTypes.func.isRequired,
  setKeyword: PropTypes.func.isRequired,
  getSearchRestau: PropTypes.func.isRequired,
};

export default SearchBox;
