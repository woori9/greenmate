import PropTypes from 'prop-types';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantInfoCard from './RestaurantInfoCard';
import useWindowDimensions from '../../utils/windowDimension';

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
const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f2f2f2;
`;

function SearchLst({ keyword, setSearchPage }) {
  const { width } = useWindowDimensions();

  return (
    <>
      <SearchHeader>
        <div className="search-log">
          <SearchIcon className="search-icon" />
          <div>
            <p className="search-keyword">{keyword}</p>
            <p className="search-cnt">20개의 검색결과</p>
          </div>
        </div>
        <CloseIcon onClick={() => setSearchPage('searchBox')} />
      </SearchHeader>
      <Summary
        onClick={() =>
          width > 1024 ? setSearchPage('detail') : setSearchPage('summary')
        }
      >
        <RestaurantInfoCard />
      </Summary>
    </>
  );
}
SearchLst.propTypes = {
  setSearchPage: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
};

export default SearchLst;
