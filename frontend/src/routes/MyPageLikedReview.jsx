import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import GoBackBar from '../components/common/GoBackBar';
import { getLikedReivews } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  border: 1px solid red;
  margin: ${props =>
    props.isDesktop ? '0 2rem 0 34rem' : '62px 1rem 5rem 1rem'};
`;

function MyPageReviews() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [likeReviews, setLikeReviews] = useState([]);
  console.log(likeReviews);
  useEffect(() => {
    getLikedReivews(
      res => {
        setLikeReviews(res.data);
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
        <GoBackBar title="좋아요한 리뷰" />
      )}
      <Container isDesktop={isDesktop}>
        <p>평가</p>
      </Container>
    </>
  );
}

export default MyPageReviews;
