import styled from 'styled-components';
import { useState, useEffect } from 'react';
import GoBackBar from '../components/common/GoBackBar';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import NotificationList from '../components/notification/NotificationList';

const StyledNotificationPage = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  background-color: pink;
  @media screen and (min-width: 1024px) {
    top: 60px;
    left: 130px;
    width: calc(100% - 130px);
  }
`;

function Notification() {
  const today = new Date().toLocaleDateString();
  const [notifications] = useState([
    {
      id: '1',
      title:
        '타이틀타이틀타이틀타이틀타이틀타이이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀타이틀',
      sentBy: '1',
      createdAt: today,
    },
    { id: '2', title: '타이틀', sentBy: '2', createdAt: today },
  ]);

  useEffect(() => {
    console.log('get notifications');
  }, []);

  return (
    <>
      <ResponsiveNavbar />
      <GoBackBar title="알림" />
      <StyledNotificationPage>
        <NotificationList notifications={notifications} />
      </StyledNotificationPage>
    </>
  );
}

export default Notification;
