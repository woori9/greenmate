import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { getFeedList } from '../../api/community';
import Feed from './Feed';

const Container = styled.div`
  padding: 0.5rem 1rem 5rem 1rem;
  margin-bottom: 3rem;
  max-width: 100vw;
  @media screen and (min-width: 1025px) {
    max-width: 500px;
  }
  .none-feeds {
    margin-top: 50px;
  }
`;
function Feeds({ categoryValue, vegeTypeValue }) {
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFeeds = async () => {
      const resData = await getFeedList();
      setFeeds(resData);
      setIsLoading(false);
    };
    getFeeds();
  }, []);

  let res = feeds.filter(
    feed => feed.category === categoryValue && feed.vege_type === vegeTypeValue,
  );
  if (categoryValue === 0) {
    res = feeds.filter(feed => feed.vege_type === vegeTypeValue);
  } else if (vegeTypeValue === 0) {
    res = feeds.filter(feed => feed.category === categoryValue);
  }
  if (categoryValue === 0 && vegeTypeValue === 0) {
    res = feeds;
  }
  return (
    <Container>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading &&
        (res.length !== 0 ? (
          <div>
            {res.map(feed => (
              <div key={feed.id}>
                <Feed feed={feed} />
              </div>
            ))}
          </div>
        ) : (
          <div className="none-feeds">게시글이 없습니다!</div>
        ))}
    </Container>
  );
}

Feeds.propTypes = {
  categoryValue: PropTypes.number.isRequired,
  vegeTypeValue: PropTypes.number.isRequired,
};

export default Feeds;
