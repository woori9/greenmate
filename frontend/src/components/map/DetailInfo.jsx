import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import RestaurantInfoCard from './RestaurantInfoCard';
import ButtonLetsEat from './ButtonLetsEat';
import useWindowDimensions from '../../utils/windowDimension';
import { apiPostLikeRestau } from '../../api/map';

const Container = styled.div`
  padding-bottom: 5rem;
`;

const CloseButton = styled.div`
  text-align: end;
`;
const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
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
    padding: 5px 0;
    p {
      padding-left: 1rem;
    }
  }
  .address {
    line-height: 140%;
    p {
      max-width: 70%;
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
  padding: 1rem 0;
  .menu {
    padding: 1rem 0.5rem;
    .vege-type {
      padding-top: 5px;
      color: #a9a9a9;
    }
  }
  .sub-title {
    border-bottom: 1px solid #f2f2f2;
    padding: 1rem 0;
  }
`;
const Review = styled.div`
  padding: 1rem 0;
  .sub-title {
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 1rem;
  }
  .no-content {
    padding: 2rem;
    text-align: center;
  }
  .review {
    padding: 1rem 0.5rem;
  }
`;

function copyAddress(text) {
  const t = document.createElement('textarea');
  document.body.appendChild(t);
  t.value = text;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
}

function DetailInfo({ setSearchPage, detailRestau }) {
  const { width } = useWindowDimensions();
  const [newBookMark, setNewBookMark] = useState(detailRestau.is_like);
  function postLikeRestau() {
    apiPostLikeRestau({ restauId: detailRestau.id }, () =>
      setNewBookMark(!newBookMark),
    );
  }
  const { call } = detailRestau;
  const restauInfo = detailRestau.res_info;
  const { address, menus } = restauInfo;
  const splitMenus = menus.split(' ');
  const reviews = detailRestau.review;
  const reviewCnt = reviews.length;

  return (
    <Container>
      <CloseButton
        onClick={() =>
          width > 1024 ? setSearchPage('searchLst') : setSearchPage('summary')
        }
      >
        <CloseIcon />
      </CloseButton>
      <Summary>
        <RestaurantInfoCard arrayResult={detailRestau} />
        <BookMark onClick={() => postLikeRestau()}>
          {newBookMark ? (
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
        <h3 className="sub-title">메뉴</h3>
        {splitMenus.map(menu => (
          <div key={menu} className="menu">
            <p>{menu.split('(')[0]}</p>
            <p className="vege-type">{menu.split('(')[1].split(')')[0]}</p>
          </div>
        ))}
      </Menu>
      <Review>
        <h3 className="sub-title">리뷰</h3>
        <div>
          {reviewCnt ? (
            <div>
              {reviews.map(review => (
                <div className="review">
                  <p>{review.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-content">
              <p>작성된 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
      </Review>
      <ButtonLetsEat />
    </Container>
  );
}

DetailInfo.propTypes = {
  setSearchPage: PropTypes.func.isRequired,
  detailRestau: PropTypes.shape().isRequired,
};

export default DetailInfo;
