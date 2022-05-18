import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
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
import useUserInfo from '../hooks/useUserInfo';
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
    width: 150px;
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
    width: 2.5rem;
    height: 2.5rem;
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
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [originalFeedId, setOriginalFeedId] = useState();
  const [rating, setRating] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useUserInfo();

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
      if (category === 2) {
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
      {width > 1024 ? (
        <DesktopNavbar />
      ) : (
        <GoBackBar
          title={userInfo.language === 0 ? '글 작성하기' : 'Write a post'}
        />
      )}
      <Form>
        {width > 1024 && (
          <h1 className="form-title">
            {userInfo.language === 0 ? '글 작성하기' : 'Write a post'}
          </h1>
        )}
        <label className="input-file-button" htmlFor="input-file">
          {userInfo.language === 0 ? '사진 추가' : 'Upload photos'}
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
        {imgs && (
          <p>
            {imgs.length}
            {userInfo.language === 0
              ? '개의 사진 업로드'
              : ' photos are uploaded'}
          </p>
        )}
        <label htmlFor="category">
          {userInfo.language === 0 ? '카테고리' : 'Category'}
        </label>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" alignItems="center">
            <Avatar
              sx={{
                cursor: 'pointer',
                bgcolor: category === 1 ? '#fcb448' : '#a9a9a9',
              }}
              className="mouse-hover"
              onClick={() => {
                setCategory(1);
              }}
            >
              <ParkIcon />
            </Avatar>
            <p>{userInfo.language === 0 ? '일상' : 'Daily'}</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar
              sx={{
                cursor: 'pointer',
                bgcolor: category === 2 ? '#fcb448' : '#a9a9a9',
              }}
              className="mouse-hover"
              onClick={() => {
                setCategory(2);
              }}
            >
              <LocalDiningIcon />
            </Avatar>
            <p>{userInfo.language === 0 ? '식당' : 'Restaurant'}</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar
              sx={{
                cursor: 'pointer',
                bgcolor: category === 3 ? '#fcb448' : '#a9a9a9',
              }}
              className="mouse-hover"
              onClick={() => {
                setCategory(3);
              }}
            >
              <RoomServiceIcon />
            </Avatar>
            <p>{userInfo.language === 0 ? '제품' : 'Product'}</p>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Avatar
              sx={{
                cursor: 'pointer',
                bgcolor: category === 4 ? '#fcb448' : '#a9a9a9',
              }}
              onClick={() => {
                setCategory(4);
              }}
            >
              <ScaleIcon />
            </Avatar>
            <p>{userInfo.language === 0 ? '레시피' : 'Recipe'}</p>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <label htmlFor="vege_type">
            {userInfo.language === 0 ? '채식 타입' : 'Vegetarian type'}
          </label>
          <Description>
            <Info>
              {userInfo.language === 0
                ? '채식 타입 안내'
                : 'A guide to vegetarian types'}{' '}
              {'>'}
            </Info>
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
        {category === 2 ? (
          <div className="review_margin">
            <RestaurantSearchForm
              isForUpdate={isForUpdate}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              setSelectedRestaurantId={setSelectedRestaurantId}
            />
            <div className="review_margin">
              <label htmlFor="rating">
                {userInfo.language === 0 ? '평점' : 'Rating'}
              </label>
              <RatingForm rating={rating} setRating={setRating} />
            </div>
          </div>
        ) : (
          <div />
        )}
        <label htmlFor="content">
          {userInfo.language === 0 ? '내용' : 'Content'}
        </label>
        <TextField
          id="content"
          name="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          // disabled={!!isForUpdate}
          placeholder={
            userInfo.language === 0
              ? '내용을 입력해주세요.'
              : 'Please enter the contents.'
          }
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
          {userInfo.language === 0 ? '작성' : 'Submit'}
        </button>
      </Form>
    </Container>
  );
}

export default CommunityForm;
