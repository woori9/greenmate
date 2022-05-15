import { atom } from 'jotai';

const today = new Date().toLocaleDateString();
const sampleData = [
  {
    id: '1',
    title:
      '타이틀타이틀타이틀타이틀타이틀타이이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀',
    sentBy: '1',
    createdAt: today,
  },
  { id: '2', title: '타이틀', sentBy: '2', createdAt: today },
];

const notificationAtom = atom(sampleData);

export default notificationAtom;
