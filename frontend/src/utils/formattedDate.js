import dayjs from 'dayjs';
import ko from 'dayjs/locale/ko';
import useUserInfo from '../hooks/useUserInfo';

dayjs.locale(ko);

function formattedDatetime(datetime) {
  if (useUserInfo.language === 0) {
    return dayjs(datetime).format('M.D(ddd) A h시 m분');
  }

  return dayjs(datetime).locale('en').format('llll');
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
  return `${pastDateTime.get('month') + 1}월 ${pastDateTime.get('date')}일`;
}

export { formattedDatetime, formatChatDateTime };
