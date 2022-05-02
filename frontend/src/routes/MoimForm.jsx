/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import styled from 'styled-components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { timestampNextDay, timestamp1YearLater } from '../utils/timestamp';
import RestaurantSearch from '../components/common/RestaurantSearch';

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

function MoimForm() {
  const [datetimeValue, setDatetimeValue] = useState(timestampNextDay);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const handleChange = newValue => {
    setDatetimeValue(newValue);
  };

  function handleSubmit(event) {
    event.preventDefault();
    console.log(event);
    console.log(selectedRestaurantId);
  }

  return (
    <Form onSubmit={event => handleSubmit(event)}>
      <label htmlFor="title">모임 제목</label>
      <TextField id="title" name="title" margin="normal" variant="standard" />
      <RestaurantSearch setSelectedRestaurantId={setSelectedRestaurantId} />
      <label htmlFor="datetime">날짜</label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={datetimeValue}
          onChange={handleChange}
          ampm
          inputFormat="YYYY-MM-DD hh:mm A"
          mask="____-__-__ __:__ __"
          minutesStep={10}
          minDate={dayjs(timestampNextDay())}
          maxDate={dayjs(timestamp1YearLater())}
          renderInput={params => <TextField {...params} margin="normal" />}
        />
      </LocalizationProvider>
      <label htmlFor="count" className="input-label">
        인원 (본인 포함)
      </label>
      <Input
        id="count"
        name="count"
        value={2}
        onChange={console.log('change')}
        margin="dense"
        endAdornment={<InputAdornment position="end">명</InputAdornment>}
        inputProps={{
          'aria-label': 'count',
        }}
        sx={{
          width: '6rem',
        }}
      />
      <label htmlFor="content">내용</label>
      <TextField
        id="content"
        name="content"
        placeholder="내용을 입력해주세요."
        multiline
        minRows="5"
        margin="normal"
        variant="outlined"
      />
      <button type="submit" className="submit-btn">
        작성
      </button>
    </Form>
  );
}

export default MoimForm;
