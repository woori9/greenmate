import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, green } from '@mui/material/colors';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Comment from './Comment';
import FeedImageCarousel from './FeedIamgeCarousel';
import { postLike } from '../../api/community';

function Feed({ feed }) {
  const [expanded, setExpanded] = useState(false);
  const [isLike, setIsLike] = useState(feed.is_like);
  const [isSetting, setIsSetting] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleLike = feedId => {
    postLike(feedId);
    setIsLike(!isLike);
  };
  const handleSetiing = () => {
    setIsSetting(!isSetting);
  };
  console.log(feed);
  return (
    <Card sx={{ mb: 5, maxWidth: 1024 }}>
      <CardHeader
        // TODO: user의 vegeType에 따라서 이미지 바꿔주기
        avatar={
          <Avatar sx={{ bgcolor: green[200] }} aria-label="recipe">
            Icon
          </Avatar>
        }
        // TODO: 수정/삭제 기능 넣기
        action={
          <IconButton>
            <MoreVertIcon onClick={handleSetiing} />
          </IconButton>
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
      <Collapse in={isSetting}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
        >
          <nav aria-label="secondary mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Trash" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#simple-list">
                  <ListItemText primary="Spam" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
      </Collapse>
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
            <FavoriteBorderIcon sx={{ color: red[400] }} />
          ) : (
            <FavoriteIcon sx={{ color: red[400] }} />
          )}
        </IconButton>
        <IconButton onClick={handleExpandClick}>
          <InsertCommentIcon />
        </IconButton>
      </CardActions>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {feed.content}
        </Typography>
      </CardContent>
      <Collapse in={expanded}>
        <Comment feedId={feed.id} />
      </Collapse>
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
