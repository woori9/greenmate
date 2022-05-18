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
import { createFeed, updateFeed } from '../api/community';
import RestaurantSearchForm from '../components/common/RestaurantSearchForm';
import RatingForm from '../components/community/RatingForm';
import VegeTypeInform from '../components/common/VegeTypeInform';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import GoBackBar from '../components/common/GoBackBar';
import useWindowDimensions from '../utils/windowDimension';
import vegeTypeList from '../utils/vegeTypeList';

const { check } = require('korcen');

const Container = styled.div`
  padding: 5rem 1rem 5rem 1rem;
  max-width: 100vw;

  @media screen and (min-width: 1025px) {
    margin: 60px 17rem 0 calc(130px + 17rem);
    padding: 3rem;
    border: 1px solid #a9a9a9;
    border-radius: 5px;
  }
`;

const Form = styled.div`
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

const VegeTypeLst = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;

  @media screen and (min-width: 1025px) {
    max-width: 500px;
  }
`;

const VegeTypeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border: ${props => props.selected && '3px solid #fcb448'};
    border-radius: ${props => props.selected && '50%'};

    .vege-img {
      width: 80%;
    }
  }

  p {
    font-size: 0.9rem;
    white-space: nowrap;
    color: ${props => (props.selected ? '#fcb448' : 'black')};
  }

  @media screen and (min-width: 1200px) {
    .img-box {
      width: 4.5rem;
      height: 4.5rem;
    }
  }
`;

const Info = styled.span`
  cursor: pointer;
  color: #a9a9a9;

  :hover {
    color: #fcb448;
  }
`;

const Page = styled.div`
  position: absolute;
  right: 11%;
  background-color: #fff;
  padding: 1rem;
  border-radius: 10px;
  z-index: 6;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;

const Description = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  width: 90%;
  max-width: 33rem;
  color: #a9a9a9;

  p {
    margin: auto 0;
    font-size: 13px;
  }

  .descript-page {
    display: none;
  }

  :hover {
    cursor: pointer;
    ${Page} {
      display: block;
    }
  }
`;

function CommunityForm() {
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState(0);
  const [content, setContent] = useState('');
  const [vegeType, setVegeType] = useState(null);
  const [imgs, setImgs] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCategoryClick, setIsCategoryClick] = useState(0);
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
      }
    }
  }, []);

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
    formData.append('vege_type', vegeType + 1);
    formData.append('retaurant_id', selectedRestaurantId);
    for (let i = 0; i < imgs.length; i += 1) {
      formData.append('img_path', imgs[i]);
    }
    formData.append('enctype', 'multipart/form-data');

    if (isForUpdate) {
      updateFeed(originalFeedId, formData).then(() => navigate('/community'));
    } else {
      createFeed(formData).then(() => navigate('/community'));
    }
  }

  return (
    <Container>
      {width > 1024 ? <DesktopNavbar /> : <GoBackBar title="글 작성하기" />}
      <Form target="_blank">
        {width > 1024 && <h1 className="form-title">글 작성하기</h1>}
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
          <Description>
            <Info>채식 타입 안내 {'>'}</Info>
            <Page className="descript-page">
              <VegeTypeInform />
            </Page>
          </Description>
        </Stack>
        <VegeTypeLst>
          {vegeTypeList.slice(0, 6).map(type => (
            <VegeTypeBox
              key={type.id}
              selected={vegeType === type.id}
              onClick={() => {
                setVegeType(type.id);
              }}
            >
              <div className="img-box">
                <img className="vege-img" src={type.icon} alt="vege-img" />
              </div>
              <p>{type.title}</p>
            </VegeTypeBox>
          ))}
        </VegeTypeLst>
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
