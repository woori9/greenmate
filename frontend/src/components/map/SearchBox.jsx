import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { userInfoAtom } from '../../atoms/accounts';
import { keywordAtom } from '../../atoms/map';

const SearchContainer = styled.div`
  height: 48px;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  color: #a9a9a9;
  border-radius: 10px;
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

function SearchBox({ getMapwithCommand }) {
  const [, setKeyword] = useAtom(keywordAtom);
  const [userInfo] = useAtom(userInfoAtom);

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      setKeyword(event.target.value);
      getMapwithCommand('setSearchRestau', event.target.value);
      document.getElementById('search-input').value = '';
    }
  }
  const setPlaceholder = info => {
    if (info.language === 0) {
      return '장소, 음식, 채식 타입 검색';
    }
    return 'Search restaurant, foods, vegan type';
  };

  return (
    <SearchContainer>
      <SearchIcon />
      <input
        id="search-input"
        placeholder={setPlaceholder(userInfo)}
        onKeyPress={handleKeyPress}
      />
    </SearchContainer>
  );
}
SearchBox.propTypes = {
  getMapwithCommand: PropTypes.func.isRequired,
};

export default SearchBox;
