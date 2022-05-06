import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
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
const Detail = styled.div`
  border: 1px solid #fcb448;
  border-radius: 10px;
  padding: 1rem;
  div {
    display: flex;
    align-items: center;
    line-height: 2rem;
    p {
      padding-left: 1rem;
    }
  }
`;
const Button = styled.button`
  border: none;
  background-color: transparent;
  text-decoration: underline;
  padding-left: 1rem;
  :hover {
    cursor: pointer;
  }
`;
const Menu = styled.div`
  border-bottom: 1px solid #f2f2f2;
  padding: 1rem 0;
  .menu {
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    .vege-type {
      padding-top: 5px;
      color: #a9a9a9;
    }
  }
  .name {
    display: flex;
    flex-direction: column;
  }
`;
const Review = styled.div`
  padding: 1rem 0;
`;

function copyAddress(text) {
  const t = document.createElement('textarea');
  document.body.appendChild(t);
  t.value = text;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
}

function DetailInfo() {
  const marked = true;
  const address = '경기도 평택시';
  const call = '123-4567-8910';
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
      <Detail>
        <div className="address">
          <LocationOnIcon />
          <p>{address}</p>
          <Button onClick={() => copyAddress(address)}>복사하기</Button>
        </div>
        <div className="call">
          <CallIcon />
          <Button
            onClick={() => {
              document.location.href = `tel: ${call}`;
            }}
          >
            {call}
          </Button>
        </div>
      </Detail>
      <Menu>
        <h3>메뉴</h3>
        <div className="menu">
          <div className="name">
            <p>두부 & 현미 샐러드</p>
            <p className="vege-type">비건</p>
          </div>
          <p>7,900원</p>
        </div>
      </Menu>
      <Review>
        <h3>리뷰</h3>
      </Review>
      <ButtonLetsEat />
    </>
  );
}

export default DetailInfo;
