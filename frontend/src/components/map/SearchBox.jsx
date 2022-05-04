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
  .search-input {
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

function SearchBox() {
  return (
    <SearchContainer>
      <SearchIcon />
      <input
        className="search-input"
        placeholder="장소, 음식, 채식 타입 검색"
      />
    </SearchContainer>
  );
}

export default SearchBox;
