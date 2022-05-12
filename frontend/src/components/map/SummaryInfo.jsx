import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import RestaurantInfoCard from './RestaurantInfoCard';
import ButtonLetsEat from './ButtonLetsEat';
import { apiPostLikeRestau } from '../../api/map';

const CloseButton = styled.div`
  text-align: end;
  cursor: pointer;
`;
const Summary = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SummaryBox = styled.div``;
const BookMark = styled.div`
  align-self: center;
  margin-right: 10px;
  .bookmark {
    font-size: 30px;
    color: #fcb448;
  }
`;

function SummaryInfo({
  searchResults,
  setSearchPage,
  summaryRestau,
  getDetailRestau,
  markingAllRestau,
}) {
  const [newBookMark, setNewBookMark] = useState(summaryRestau.is_like);
  function postLikeRestau() {
    apiPostLikeRestau({ restauId: summaryRestau.id }, () =>
      setNewBookMark(!newBookMark),
    );
  }
  return (
    <>
      <CloseButton>
        <CloseIcon
          onClick={() => {
            if (searchResults.length) {
              setSearchPage('searchLst');
            } else {
              setSearchPage('searchBox');
              markingAllRestau();
            }
          }}
        />
      </CloseButton>
      <Summary>
        <SummaryBox onClick={() => getDetailRestau(summaryRestau.id)}>
          <RestaurantInfoCard arrayResult={summaryRestau} />
        </SummaryBox>
        <BookMark onClick={() => postLikeRestau()}>
          {newBookMark ? (
            <BookmarkIcon className="bookmark" />
          ) : (
            <BookmarkBorderOutlinedIcon className="bookmark" />
          )}
        </BookMark>
      </Summary>
      <ButtonLetsEat />
    </>
  );
}
SummaryInfo.propTypes = {
  setSearchPage: PropTypes.func.isRequired,
  summaryRestau: PropTypes.shape().isRequired,
  getDetailRestau: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      is_like: PropTypes.bool.isRequired,
      res_info: PropTypes.shape(),
      score: PropTypes.number.isRequired,
    }),
  ).isRequired,
  markingAllRestau: PropTypes.func.isRequired,
};

export default SummaryInfo;
