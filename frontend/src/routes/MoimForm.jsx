/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, useLocation } from 'react-router-dom';
import RestaurantSearchForm from '../components/common/RestaurantSearchForm';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import GoBackBar from '../components/common/GoBackBar';
import { createMoim, updateMoim } from '../api/moim';
import { timestampNextDay, timestamp1YearLater } from '../utils/timestamp';
import { createMoimChat } from '../service/chat_service';
import useUserInfo from '../hooks/useUserInfo';
import useWindowDimensions from '../utils/windowDimension';

const { check } = require('korcen');

const Container = styled.div`
  padding: 5rem 1rem 5rem 1rem;

  @media screen and (min-width: 1025px) {
    padding: 60px 2rem 0 calc(130px + 2rem);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  .form-title {
    margin-bottom: 2rem;
  }

  label {
    margin-top: 1rem;
  }

  .input-label {
    margin-bottom: 1rem;
  }

  .help-text {
    font-size: 0.7rem;
    color: #a9a9a9;
    margin: 0.3rem 0 1rem 0;
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

  @media screen and (min-width: 1025px) {
    margin: 0 17rem 3rem 17rem;
    padding: 3rem;
    border: 1px solid #a9a9a9;
    border-radius: 5px;
  }
`;

function MoimForm() {
  const { width } = useWindowDimensions();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [moimId, setMoimId] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [datetimeValue, setDatetimeValue] = useState(timestampNextDay);
  const [count, setCount] = useState(2);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useUserInfo();

  useEffect(() => {
    if (location.state) {
      const {
        id,
        restaurantId,
        restaurantName,
        originalTitle,
        originalContent,
        originalTime,
        originalHeadCnt,
      } = location.state;

      setIsForUpdate(true);
      setMoimId(id);
      setTitle(originalTitle);
      setSelectedRestaurantId(restaurantId);
      setSearchKeyword(restaurantName);
      setDatetimeValue(originalTime);
      setCount(originalHeadCnt);
      setContent(originalContent);
    }
  }, []);

  function handleSubmit() {
    if (!title || !count || !content || !selectedRestaurantId) {
      alert('입력하지 않은 정보가 있습니다.');
      return;
    }
    if (count < 2 || count > 20) {
      alert('인원은 최소 2명, 최대 20명까지 가능합니다.');
      return;
    }

    if (check(title) || check(content)) {
      alert('욕설은 입력할 수 없습니다.');
      return;
    }

    const datetimeLocaleKo = new Date(datetimeValue);
    datetimeLocaleKo.setHours(datetimeLocaleKo.getHours() + 9);

    if (isForUpdate) {
      updateMoim(
        moimId,
        { time: datetimeLocaleKo },
        () => navigate(-1),
        err => console.log(err),
      );
    } else {
      createMoim(
        {
          restaurant: selectedRestaurantId,
          time: datetimeLocaleKo,
          head_cnt: count,
          title,
          content,
        },
        result => {
          const { data } = result;
          console.log('생성된 모임 id: ', data.id);
          const moimIdCreated = `${data.id}`;
          createMoimChat(moimIdCreated, userInfo);
          navigate('/');
        },
        err => console.log(err),
      );
    }
  }

  return (
    <Container>
      {width > 1024 ? (
        <DesktopNavbar />
      ) : (
        <GoBackBar
          title={
            userInfo.language === 0 ? '메이트 구하기' : 'Create an appointment'
          }
        />
      )}
      <Form>
        {width > 1024 && (
          <h1 className="form-title">
            {userInfo.language === 0
              ? '메이트 구하기'
              : 'Create an appointment'}
          </h1>
        )}
        <label htmlFor="title">
          {' '}
          {userInfo.language === 0 ? '모임 제목' : 'Title'}
        </label>
        <TextField
          id="title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={!!isForUpdate}
          margin="normal"
          variant="standard"
        />
        <RestaurantSearchForm
          isForUpdate={isForUpdate}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          setSelectedRestaurantId={setSelectedRestaurantId}
        />
        <label htmlFor="datetime">
          {userInfo.language === 0 ? '날짜' : 'Date'}
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={datetimeValue}
            onChange={newValue => setDatetimeValue(newValue)}
            ampm
            inputFormat="YYYY-MM-DD A hh:mm"
            mask="____-__-__ __:__ __"
            minutesStep={10}
            minDate={dayjs(timestampNextDay())}
            maxDate={dayjs(timestamp1YearLater())}
            renderInput={params => <TextField {...params} margin="normal" />}
          />
        </LocalizationProvider>
        <label htmlFor="count">
          {userInfo.language === 0
            ? '인원 (본인 포함)'
            : 'Number of people (including yourself)'}
        </label>
        <p className="help-text">
          {userInfo.language === 0
            ? '인원을 채우지 못하면 모임이 취소됩니다.'
            : 'If you fail to meet the number of people, the meeting will be canceled.'}
        </p>
        <Input
          id="count"
          name="count"
          value={count}
          onChange={e => setCount(e.target.value)}
          disabled={!!isForUpdate}
          margin="dense"
          endAdornment={<InputAdornment position="end">명</InputAdornment>}
          inputProps={{
            min: 2,
            max: 20,
            'aria-label': 'count',
            type: 'number',
          }}
          sx={{
            width: '6rem',
          }}
        />
        <label htmlFor="content">
          {' '}
          {userInfo.language === 0 ? '내용' : 'Content'}
        </label>
        <TextField
          id="content"
          name="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={!!isForUpdate}
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
          onClick={() => handleSubmit()}
        >
          {userInfo.language === 0 ? '작성' : 'Submit'}
        </button>
      </Form>
    </Container>
  );
}

export default MoimForm;
