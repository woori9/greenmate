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
import GoBackBar from '../components/common/GoBackBar';

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
  const [imgs, setImgs] = useState('');

  function handleSubmit() {
    if (!category || !content || !imgs) {
      alert('입력하지 않은 정보가 있습니다.');
      return;
    }
    createFeed({
      category,
      content,
      vege_type: vegeType,
      restaurantId,
      img_path: imgs,
    });
  }
  useEffect(() => {
    setCategory(1);
    setVegeType(1);
    setRestaurantId(1);
    setImgs();
  }, []);

  return (
    <>
      <GoBackBar title="피드 쓰기" />
      <Form>
        <label htmlFor="category">카테고리</label>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: orange[300] }}>
              <ParkIcon />
            </Avatar>
            <p>일상</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: orange[300] }}>
              <LocalDiningIcon />
            </Avatar>
            <p>식당</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: orange[300] }}>
              <RoomServiceIcon />
            </Avatar>
            <p>제품</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: orange[300] }}>
              <ScaleIcon />
            </Avatar>
            <p>레시피</p>
          </Stack>
        </Stack>
        <label htmlFor="vege_type">채식 타입</label>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: grey[300] }}>
              <AdjustIcon />
            </Avatar>
            <p>비건</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: grey[300] }}>
              <AdjustIcon />
            </Avatar>
            <p>락토</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: grey[300] }}>
              <AdjustIcon />
            </Avatar>
            <p>오보</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: grey[300] }}>
              <AdjustIcon />
            </Avatar>
            <p>락토오보</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: grey[300] }}>
              <AdjustIcon />
            </Avatar>
            <p>페스코</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar sx={{ bgcolor: grey[300] }}>
              <AdjustIcon />
            </Avatar>
            <p>폴로</p>
          </Stack>
        </Stack>
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
    </>
  );
}

export default CommunityForm;
