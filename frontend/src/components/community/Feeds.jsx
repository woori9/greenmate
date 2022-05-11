import { useState, useEffect } from 'react';
import { getFeedList } from '../../api/community';
import Feed from './Feed';

function Feeds() {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const getFeeds = async () => {
      const resData = await getFeedList();
      setFeeds(resData);
    };
    getFeeds();
  }, []);
  return (
    <div>
      {feeds.map(feed => (
        <div key={feed.id}>
          <Feed feed={feed} />
        </div>
      ))}
    </div>
  );
}

export default Feeds;
