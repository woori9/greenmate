import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import getFeedList from '../../api/community';

const CommentMore = styled(props => {
  const { expand, ...other } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Feeds() {
  const [feeds, setFeeds] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    const getFeeds = async () => {
      const resData = await getFeedList();
      setFeeds(resData);
    };
    getFeeds();
  }, []);
  console.log(feeds);
  return (
    <Card sx={{ maxWidth: 345 }}>
      {feeds.map(feed => (
        <>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: green[200] }} aria-label="recipe">
                Icon
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={feeds.length && feed.author.nickname}
            subheader={
              `${feeds.length && feed.created_at.substr(0, 4)}년` +
              ' ' +
              `${feeds.length && feed.created_at.substr(5, 2)}월` +
              ' ' +
              `${feeds.length && feed.created_at.substr(8, 2)}일`
            }
          />
          <CardMedia
            component="img"
            height="194"
            image={
              feeds.length &&
              feed.img_paths.length &&
              feed.img_paths[0].img_path
            }
            alt="사진"
          />
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Comment">
              <CommentMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <CommentIcon />
              </CommentMore>
            </IconButton>
          </CardActions>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {feeds.length && feed.content}
            </Typography>
          </CardContent>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and.
              </Typography>
            </CardContent>
          </Collapse>
        </>
      ))}
    </Card>
  );
}

export default Feeds;
