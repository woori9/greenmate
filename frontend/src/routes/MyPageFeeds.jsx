import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import GoBackBar from '../components/common/GoBackBar';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import { getMyFeeds } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  border: 1px solid red;
  margin: ${props =>
    props.isDesktop ? '0 2rem 0 34rem' : '62px 1rem 5rem 1rem'};
`;

function MyPageReviews() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [feeds, setFeeds] = useState([]);
  const { userPk } = useParams();
  console.log(feeds);
  useEffect(() => {
    getMyFeeds(
      { userId: userPk },
      res => {
        setFeeds(res.data);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  return (
    <>
      {isDesktop ? (
        <>
          <ResponsiveNavbar />
          <ResponsiveProfile />
        </>
      ) : (
        <GoBackBar title="작성한 피드" />
      )}
      <Container isDesktop={isDesktop}>
        <p>내용</p>
      </Container>
    </>
  );
}

export default MyPageReviews;
