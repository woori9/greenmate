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
import Button from '@mui/material/Button';
import FeedImageCarousel from './FeedIamgeCarousel';
import {
  postLike,
  getFeedTrans,
  getCommentList,
  deleteFeed,
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
  left: 500px;
  z-index: 1;
  width: 10%;
  background-color: #fff;
  border-radius: 10px;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;

function SimpleDialog(props) {
  const { onClose, open, comments } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ m: 'auto' }}>댓글</DialogTitle>
      {comments.length === 0 ? (
        <span>댓글이 없습니다.</span>
      ) : (
        <div>
          {comments.map(comment => (
            <div key={comment.id}>
              <Avatar>{comment.nickname}</Avatar>
              <p>{comment.nickname}</p>
              <p>
                {`${comment.created_at.substr(0, 4)}년` +
                  ' ' +
                  `${comment.created_at.substr(5, 2)}월` +
                  ' ' +
                  `${comment.created_at.substr(8, 2)}일`}
              </p>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
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
}.isRequired;

function Feed({ feed }) {
  const [expanded, setExpanded] = useState(false);
  const [isLike, setIsLike] = useState(feed.is_like);
  const [isSetting, setIsSetting] = useState(false);
  const [isTrans, setIsTrans] = useState(false);
  const [feedTrans, setFeedTrans] = useState('');
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
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
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleLike = feedId => {
    postLike(feedId);
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
  }, []);
  const handleSetiing = () => {
    setIsSetting(!isSetting);
  };
  return (
    <Card sx={{ mb: 7, maxWidth: 500 }}>
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
        title={feed.author.nickname}
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
        <IconButton onClick={handleExpandClick}>
          <InsertCommentIcon />
        </IconButton>
      </CardActions>
      <CardContent>
        {isTrans ? (
          <Typography variant="body2" color="text.secondary">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{feedTrans.content_trans}</span>
              <Trans onClick={() => setIsTrans(!isTrans)}>원문보기</Trans>
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
              <Trans onClick={() => setIsTrans(!isTrans)}>번역보기</Trans>
            </Stack>
          </Typography>
        )}
        <Button variant="text" onClick={handleClickOpen}>
          더보기
        </Button>
        <Input />
      </CardContent>
      <SimpleDialog open={open} onClose={handleClose} comments={comments} />
    </Card>
  );
}

Feed.propTypes = {
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
