import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import RestaurantInfoCard from './RestaurantInfoCard';
import ButtonLetsEat from './ButtonLetsEat';

const CloseButton = styled.div`
  text-align: end;
`;
const Summary = styled.div`
  display: flex;
  justify-content: space-between;
`;
const BookMark = styled.div`
  align-self: center;
  padding-right: 10px;
  .bookmark {
    font-size: 30px;
    color: #fcb448;
  }
`;

function SummaryInfo({ setSearchPage }) {
  const marked = true;
  return (
    <>
      <CloseButton>
        <CloseIcon onClick={() => setSearchPage('searchLst')} />
      </CloseButton>
      <Summary onClick={() => setSearchPage('detail')}>
        <RestaurantInfoCard />
        <BookMark>
          {marked ? (
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
};

export default SummaryInfo;
