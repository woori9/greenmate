import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { grey } from '@mui/material/colors';
import ParkIcon from '@mui/icons-material/Park';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ScaleIcon from '@mui/icons-material/Scale';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import AdjustIcon from '@mui/icons-material/Adjust';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { createFeed, updateFeed } from '../api/community';
import RestaurantSearchForm from '../components/common/RestaurantSearchForm';
import RatingForm from '../components/community/RatingForm';
import useWindowDimensions from '../utils/windowDimension';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import GoBackBar from '../components/common/GoBackBar';
import vegeTypeImg from '../assets/vege_type.png';
import vegan from '../assets/vegan-icon.png';
import lacto from '../assets/lacto-icon.png';
import ovo from '../assets/ovo-icon.png';
import lactoOvo from '../assets/lacto-ovo-icon.png';
import pesco from '../assets/pesco-icon.png';
import polo from '../assets/polo-icon.png';

const { check } = require('korcen');

const Container = styled.div`
  padding: 5rem 1rem 5rem 1rem;

  @media screen and (min-width: 1025px) {
    margin: 60px 17rem 0 calc(130px + 17rem);
    padding: 3rem;
    border: 1px solid #a9a9a9;
    border-radius: 5px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-top: 1rem;
  }

  .input-label {
    margin-bottom: 1rem;
  }

  .review_margin {
    margin-top: 20px;
  }

  .input-file-button {
    display: flex;
    justify-content: center;
    left: 1rem;
    bottom: 5rem;
    width: 100%;
    color: #fff;
    font-weight: 600;
    background-color: #fcb448;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 0;
    cursor: pointer;
  }

  .imgInput {
    display: none;
  }

  .submit-btn {
    width: 100%;
    color: #fff;
    font-weight: 600;
    background-color: #fcb448;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 0;
    margin-top: 1rem;
    cursor: pointer;
  }

  .mini-btn {
    width: 4.5rem;
    margin-left: auto;
  }

  .mouse-hover:hover {
    background-color: #fcb448;
  }
`;

const Info = styled.span`
  cursor: pointer;
  color: lightgrey;
  font-size: 13px;

  :hover {
    color: #fcb448;
  }
`;
function SimpleDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ m: 'auto' }}>채식 타입</DialogTitle>
      <img src={vegeTypeImg} alt="채식 단계" />
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

function CommunityForm() {
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState(0);
  const [content, setContent] = useState('');
  const [vegeType, setVegeType] = useState(null);
  const [imgs, setImgs] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCategoryClick, setIsCategoryClick] = useState(0);
  const [isVegeTypeClick, setIsVegeTypeClick] = useState(0);
  const [open, setOpen] = useState(false);
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [originalFeedId, setOriginalFeedId] = useState();
  const [rating, setRating] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      const {
        feedId,
        originalCategory,
        originalContent,
        originalVegeType,
        originalImgs,
      } = location.state;

      setIsForUpdate(true);
      setOriginalFeedId(feedId);
      setCategory(originalCategory);
      setContent(originalContent);
      setVegeType(originalVegeType);
      setImgs(originalImgs);
      if (originalCategory === 2) {
        const { restaurantId, restaurantName, restaurantRating } =
          location.state;
        setSelectedRestaurantId(restaurantId);
        setSearchKeyword(restaurantName);
        setRating(restaurantRating);
        console.log(rating);
      }
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (category === 0 || !content || !imgs) {
      if (isCategoryClick === 2) {
        if (!selectedRestaurantId) {
          alert('입력하지 않은 정보가 있습니다.');
          return;
        }
      }
      alert('입력하지 않은 정보가 있습니다.');
      return;
    }

    if (check(content)) {
      alert('욕설은 입력할 수 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('content', content);
    formData.append('vege_type', vegeType);
    formData.append('retaurant_id', selectedRestaurantId);
    for (let i = 0; i < imgs.length; i += 1) {
      formData.append('img_path', imgs[i]);
    }
    formData.append('enctype', 'multipart/form-data');
    if (isForUpdate) {
      updateFeed(originalFeedId, formData);
    } else {
      createFeed(formData);
    }
    navigate(-1);
  }

  return (
    <Container>
      {width > 1024 ? <DesktopNavbar /> : <GoBackBar title="메이트 구하기" />}
      <Form target="_blank">
        {width > 1024 && <h1 className="form-title">메이트 구하기</h1>}
        <label htmlFor="category">카테고리</label>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" alignItems="center">
            {isCategoryClick === 1 ? (
              <Avatar
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
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
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
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
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
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
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
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
                className="mouse-hover"
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <label htmlFor="vege_type">채식 타입</label>
          <Info onClick={handleClickOpen}>채식 타입 안내 {'>'}</Info>
          <SimpleDialog open={open} onClose={handleClose} />
        </Stack>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" alignItems="center">
            {isVegeTypeClick === 1 ? (
              <Avatar
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
                src={vegan}
                alt="vegan"
                onClick={() => {
                  setIsVegeTypeClick(0);
                  setVegeType(0);
                }}
              >
                <AdjustIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{ cursor: 'pointer' }}
                src={vegan}
                alt="vegan"
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
                src={lacto}
                alt="lacto"
                onClick={() => {
                  setIsVegeTypeClick(0);
                  setVegeType(0);
                }}
              >
                <AdjustIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{ cursor: 'pointer' }}
                src={lacto}
                alt="lacto"
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
                src={ovo}
                alt="ovo"
                onClick={() => {
                  setIsVegeTypeClick(0);
                  setVegeType(0);
                }}
              >
                <AdjustIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{ cursor: 'pointer' }}
                src={ovo}
                alt="ovo"
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
                src={lactoOvo}
                alt="lactoOvo"
                onClick={() => {
                  setIsVegeTypeClick(0);
                  setVegeType(0);
                }}
              >
                <AdjustIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{ cursor: 'pointer' }}
                src={lactoOvo}
                alt="lactoOvo"
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
                src={pesco}
                alt="pesco"
                onClick={() => {
                  setIsVegeTypeClick(0);
                  setVegeType(0);
                }}
              >
                <AdjustIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{ cursor: 'pointer' }}
                src={pesco}
                alt="pesco"
                className="mouse-hover"
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
                sx={{ cursor: 'pointer', bgcolor: '#fcb448' }}
                src={polo}
                alt="polo"
                onClick={() => {
                  setIsVegeTypeClick(0);
                  setVegeType(0);
                }}
              >
                <AdjustIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{ cursor: 'pointer' }}
                src={polo}
                alt="polo"
                className="mouse-hover"
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
        {isCategoryClick === 2 ? (
          <div className="review_margin">
            <RestaurantSearchForm
              isForUpdate={isForUpdate}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              setSelectedRestaurantId={setSelectedRestaurantId}
            />
            <div className="review_margin">
              <label htmlFor="rating">평점</label>
              <RatingForm rating={rating} setRating={setRating} />
            </div>
          </div>
        ) : (
          <div />
        )}
        <label className="input-file-button" htmlFor="input-file">
          사진 업로드
        </label>
        <input
          type="file"
          multiple="multiple"
          className="imgInput"
          id="input-file"
          accept="image/*"
          name="file"
          onChange={event => setImgs(event.target.files)}
        />
        {imgs && <p>{imgs.length}개의 사진 업로드</p>}
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
          className={`submit-btn ${width > 1024 && 'mini-btn'}`}
          onClick={e => handleSubmit(e)}
        >
          작성
        </button>
      </Form>
    </Container>
  );
}

export default CommunityForm;
