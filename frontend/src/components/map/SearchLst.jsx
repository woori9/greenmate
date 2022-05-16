import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantInfoCard from './RestaurantInfoCard';
import useWindowDimensions from '../../utils/windowDimension';
import {
  pageStatusAtom,
  searchResultsAtom,
  keywordAtom,
} from '../../atoms/map';

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

function SearchLst({ getMapwithCommand }) {
  const { width } = useWindowDimensions();
  const [keyword] = useAtom(keywordAtom);
  const [, setPageStatus] = useAtom(pageStatusAtom);
  const [searchResults] = useAtom(searchResultsAtom);

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
            setPageStatus('searchBox');
          }}
        />
      </SearchHeader>
      <Summary>
        {searchResults.length ? (
          <>
            {searchResults.map(arrayResult => (
              <SummaryContainer
                key={arrayResult.id}
                onClick={() =>
                  width > 1024
                    ? getMapwithCommand('setDetailRestau', arrayResult.id)
                    : getMapwithCommand('setSummaryRestau', arrayResult.id)
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
  getMapwithCommand: PropTypes.func.isRequired,
};

export default SearchLst;
