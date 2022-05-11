import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
import { getCommentList } from '../../api/community';

function Comment({ feedId }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const getComments = async () => {
      const resData = await getCommentList(feedId);
      setComments(resData);
    };
    getComments();
  }, []);
  return (
    <CardContent>
      {comments.map(comment => (
        <div key={comment.id}>
          <h1>{comment.id}</h1>
          <p>{comment.nickname}</p>
          <p>{comment.created_at}</p>
          <p>{comment.is_like}</p>
        </div>
      ))}
    </CardContent>
  );
}

Comment.propTypes = {
  feedId: PropTypes.number.isRequired,
};

export default Comment;
