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
  flex-direction: column;
  padding-bottom: 4rem;
  .no-content {
    padding-top: 4rem;
    margin: 0 auto;
  }
`;
const SummaryContainer = styled.div`
  border-bottom: 1px solid #f2f2f2;
`;

function SearchLst({
  getSummaryRestau,
  searchResults,
  keyword,
  setSearchPage,
  markingAllRestau,
}) {
  const { width } = useWindowDimensions();
  const ArrayResults = Object.values(searchResults);

  return (
    <>
      <SearchHeader>
        <div className="search-log">
          <SearchIcon className="search-icon" />
          <div>
            <p className="search-keyword">{keyword}</p>
            <p className="search-cnt">{searchResults.length}개의 검색결과</p>
          </div>
        </div>
        <CloseIcon
          onClick={() => {
            setSearchPage('searchBox');
            markingAllRestau();
          }}
        />
      </SearchHeader>
      <Summary>
        {ArrayResults.length ? (
          <>
            {ArrayResults.map(arrayResult => (
              <SummaryContainer
                key={arrayResult.id}
                onClick={() =>
                  width > 1024
                    ? setSearchPage('detail')
                    : getSummaryRestau(arrayResult.id)
                }
              >
                <RestaurantInfoCard arrayResult={arrayResult} />
              </SummaryContainer>
            ))}
          </>
        ) : (
          <div className="no-content">
            <p>검색결과가 없습니다</p>
          </div>
        )}
      </Summary>
    </>
  );
}
SearchLst.propTypes = {
  setSearchPage: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      is_like: PropTypes.bool.isRequired,
      res_info: PropTypes.shape(),
      score: PropTypes.number.isRequired,
    }),
  ).isRequired,
  getSummaryRestau: PropTypes.func.isRequired,
  markingAllRestau: PropTypes.func.isRequired,
};

export default SearchLst;
