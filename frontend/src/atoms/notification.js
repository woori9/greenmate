import { atom } from 'jotai';

const today = new Date().toLocaleDateString();
const sampleData = [
  {
    id: '1',
    title:
      '타이틀타이틀타이틀타이틀타이틀타이이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀',
    sentBy: '1',
    createdAt: today,
    type: 1,
  }, // 개인챗
  { id: '2', title: '타이틀', sentBy: '10', createdAt: today, type: 2 }, // 모임
];

const notificationAtom = atom(sampleData);

const addNewNotificationAtom = atom(null, (get, set, newNotification) =>
  set(notificationAtom, [newNotification, ...get(notificationAtom)]),
);

export { notificationAtom, addNewNotificationAtom };
