import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import GoBackBar from '../components/common/GoBackBar';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import { getMyFeeds } from '../api/mypage';
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
  const [feeds, setFeeds] = useState([]);
  const { userPk } = useParams();
  if (feeds.length) {
    console.log(feeds);
  }
  useEffect(() => {
    getMyFeeds(
      { userId: userPk },
      res => {
        const { data } = res;
        setFeeds(data);
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
        {feeds.length ? (
          <>
            {feeds.map(feed => (
              <p>{feed.id}</p>
            ))}
          </>
        ) : (
          <NoContent>
            <p>아직 작성된 피드가 없습니다</p>
          </NoContent>
        )}
      </Container>
    </>
  );
}

export default MyPageReviews;
