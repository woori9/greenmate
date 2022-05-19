import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
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
import flexi from '../../assets/flexi-icon.png';
import useUserInfo from '../../hooks/useUserInfo';
import CommentDetail from './CommentDetail';

const Trans = styled.div`
  cursor: pointer;
  font-size: 5px;
  color: lightgrey;
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
  const { onClose, open, comments, nowFeedId, setUseUpdate, userInfoId } =
    props;
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

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { width: '80%', height: '60%' } }}
    >
      <DialogTitle sx={{ m: '0 auto' }}>댓글</DialogTitle>
      <Container>
        {!comments ? (
          <span>댓글이 없습니다.</span>
        ) : (
          <div>
            {comments.map(comment => (
              <div key={comment.id} className="margin">
                <CommentDetail
                  commentVegeType={comment.vege_type}
                  commentNickname={comment.nickname}
                  commentId={comment.id}
                  commentContent={comment.content}
                  commentIsLike={comment.is_like}
                  commentLikeCnt={comment.like_cnt}
                  commentAuthor={comment.author}
                  commentCreateAt={comment.created_at}
                  userInfoId={userInfoId}
                />
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
}.isRequired;

const CntNum = styled.span`
  margin-left: -5px;
  font-size: 12px;
  color: lightgrey;
  font-weight: bold;
`;

const DateFont = styled.span`
  font-size: 8px;
  color: grey;
  font-weight: bold;
`;

const FeedContent = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
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

const GoProfile = styled.div`
  position: absolute;
  z-index: 1;
  width: 25%;
  background-color: #fff;
  border-radius: 10px;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;
const NicknameFont = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;
const ContentFont = styled.span`
  font-size: 13px;
`;
// const DeleteButton = styled.button`
//   background-color: #fff;
//   border: none;
//   cursor: pointer;
//   color: red;

//   :hover {
//     color: #fcb448;
//   }
// `;

