import { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { orange, grey } from '@mui/material/colors';
import ParkIcon from '@mui/icons-material/Park';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ScaleIcon from '@mui/icons-material/Scale';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import AdjustIcon from '@mui/icons-material/Adjust';
import { createFeed } from '../api/community';

const Form = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-top: 1rem;
  }

  .input-label {
    margin-bottom: 1rem;
  }

  .submit-btn {
    position: fixed;
    left: 1rem;
    bottom: 5rem;
    width: 90%;
    color: #fff;
    font-weight: 600;
    background-color: #fcb448;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 0;
  }
`;

function CommunityForm() {
  const [category, setCategory] = useState(0);
  const [content, setContent] = useState('');
  const [vegeType, setVegeType] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [imgs, setImgs] = useState(null);
  const [isCategoryClick, setIsCategoryClick] = useState(0);
  const [isVegeTypeClick, setIsVegeTypeClick] = useState(0);
  function handleSubmit() {
    if (category === 0 || !content || !imgs) {
      alert('입력하지 않은 정보가 있습니다.');
      return;
    }
    const formData = new FormData();
    formData.append('category', category);
    formData.append('content', content);
    formData.append('vege_type', vegeType);
    formData.append('retaurant_id', restaurantId);
    for (let i = 0; i < imgs.length; i += 1) {
      formData.append('img_path', imgs[i]);
    }
    formData.append('enctype', 'multipart/form-data');
    createFeed(formData);
  }
  useEffect(() => {
    setRestaurantId(1);
  }, []);

  return (
    <Form>
      <label htmlFor="category">카테고리</label>
      <Stack direction="row" spacing={3}>
        <Stack direction="column" alignItems="center">
          {isCategoryClick === 1 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsCategoryClick(0);
                setCategory(0);
              }}
            >
              <ParkIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsCategoryClick(1);
                setCategory(1);
              }}
            >
              <ParkIcon />
            </Avatar>
          )}
          <p>일상</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isCategoryClick === 2 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsCategoryClick(0);
                setCategory(0);
              }}
            >
              <LocalDiningIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsCategoryClick(2);
                setCategory(2);
              }}
            >
              <LocalDiningIcon />
            </Avatar>
          )}
          <p>식당</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isCategoryClick === 3 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsCategoryClick(0);
                setCategory(0);
              }}
            >
              <RoomServiceIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsCategoryClick(3);
                setCategory(3);
              }}
            >
              <RoomServiceIcon />
            </Avatar>
          )}
          <p>제품</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isCategoryClick === 4 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsCategoryClick(0);
                setCategory(0);
              }}
            >
              <ScaleIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsCategoryClick(4);
                setCategory(4);
              }}
            >
              <ScaleIcon />
            </Avatar>
          )}
          <p>레시피</p>
        </Stack>
      </Stack>
      <label htmlFor="vege_type">채식 타입</label>
      <Stack direction="row" spacing={3}>
        <Stack direction="column" alignItems="center">
          {isVegeTypeClick === 1 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsVegeTypeClick(0);
                setVegeType(0);
              }}
            >
              <AdjustIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsVegeTypeClick(1);
                setVegeType(1);
              }}
            >
              <AdjustIcon />
            </Avatar>
          )}
          <p>비건</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isVegeTypeClick === 2 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsVegeTypeClick(0);
                setVegeType(0);
              }}
            >
              <AdjustIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsVegeTypeClick(2);
                setVegeType(2);
              }}
            >
              <AdjustIcon />
            </Avatar>
          )}
          <p>락토</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isVegeTypeClick === 3 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsVegeTypeClick(0);
                setVegeType(0);
              }}
            >
              <AdjustIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsVegeTypeClick(3);
                setVegeType(3);
              }}
            >
              <AdjustIcon />
            </Avatar>
          )}
          <p>오보</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isVegeTypeClick === 4 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsVegeTypeClick(0);
                setVegeType(0);
              }}
            >
              <AdjustIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsVegeTypeClick(4);
                setVegeType(4);
              }}
            >
              <AdjustIcon />
            </Avatar>
          )}
          <p>락토오보</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isVegeTypeClick === 5 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsVegeTypeClick(0);
                setVegeType(0);
              }}
            >
              <AdjustIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsVegeTypeClick(5);
                setVegeType(5);
              }}
            >
              <AdjustIcon />
            </Avatar>
          )}
          <p>페스코</p>
        </Stack>
        <Stack direction="column" alignItems="center">
          {isVegeTypeClick === 6 ? (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: orange[300] }}
              onClick={() => {
                setIsVegeTypeClick(0);
                setVegeType(0);
              }}
            >
              <AdjustIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: grey[300] }}
              onClick={() => {
                setIsVegeTypeClick(6);
                setVegeType(6);
              }}
            >
              <AdjustIcon />
            </Avatar>
          )}
          <p>폴로</p>
        </Stack>
      </Stack>
      <label htmlFor="img_path">사진</label>
      <input
        type="file"
        multiple="multiple"
        className="imgInput"
        id="logoImg"
        accept="image/*"
        name="file"
        onChange={event => setImgs(event.target.files)}
      />
      <label htmlFor="content">내용</label>
      <TextField
        id="content"
        name="content"
        value={content}
        onChange={e => setContent(e.target.value)}
        // disabled={!!isForUpdate}
        placeholder="내용을 입력해주세요."
        multiline
        minRows="5"
        margin="normal"
        variant="outlined"
      />
      <button
        type="button"
        className="submit-btn"
        onClick={() => handleSubmit()}
      >
        작성
      </button>
    </Form>
  );
}

export default CommunityForm;
