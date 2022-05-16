import { useAtom } from 'jotai';
import { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import RestaurantInfoCard from './RestaurantInfoCard';
import ButtonLetsEat from './ButtonLetsEat';
import useWindowDimensions from '../../utils/windowDimension';
import {
  summaryRestauAtom,
  detailRestauAtom,
  pageStatusAtom,
  searchResultsAtom,
} from '../../atoms/map';
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
    .address-text {
      max-width: 70%;
      white-space: pre-line;
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
    white-space: pre-line;
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

function DetailInfo() {
  const { width } = useWindowDimensions();
  const [newSearchResult] = useAtom(searchResultsAtom);
  const [summaryRestau, setSummaryRestau] = useAtom(summaryRestauAtom);
  const [detailRestau, setDetailRestau] = useAtom(detailRestauAtom);
  const [, setPageStatus] = useAtom(pageStatusAtom);
  const { call } = detailRestau;
  const restauInfo = detailRestau.res_info;
  const { address, menus } = restauInfo;
  const splitMenus = menus.split(' ');
  const reviews = detailRestau.review;
  const reviewCnt = reviews.length;

  const [newBookMark, setNewBookMark] = useState(detailRestau.is_like);
  function postLikeRestau() {
    apiPostLikeRestau({ restauId: detailRestau.id }, () => {
      setNewBookMark(!newBookMark);
      setSummaryRestau({ ...summaryRestau, is_like: !newBookMark });
      setDetailRestau({ ...detailRestau, is_like: !newBookMark });
    });
  }
  return (
    <Container>
      <CloseButton
        onClick={() => {
          if (width < 1024) {
            setPageStatus('summary');
          } else if (newSearchResult.length) {
            setPageStatus('searchLst');
          } else {
            setPageStatus('searchBox');
          }
        }}
      >
        <CloseIcon />
      </CloseButton>
      <Summary>
        <RestaurantInfoCard arrayResult={detailRestau} />
        <BookMark onClick={() => postLikeRestau()}>
          {detailRestau.is_like ? (
            <BookmarkIcon className="bookmark" />
          ) : (
            <BookmarkBorderOutlinedIcon className="bookmark" />
          )}
        </BookMark>
      </Summary>
      <Detail>
        <div className="address">
          <LocationOnIcon />
          <div className="address-text">
            <p>{address}</p>
          </div>
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
        {splitMenus.map((menu, idx) => (
          <div key={menu && idx}>
            {!menu.split('(')[0].includes('possible') ? (
              <div className="menu">
                <p>{menu.split('(')[0]}</p>
                <p className="vege-type">{menu.split(/[( )]/)[1]}</p>
              </div>
            ) : null}
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

export default DetailInfo;
