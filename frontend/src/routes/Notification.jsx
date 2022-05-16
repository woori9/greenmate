import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoBackBar from '../components/common/GoBackBar';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import NotificationList from '../components/notification/NotificationList';
import useNotificationList from '../hooks/useNotificationList';

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
  const { notifications } = useNotificationList();
  return (
    <>
      <ResponsiveNavbar />
      <GoBackBar title="알림" />
      <StyledNotificationPage>
        <CheckCircleIcon />
        <NotificationList notifications={notifications} />
      </StyledNotificationPage>
    </>
  );
}

export default Notification;
