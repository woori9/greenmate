import dayjs from 'dayjs';
import ko from 'dayjs/locale/ko';
import useUserInfo from '../hooks/useUserInfo';

dayjs.locale(ko);

function formattedDatetime(datetime) {
  const userInfo = useUserInfo();
  if (userInfo.language === 0) {
    return dayjs(datetime).format('M.D(ddd) A h시 m분');
  }
  return dayjs(datetime).locale('en').format('llll');
}

function formatChatDateTime(datetime) {
  const today = dayjs(new Date());
  today.format();
  const userInfo = useUserInfo();

  const pastDateTime = dayjs(datetime.toDate());

  if (today.format('YYYY.MM.DD') === pastDateTime.format('YYYY.MM.DD')) {
    return pastDateTime.format('A h:mm');
  }

  const yesterday = today.subtract(1, 'day').format('YYYY.MM.DD');
  if (yesterday === pastDateTime.format('YYYY.MM.DD')) {
    if (userInfo.language === 0) return '어제';
    return 'yesterday';
  }

  pastDateTime.format();
  if (userInfo.language === 0) {
    return `${pastDateTime.get('month') + 1}월 ${pastDateTime.get('date')}일`;
  }

  return `${pastDateTime.get('date')}/${
    pastDateTime.get('month') + 1
  }/${pastDateTime.get('year')}`;
}

export { formattedDatetime, formatChatDateTime };
