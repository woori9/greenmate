import { useAtom } from 'jotai';
import {
  notificationAtom,
  deleteNotificationAtom,
} from '../atoms/notification';

export default function useNotificationList() {
  const [notifications, setNotifications] = useAtom(notificationAtom);
  const [, deleteNotification] = useAtom(deleteNotificationAtom);
  return { notifications, setNotifications, deleteNotification };
}
