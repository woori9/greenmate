import styled from 'styled-components';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import GoBackBar from '../components/common/GoBackBar';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import NotificationList from '../components/notification/NotificationList';
import notificationAtom from '../atoms/notification';

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
  const [notifications] = useAtom(notificationAtom);

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
