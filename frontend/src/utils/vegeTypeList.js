import veganIcon from '../assets/vegan-icon.png';
import lactoIcon from '../assets/lacto-icon.png';
import ovoIcon from '../assets/ovo-icon.png';
import lactoOvoUcon from '../assets/lacto-ovo-icon.png';
import pescoIcon from '../assets/pesco-icon.png';
import poloIcon from '../assets/polo-icon.png';
import flexiIcon from '../assets/flexi-icon.png';

const vegeTypeList = [
  {
    id: 0,
    title: '비건',
    sentence: '비건',
    icon: veganIcon,
    rule: '식물식',
  },
  {
    id: 1,
    title: '락토',
    sentence: '락토',
    icon: lactoIcon,
    rule: '채식 + 우유 + 유제품',
  },
  {
    id: 2,
    title: '오보',
    sentence: '오보',
    icon: ovoIcon,
    rule: '채식 + 난류',
  },
  {
    id: 3,
    title: '락토오보',
    sentence: '락토오보',
    icon: lactoOvoUcon,
    rule: '채식 + 우유 + 유제품 + 난류',
  },
  {
    id: 4,
    title: '페스코',
    sentence: '페스코',
    icon: pescoIcon,
    rule: '채식 + 우유 + 유제품 + 난류 + 바다동물',
  },
  {
    id: 5,
    title: '폴로',
    sentence: '폴로',
    icon: poloIcon,
    rule: '채식 + 우유 + 유제품 + 난류 + 바다동물 + 가금류',
  },
  {
    id: 6,
    title: '관심있어요',
    sentence: '플렉시테리언',
    icon: flexiIcon,
    rule: '채식 + 우유 + 유제품 + 난류 + 바다동물 + 가금류 + 동물',
  },
];

export default vegeTypeList;
