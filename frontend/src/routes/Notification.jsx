import styled from 'styled-components';
import { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoBackBar from '../components/common/GoBackBar';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import NotificationList from '../components/notification/NotificationList';
import { getNotifications, deleteAllNotification } from '../api/notification';
import useNotificationList from '../hooks/useNotificationList';

const orange = '#fcb448';
const gray = '#adb5bd';

const StyledNotificationPage = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  top: 60px;

  .icon-delete {
    position: absolute;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    border: none;
    background: none;
    cursor: ${props => props.iconColor === orange && 'pointer'};

    @media screen and (min-width: 1024px) {
      right: 15%;
      font-size: 14px;
    }
  }
  @media screen and (min-width: 1024px) {
    top: 150px;
    left: 130px;
    width: calc(100% - 130px);
  }
`;

function Notification() {
  const { notifications, setNotifications, deleteNotification } =
    useNotificationList();
  const [iconColor, setIconColor] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setIconColor(orange);
    } else {
      setIconColor(gray);
    }
  }, [notifications.length]);

  useEffect(() => {
    getNotifications(setNotifications);
  }, []);

  const onClickDeleteAll = () => {
    deleteAllNotification();
    setNotifications([]);
  };

  return (
    <>
      <ResponsiveNavbar />
      <GoBackBar title="알림" />
      <StyledNotificationPage iconColor={iconColor}>
        <button
          type="button"
          className="icon-delete"
          onClick={onClickDeleteAll}
        >
          <CheckCircleIcon
            sx={{ mr: '10px', color: iconColor, fontSize: 25 }}
          />
          <p>전체 알림 삭제하기</p>
        </button>
        <NotificationList
          notifications={notifications}
          handleDelete={deleteNotification}
        />
      </StyledNotificationPage>
    </>
  );
}

export default Notification;
