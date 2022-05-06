import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantInfoCard from './RestaurantInfoCard';

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
  .search-log {
    display: flex;
    align-items: center;
  }
  .search-icon {
    margin-right: 10px;
    font-size: 35px;
  }
  .search-cnt {
    font-size: 10px;
    color: #a9a9a9;
  }
`;

function SearchLst() {
  return (
    <>
      <SearchHeader>
        <div className="search-log">
          <SearchIcon className="search-icon" />
          <div>
            <p className="search-keyword">샐러드볼</p>
            <p className="search-cnt">20개의 검색결과</p>
          </div>
        </div>
        <CloseIcon />
      </SearchHeader>
      <RestaurantInfoCard />
    </>
  );
}

export default SearchLst;