function Feed({ feed }) {
  const [isLike, setIsLike] = useState(feed.is_like);
  const [likeCnt, setLikeCnt] = useState(feed.like_cnt);
  const [isSetting, setIsSetting] = useState(false);
  const [isFeedTrans, setIsFeedTrans] = useState(false);
  const [feedTrans, setFeedTrans] = useState('');
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [commentData, setCommentData] = useState('');
  const [useUpdate, setUseUpdate] = useState(0);
  const [isGoProfile, setIsGoPropfile] = useState(false);
  const vegeType = {
    1: vegan,
    2: lacto,
    3: ovo,
    4: lactoOvo,
    5: pesco,
    6: polo,
    7: flexi,
  };

  const userInfo = useUserInfo();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLike = feedId => {
    postFeedLike(feedId);
    if (isLike) {
      setLikeCnt(prev => prev - 1);
    } else {
      setLikeCnt(prev => prev + 1);
    }
    setIsLike(!isLike);
  };

  const handleSubmit = event => {
    if (event.keyCode === 13 && commentData.length > 0) {
      const feedId = feed.id;
      const data = { content: commentData };
      createComment({ feedId, data }).then(() =>
        setUseUpdate(prev => prev + 1),
      );
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    }
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
    setIsSetting(prev => !prev);
  };

  return (
    <Card sx={{ mb: 7, maxWidth: 500, position: 'relative' }}>
      <CardHeader
        avatar={
          <Avatar src={vegeType[feed.vege_type]} alt={feed.author.nickname} />
        }
        action={
          feed.author.id === userInfo.id ? (
            <IconButton onClick={() => handleSetiing()}>
              <MoreVertIcon />
            </IconButton>
          ) : (
            <div />
          )
        }
        title={
          <Stack direction="row" alignItems="center">
            <Avatar
              src={vegeType[feed.author.vege_type + 1]}
              alt={feed.author.nickname}
              onClick={() => {
                setIsGoPropfile(!isGoProfile);
              }}
              sx={{ width: 24, height: 24, mr: 1, cursor: 'pointer' }}
            />
            <h4>{feed.author.nickname}</h4>
          </Stack>
        }
        subheader={
          <DateFont>
            {feed.created_at.substr(0, 4)}년 {feed.created_at.substr(5, 2)}월{' '}
            {feed.created_at.substr(8, 2)}일
          </DateFont>
        }
      />
      {isSetting ? (
        <Setting>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="수정"
                  onClick={() => {
                    navigate('/community/form', {
                      state:
                        feed.category === 2
                          ? {
                              feedId: feed.id,
                              originalCategory: feed.category,
                              originalContent: feed.content,
                              originalVegeType: feed.vege_type,
                              originalImgs: feed.img_paths,
                              restaurantId: feed.restaurant.id,
                              restaurantName: feed.restaurant.res_info.name,
                              restaurantRating: parseInt(
                                feed.restaurant.score,
                                10,
                              ),
                            }
                          : {
                              feedId: feed.id,
                              originalCategory: feed.category,
                              originalContent: feed.content,
                              originalVegeType: feed.vege_type,
                              originalImgs: feed.img_paths,
                            },
                    });
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary="삭제"
                  onClick={() => {
                    deleteFeed(feed.id);
                    alert('삭제가 완료되었습니다!');
                    window.location.replace('/community');
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Setting>
      ) : (
        <div />
      )}
      {isGoProfile ? (
        <GoProfile>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/mypage/${feed.author.id}`)}
              >
                <ListItemText primary="프로필 보기" />
              </ListItemButton>
            </ListItem>
          </List>
        </GoProfile>
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
        <CntNum>{likeCnt}</CntNum>
        <IconButton onClick={handleClickOpen}>
          <InsertCommentIcon />
        </IconButton>
        <CntNum>{comments ? comments.length : 0}</CntNum>
      </CardActions>
      <CardContent>
        {isFeedTrans ? (
          <div>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <FeedContent>{feedTrans.content_trans}</FeedContent>
              <Trans onClick={() => setIsFeedTrans(!isFeedTrans)}>
                원문보기
              </Trans>
            </Stack>
          </div>
        ) : (
          <div>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <FeedContent>{feed.content}</FeedContent>
              <Trans onClick={() => setIsFeedTrans(!isFeedTrans)}>
                번역보기
              </Trans>
            </Stack>
          </div>
        )}
      </CardContent>
      <CardContent>
        {comments && comments.length === 1 ? (
          <Stack sx={{ mt: 1, mb: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" alignItems="center">
                <Avatar
                  src={vegeType[comments[0].vege_type + 1]}
                  alt={comments[0].nickname}
                  sx={{ mr: 0.5, width: 24, height: 24 }}
                />
                <NicknameFont>{comments[0].nickname}</NicknameFont>
              </Stack>
              <Stack direction="row" alignItems="center">
                <DateFont>
                  {`${comments[0].created_at.substr(5, 2)}월` +
                    ' ' +
                    `${comments[0].created_at.substr(8, 2)}일`}
                </DateFont>
                {/* {userInfo.id === comments[0].author ? (
                  <DeleteButton>삭제</DeleteButton>
                ) : (
                  <div />
                )} */}
              </Stack>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ pl: '24px' }}
            >
              <ContentFont>{comments[0].content}</ContentFont>
            </Stack>
          </Stack>
        ) : (
          <div />
        )}
        {comments && comments.length >= 2 && (
          <div>
            <Stack sx={{ mt: 1, mb: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center">
                  <Avatar
                    src={vegeType[comments[0].vege_type + 1]}
                    alt={comments[0].nickname}
                    sx={{ mr: 0.5, width: 24, height: 24 }}
                  />
                  <NicknameFont>{comments[0].nickname}</NicknameFont>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <DateFont>
                    {`${comments[0].created_at.substr(5, 2)}월` +
                      ' ' +
                      `${comments[0].created_at.substr(8, 2)}일`}
                  </DateFont>
                  {/* {userInfo.id === comments[0].author ? (
                    <DeleteButton>삭제</DeleteButton>
                  ) : (
                    <div />
                  )} */}
                </Stack>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ pl: '24px' }}
              >
                <ContentFont>{comments[0].content}</ContentFont>
              </Stack>
            </Stack>
            <Stack sx={{ mt: 1, mb: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center">
                  <Avatar
                    src={vegeType[comments[1].vege_type + 1]}
                    alt={comments[1].nickname}
                    sx={{ mr: 0.5, width: 24, height: 24 }}
                  />
                  <NicknameFont>{comments[1].nickname}</NicknameFont>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <DateFont>
                    {`${comments[1].created_at.substr(5, 2)}월` +
                      ' ' +
                      `${comments[1].created_at.substr(8, 2)}일`}
                  </DateFont>
                  {/* {userInfo.id === comments[1].author ? (
                    <DeleteButton>삭제</DeleteButton>
                  ) : (
                    <div />
                  )} */}
                </Stack>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ pl: '24px' }}
              >
                <ContentFont>{comments[1].content}</ContentFont>
              </Stack>
            </Stack>
          </div>
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
  feed: PropTypes.shape({
    author: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
      vege_type: PropTypes.number,
    }),
    category: PropTypes.number,
    comment_cnt: PropTypes.number,
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
