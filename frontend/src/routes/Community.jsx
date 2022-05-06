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
import { red, purple } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import getFeedList from '../api/community';

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

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

function Community() {
  const [category, setCategory] = useState('');
  const [vegeType, setVegeType] = useState('');
  const [feeds, setFeeds] = useState([]);
  const handleCategoryChange = event => {
    setCategory(event.target.value);
  };
  const handleVegeTypeChange = event => {
    setVegeType(event.target.value);
  };
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

  return (
    <>
      <div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="category">카테고리</InputLabel>
          <Select
            labelId="category"
            id="standard"
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value={0}>전체</MenuItem>
            <MenuItem value={1}>일상</MenuItem>
            <MenuItem value={2}>식당</MenuItem>
            <MenuItem value={3}>제품</MenuItem>
            <MenuItem value={4}>레시피</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="vegeType">채식 타입</InputLabel>
          <Select
            labelId="vegeType"
            id="vegeType"
            value={vegeType}
            onChange={handleVegeTypeChange}
            label="vegeType"
          >
            <MenuItem value={0}>전체</MenuItem>
            <MenuItem value={1}>비건</MenuItem>
            <MenuItem value={2}>락토</MenuItem>
            <MenuItem value={3}>오보</MenuItem>
            <MenuItem value={4}>락토 오보</MenuItem>
            <MenuItem value={5}>페스코</MenuItem>
            <MenuItem value={6}>폴로</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardMedia
          component="img"
          height="194"
          image="/static/images/cards/paella.jpg"
          alt="사진"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            내용
          </Typography>
        </CardContent>
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
      </Card>
      <Stack spacing={2} direction="row">
        <ColorButton variant="contained">Custom CSS</ColorButton>
      </Stack>
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim={false} />
      <p>{feeds.length && feeds[0].content}</p>
    </>
  );
}

export default Community;
