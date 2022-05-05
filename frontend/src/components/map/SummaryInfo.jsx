import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import RestaurantInfoCard from './RestaurantInfoCard';
import ButtonLetsEat from './ButtonLetsEat';

const StyledCloseIcon = styled(CloseIcon)`
  position: fixed;
  right: 1rem;
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

function SummaryInfo() {
  const marked = true;
  return (
    <>
      <StyledCloseIcon />
      <Summary>
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

export default SummaryInfo;
