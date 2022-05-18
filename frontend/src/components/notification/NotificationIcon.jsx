/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import styled from 'styled-components';
import useNotificationList from '../../hooks/useNotificationList';
import MessageModal from './MessageModal';

const Wrapper = styled.div`
  position: relative;
`;

function NotificationIcon() {
  const { notifications } = useNotificationList();
  const [badgeStyle, setBadgeStyle] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (notifications.length) {
      setBadgeStyle('dot');
    } else {
      setBadgeStyle('');
    }
  }, [notifications.length]);

  return (
    <Wrapper>
      <Link to="/notification">
        <Badge overlap="circular" color="error" variant={badgeStyle}>
          <div
            onMouseOver={() => {
              setShowModal(true);
            }}
            onMouseLeave={() => {
              setShowModal(false);
            }}
          >
            <NotificationsNoneOutlinedIcon
              sx={{ color: '#454545', fontSize: 30 }}
            />
          </div>
        </Badge>
      </Link>
      {showModal && <MessageModal />}
    </Wrapper>
  );
}

export default NotificationIcon;
