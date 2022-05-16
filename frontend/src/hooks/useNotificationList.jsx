import { useAtom } from 'jotai';
import notificationAtom from '../atoms/notification';

export default function useNotificationList() {
  const [notifications, setNotifications] = useAtom(notificationAtom);
  return { notifications, setNotifications };
}
