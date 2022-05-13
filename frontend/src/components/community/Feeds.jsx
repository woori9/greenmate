import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFeedList } from '../../api/community';
import Feed from './Feed';

function Feeds({ categoryValue, vegeTypeValue }) {
  const [feeds, setFeeds] = useState([]);
  // const [res, setRes] = useState([]);
  useEffect(() => {
    const getFeeds = async () => {
      const resData = await getFeedList();
      setFeeds(resData);
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
    <div>
      {res.map(feed => (
        <div key={feed.id}>
          <Feed feed={feed} />
        </div>
      ))}
    </div>
  );
}

Feeds.propTypes = {
  categoryValue: PropTypes.number.isRequired,
  vegeTypeValue: PropTypes.number.isRequired,
};

export default Feeds;
