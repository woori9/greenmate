import dayjs from 'dayjs';
import ko from 'dayjs/locale/ko';

dayjs.locale(ko);

function formattedDatetime(datetime) {
  // TODO: 유저 lang 값에 따라 en/ko로 변경
  return dayjs(datetime).format('M.D(ddd) A h시 m분');
}

function formatChatDateTime(datetime) {
  const today = dayjs(new Date());
  today.format();

  const pastDateTime = dayjs(datetime.toDate());

  if (today.format('YYYY.MM.DD') === pastDateTime.format('YYYY.MM.DD')) {
    return pastDateTime.format('A h:mm');
  }

  const yesterday = today.subtract(1, 'day').format('YYYY.MM.DD');
  if (yesterday === pastDateTime.format('YYYY.MM.DD')) {
    return '어제';
  }

  pastDateTime.format();
  return `${pastDateTime.today.get('month') + 1}월 ${pastDateTime.today.get(
    'date',
  )}일`;
}

export { formattedDatetime, formatChatDateTime };
