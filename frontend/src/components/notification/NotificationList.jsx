import styled from 'styled-components';
import PropTypes from 'prop-types';
import NotificationItem from './NotificationItem';

const StyledNotificationList = styled.div`
  background-color: azure;
  padding-top: calc(52px + 10px);
  width: 100%;

  @media screen and (min-width: 1024px) {
    padding: calc(52px + 10px) 15%;
  }
`;

function NotificationList({ notifications }) {
  return (
    <StyledNotificationList>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </StyledNotificationList>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default NotificationList;