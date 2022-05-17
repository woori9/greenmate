import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Input from '@mui/material/Input';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import FeedImageCarousel from './FeedIamgeCarousel';
import {
  postFeedLike,
  deleteFeed,
  getCommentList,
  createComment,
  getFeedTrans,
} from '../../api/community';
import vegan from '../../assets/vegan-icon.png';
import lacto from '../../assets/lacto-icon.png';
import ovo from '../../assets/ovo-icon.png';
import lactoOvo from '../../assets/lacto-ovo-icon.png';
import pesco from '../../assets/pesco-icon.png';
import polo from '../../assets/polo-icon.png';
import useUserInfo from '../../hooks/useUserInfo';

const Trans = styled.div`
  cursor: pointer;
  font-size: 5px;
  color: lightgrey;
`;
const Setting = styled.div`
  position: absolute;
  right: 0;
  z-index: 1;
  width: 20%;
  background-color: #fff;
  border-radius: 10px;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;
const Container = styled.div`
  padding: 20px;

  .small-font {
    font-size: 12px;
  }

  .margin {
    margin-bottom: 1rem;
  }
`;

function SimpleDialog(props) {
  const {
    onClose,
    open,
    comments,
    nowFeedId,
    setUseUpdate,
    userInfoId,
    vegeType,
  } = props;
  const [commentData, setCommentData] = useState('');

  const handleClose = () => {
    onClose();
  };
  const handleSubmit = event => {
    if (event.keyCode === 13 && commentData.length > 0) {
      const feedId = nowFeedId;
      const data = { content: commentData };
      createComment({ feedId, data });
      setUseUpdate(prev => prev + 1);
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    }
  };
  console.log(comments[0]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ m: 'auto' }}>댓글</DialogTitle>
      <Container>
        {comments.length === 0 ? (
          <span>댓글이 없습니다.</span>
        ) : (
          <div>
            {comments.map(comment => (
              <div key={comment.id} className="margin">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      src={vegeType[comment.vege_type]}
                      alt={comment.nickname}
                      sx={{ mr: 1, width: 24, height: 24 }}
                    />
                    <h4>{comment.nickname}</h4>
                    <span>{comment.content}</span>
                    <span className="small-font">
                      {`${comment.created_at.substr(0, 4)}년` +
                        ' ' +
                        `${comment.created_at.substr(5, 2)}월` +
                        ' ' +
                        `${comment.created_at.substr(8, 2)}일`}
                    </span>
                  </Stack>
                  {userInfoId === comment.author ? (
                    <Button variant="text">삭제</Button>
                  ) : (
                    <Button disabled />
                  )}
                </Stack>
              </div>
            ))}
          </div>
        )}
        <Stack direction="row" alignItems="center" sx={{ mt: 3, mb: 3 }}>
          <SendIcon sx={{ fs: 'large', mr: 2 }} />
          <Input
            sx={{ width: '90%' }}
            placeholder="댓글을 입력해주세요."
            onChange={event => setCommentData(event.target.value)}
            onKeyUp={event => handleSubmit(event)}
          />
        </Stack>
      </Container>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.number,
      content: PropTypes.string,
      created_at: PropTypes.string,
      id: PropTypes.number,
      is_like: PropTypes.bool,
      like_cnt: PropTypes.number,
      nickname: PropTypes.string,
      parent: PropTypes.number,
      updated_at: PropTypes.string,
    }),
  ),
  nowFeedId: PropTypes.number,
  setUseUpdate: PropTypes.func,
  userInfoId: PropTypes.number,
  vegeType: PropTypes.objectOf(PropTypes.string),
}.isRequired;

function Feed({ feed, setNeedUpdate }) {
  const [isLike, setIsLike] = useState(feed.is_like);
  const [isSetting, setIsSetting] = useState(false);
  const [isFeedTrans, setIsFeedTrans] = useState(false);
  const [feedTrans, setFeedTrans] = useState('');
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [commentData, setCommentData] = useState('');
  const [useUpdate, setUseUpdate] = useState(1);
  const vegeType = {
    1: vegan,
    2: lacto,
    3: ovo,
    4: lactoOvo,
    5: pesco,
    6: polo,
  };
  const userInfo = useUserInfo();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLike = feedId => {
    postFeedLike(feedId);
    setIsLike(!isLike);
  };
  useEffect(() => {
    const FeedTrans = async () => {
      const resData = await getFeedTrans(feed.id);
      setFeedTrans(resData);
    };
    FeedTrans();
    const getComments = async () => {
      const resData = await getCommentList(feed.id);
      setComments(resData);
    };
    getComments();
  }, [useUpdate]);
  const handleSetiing = () => {
    setIsSetting(!isSetting);
  };
  const handleSubmit = event => {
    if (event.keyCode === 13 && commentData.length > 0) {
      const feedId = feed.id;
      const data = { content: commentData };
      createComment({ feedId, data });
      setUseUpdate(prev => prev + 1);
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    }
  };
  return (
    <Card sx={{ mb: 7, width: 500, position: 'relative' }}>
      <CardHeader
        avatar={
          <Avatar src={vegeType[feed.vege_type]} alt={feed.author.nickname} />
        }
        action={
          feed.author.id === userInfo.id ? (
            <IconButton>
              <MoreVertIcon onClick={handleSetiing} />
            </IconButton>
          ) : (
            <div />
          )
        }
        title={<h4>{feed.author.nickname}</h4>}
        subheader={
          `${feed.created_at.substr(0, 4)}년` +
          ' ' +
          `${feed.created_at.substr(5, 2)}월` +
          ' ' +
          `${feed.created_at.substr(8, 2)}일`
        }
      />
      {isSetting ? (
        <Setting>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="수정" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="삭제"
                  onClick={() => {
                    deleteFeed(feed.id);
                    setNeedUpdate(prev => prev + 1);
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Setting>
      ) : (
        <div />
      )}

      <CardMedia>
        <FeedImageCarousel props={feed.img_paths} />
      </CardMedia>
      <CardActions disableSpacing>
        <IconButton
          onClick={() => {
            handleLike(feed.id);
          }}
        >
          {isLike ? (
            <FavoriteIcon sx={{ color: red[400] }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: red[400] }} />
          )}
        </IconButton>
        <IconButton onClick={handleClickOpen}>
          <InsertCommentIcon />
        </IconButton>
      </CardActions>
      <CardContent>
        {isFeedTrans ? (
          <Typography variant="body2" color="text.secondary">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{feedTrans.content_trans}</span>
              <Trans onClick={() => setIsFeedTrans(!isFeedTrans)}>
                원문보기
              </Trans>
            </Stack>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{feed.content}</span>
              <Trans onClick={() => setIsFeedTrans(!isFeedTrans)}>
                번역보기
              </Trans>
            </Stack>
          </Typography>
        )}
        {comments.length >= 2 ? (
          <div>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1, mb: 1 }}
            >
              <Stack direction="row" alignItems="center">
                <Avatar
                  src={vegeType[comments[0].vege_type]}
                  alt={comments[0].nickname}
                  sx={{ mr: 1, width: 24, height: 24 }}
                />
                <h4>{comments[0].nickname}</h4>
                <span>{comments[0].content}</span>
                <span className="small-font">
                  {`${comments[0].created_at.substr(0, 4)}년` +
                    ' ' +
                    `${comments[0].created_at.substr(5, 2)}월` +
                    ' ' +
                    `${comments[0].created_at.substr(8, 2)}일`}
                </span>
              </Stack>
              {userInfo.id === comments[0].author ? (
                <Button variant="text">삭제</Button>
              ) : (
                <Button disabled />
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" alignItems="center">
                <Avatar
                  src={vegeType[comments[1].vege_type]}
                  alt={comments[1].nickname}
                  sx={{ mr: 1, width: 24, height: 24 }}
                />
                <h4>{comments[1].nickname}</h4>
                <span>{comments[1].content}</span>
                <span className="small-font">
                  {`${comments[1].created_at.substr(0, 4)}년` +
                    ' ' +
                    `${comments[1].created_at.substr(5, 2)}월` +
                    ' ' +
                    `${comments[1].created_at.substr(8, 2)}일`}
                </span>
              </Stack>
              {userInfo.id === comments[1].author ? (
                <Button variant="text">삭제</Button>
              ) : (
                <Button disabled />
              )}
            </Stack>
          </div>
        ) : (
          <div />
        )}
        <Stack direction="row" alignItems="center" sx={{ mt: 3 }}>
          <SendIcon sx={{ fs: 'large', mr: 2 }} />
          <Input
            sx={{ width: '90%' }}
            placeholder="댓글을 입력해주세요."
            onChange={event => setCommentData(event.target.value)}
            onKeyUp={event => handleSubmit(event)}
          />
        </Stack>
      </CardContent>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        comments={comments}
        nowFeedId={feed.id}
        setUseUpdate={setUseUpdate}
        userInfoId={userInfo.id}
        vegeType={vegeType}
      />
    </Card>
  );
}

Feed.propTypes = {
  setNeedUpdate: PropTypes.func.isRequired,
  feed: PropTypes.shape({
    author: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
      vege_type: PropTypes.number,
    }),
    category: PropTypes.number,
    content: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.number,
    img_paths: PropTypes.shape({ img_path: PropTypes.string }),
    is_like: PropTypes.bool,
    like_cnt: PropTypes.number,
    restaurant: PropTypes.shape({
      call: PropTypes.string,
      category: PropTypes.number,
      id: PropTypes.number,
      is_like: PropTypes.bool,
      res_info: PropTypes.objectOf(PropTypes.string),
      score: PropTypes.string,
    }),
    score: PropTypes.number,
    updated_at: PropTypes.string,
    vege_type: PropTypes.number,
  }),
}.isRequired;

export default Feed;
