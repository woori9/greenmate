import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { getCommentTrans, postCommentLike } from '../../api/community';
import vegan from '../../assets/vegan-icon.png';
import lacto from '../../assets/lacto-icon.png';
import ovo from '../../assets/ovo-icon.png';
import lactoOvo from '../../assets/lacto-ovo-icon.png';
import pesco from '../../assets/pesco-icon.png';
import polo from '../../assets/polo-icon.png';
import flexi from '../../assets/flexi-icon.png';

const Trans = styled.div`
  cursor: pointer;
  font-size: 5px;
  color: lightgrey;
`;
const GoProfile = styled.div`
  position: absolute;
  z-index: 1;
  width: 30%;
  background-color: #fff;
  border-radius: 10px;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;
const DateFont = styled.span`
  font-size: 8px;
  color: grey;
  font-weight: bold;
`;
const NicknameFont = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;
const ContentFont = styled.span`
  font-size: 13px;
`;
const DeleteButton = styled.button`
  padding-right: 0;
  font-size: 10px;
  background-color: #fff;
  border: none;
  cursor: pointer;
  color: red;

  :hover {
    color: #fcb448;
  }
`;
const CntNum = styled.span`
  margin-left: -5px;
  font-size: 12px;
  color: lightgrey;
  font-weight: bold;
`;
const Hr = styled.hr`
  border-top: solid 1px #f2f2f2;
  border-bottom: none;
  border-left: none;
  border-right: none;
`;

function CommentDetail({
  commentVegeType,
  commentNickname,
  commentId,
  commentContent,
  commentIsLike,
  commentLikeCnt,
  commentAuthor,
  commentCreateAt,
  userInfoId,
}) {
  const [commentTrans, setCommentTrans] = useState([]);
  const [isTrans, setIsTrans] = useState(false);
  const [isLike, setIsLike] = useState(commentIsLike);
  const [likeCnt, setLikeCnt] = useState(commentLikeCnt);
  const [isGoProfile, setIsGoPropfile] = useState(false);
  const navigate = useNavigate();
  const vegeType = {
    1: vegan,
    2: lacto,
    3: ovo,
    4: lactoOvo,
    5: pesco,
    6: polo,
    7: flexi,
  };
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
        <Stack sx={{ mt: 1, mb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center">
              <Avatar
                src={vegeType[commentVegeType + 1]}
                alt={commentNickname}
                sx={{ mr: 1, width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => {
                  setIsGoPropfile(!isGoProfile);
                }}
              />
              <NicknameFont>{commentNickname}</NicknameFont>
            </Stack>
            <Stack direction="row" alignItems="center">
              <DateFont>
                {`${commentCreateAt.substr(5, 2)}월` +
                  ' ' +
                  `${commentCreateAt.substr(8, 2)}일`}
              </DateFont>
              {userInfoId === commentAuthor ? (
                <DeleteButton>삭제</DeleteButton>
              ) : (
                <div />
              )}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pl: '24px' }}
          >
            <ContentFont>{commentTrans}</ContentFont>
            <Stack direction="row" alignItems="center">
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
                  <FavoriteBorderIcon
                    sx={{ fontSize: 'small', color: red[400] }}
                  />
                )}
              </IconButton>
              <CntNum>{likeCnt}</CntNum>
            </Stack>
          </Stack>
          <Hr />
        </Stack>
      ) : (
        <Stack sx={{ mt: 1, mb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center">
              <Avatar
                src={vegeType[commentVegeType + 1]}
                alt={commentNickname}
                sx={{ mr: 1, width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => {
                  setIsGoPropfile(!isGoProfile);
                }}
              />
              <NicknameFont>{commentNickname}</NicknameFont>
            </Stack>
            <Stack direction="row" alignItems="center">
              <DateFont>
                {`${commentCreateAt.substr(5, 2)}월` +
                  ' ' +
                  `${commentCreateAt.substr(8, 2)}일`}
              </DateFont>
              {userInfoId === commentAuthor ? (
                <DeleteButton>삭제</DeleteButton>
              ) : (
                <div />
              )}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pl: '24px' }}
          >
            <ContentFont>{commentContent}</ContentFont>
            <Stack direction="row" alignItems="center">
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
                  <FavoriteBorderIcon
                    sx={{ fontSize: 'small', color: red[400] }}
                  />
                )}
              </IconButton>
              <CntNum>{likeCnt}</CntNum>
            </Stack>
          </Stack>
          <Hr />
        </Stack>
      )}
      {isGoProfile ? (
        <GoProfile>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/mypage/${commentAuthor}`)}
              >
                <ListItemText primary="프로필 보기" />
              </ListItemButton>
            </ListItem>
          </List>
        </GoProfile>
      ) : (
        <div />
      )}
    </div>
  );
}

CommentDetail.propTypes = {
  commentVegeType: PropTypes.number.isRequired,
  commentNickname: PropTypes.string.isRequired,
  commentId: PropTypes.number.isRequired,
  commentContent: PropTypes.string.isRequired,
  commentIsLike: PropTypes.bool.isRequired,
  commentLikeCnt: PropTypes.number.isRequired,
  commentAuthor: PropTypes.number.isRequired,
  commentCreateAt: PropTypes.string.isRequired,
  userInfoId: PropTypes.number.isRequired,
};

export default CommentDetail;
