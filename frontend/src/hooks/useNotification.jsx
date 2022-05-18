/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react';

export default function useNotificationStatus() {
  const [notificationStatus, setNotificationStatus] = useState(
    Notification ? Notification.permission : null,
  );
  useEffect(() => {
    if (!Notification) return;

    navigator.permissions
      .query({ name: 'notifications' })
      .then(notificationPerm => {
        notificationPerm.onchange = () => {
          setNotificationStatus(notificationPerm.state);
        };
      })
      .catch(err => console.error(err));
  }, []);

  return notificationStatus;
}
