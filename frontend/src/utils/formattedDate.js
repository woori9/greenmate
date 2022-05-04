import dayjs from 'dayjs';

require('dayjs/locale/ko');

dayjs.locale('ko');

function formattedDatetime(datetime) {
  // TODO: 유저 lang 값에 따라 en/ko로 변경
  return dayjs(datetime).format('M.D(ddd) A h시 m분');
}

export default formattedDatetime;
