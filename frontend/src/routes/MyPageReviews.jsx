import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import GoBackBar from '../components/common/GoBackBar';
import { getMyReviews } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  border-radius: 10px;
  padding: 78px 1rem 5rem 1rem;
  height: calc(100vh - 104px - 4rem);
  @media screen and (min-width: 1025px) {
    margin: 0 2rem 0 34rem;
    border: 1px solid #f2f2f2;
    height: 33rem;
  }
`;
const NoContent = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function MyPageReviews() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [reviews, setReviews] = useState([]);
  const { userPk } = useParams();
  console.log(reviews);
  useEffect(() => {
    getMyReviews(
      { userId: userPk },
      res => {
        console.log(res);
        setReviews(res);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  return (
    <>
      {width > 1024 ? (
        <>
          <ResponsiveNavbar />
          <ResponsiveProfile />
        </>
      ) : (
        <GoBackBar title="작성한 리뷰" />
      )}
      <Container isDesktop={isDesktop}>
        {reviews ? (
          <>
            <p>1</p>
            {/* {reviews.map(review => (
              <p>{review.id}</p>
            ))} */}
          </>
        ) : (
          <NoContent>
            <p>아직 작성된 리뷰가 없습니다</p>
          </NoContent>
        )}
      </Container>
    </>
  );
}

export default MyPageReviews;
