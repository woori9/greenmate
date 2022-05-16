import { useEffect, useState } from 'react';
import { Badge } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import useNotificationList from '../../hooks/useNotificationList';

function NotificationIcon() {
  const { notifications } = useNotificationList();
  const [badgeStyle, setBadgeStyle] = useState('');

  useEffect(() => {
    if (notifications.length) {
      setBadgeStyle('dot');
    } else {
      setBadgeStyle('');
    }
  }, [notifications.length]);

  return (
    <Badge overlap="circular" color="error" variant={badgeStyle}>
      <NotificationsNoneOutlinedIcon sx={{ color: '#454545', fontSize: 30 }} />
    </Badge>
  );
}

export default NotificationIcon;
