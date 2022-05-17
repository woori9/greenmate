import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from '@mui/material/colors';
import { getCommentTrans, postCommentLike } from '../../api/community';

const Trans = styled.div`
  cursor: pointer;
  font-size: 5px;
  color: lightgrey;
`;

function CommentDetail({
  commentId,
  commentContent,
  commentIsLike,
  commentLikeCnt,
}) {
  const [commentTrans, setCommentTrans] = useState([]);
  const [isTrans, setIsTrans] = useState(false);
  const [isLike, setIsLike] = useState(commentIsLike);
  const [likeCnt, setLikeCnt] = useState(commentLikeCnt);
  useEffect(() => {
    const getFeeds = async () => {
      const resData = await getCommentTrans(commentId);
      setCommentTrans(resData.content_trans);
    };
    getFeeds();
  }, []);
  const handleLike = comId => {
    postCommentLike(comId);
    if (isLike) {
      setLikeCnt(prev => prev - 1);
    } else {
      setLikeCnt(prev => prev + 1);
    }
    setIsLike(!isLike);
  };
  return (
    <div>
      {isTrans ? (
        <Stack direction="row" alignItems="center">
          <span>{commentTrans}</span>
          <Trans
            onClick={() => {
              setIsTrans(!isTrans);
            }}
          >
            원문보기
          </Trans>
          <IconButton
            onClick={() => {
              handleLike(commentId);
            }}
          >
            {isLike ? (
              <FavoriteIcon sx={{ fontSize: 'small', color: red[400] }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 'small', color: red[400] }} />
            )}
          </IconButton>
          <span>{likeCnt}</span>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center">
          <span>{commentContent}</span>
          <Trans
            onClick={() => {
              setIsTrans(!isTrans);
            }}
          >
            번역보기
          </Trans>
          <IconButton
            onClick={() => {
              handleLike(commentId);
            }}
          >
            {isLike ? (
              <FavoriteIcon sx={{ fontSize: 'small', color: red[400] }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 'small', color: red[400] }} />
            )}
          </IconButton>
          <span>{likeCnt}</span>
        </Stack>
      )}
    </div>
  );
}

CommentDetail.propTypes = {
  commentId: PropTypes.number.isRequired,
  commentContent: PropTypes.string.isRequired,
  commentIsLike: PropTypes.bool.isRequired,
  commentLikeCnt: PropTypes.number.isRequired,
};

export default CommentDetail;
