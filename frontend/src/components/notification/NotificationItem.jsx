import styled from 'styled-components';
import PropTypes from 'prop-types';
import vegan from '../../assets/vegan-icon.png';

const StyledNotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1rem;
  border-bottom: 1px solid #d3d3d3;

  .title {
    padding: 0rem 2rem;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date {
    margin-left: auto;
  }
  img {
    width: 5rem;
    height: auto;
    border-radius: 50%;
    background-color: azure;
  }
`;

function NotificationItem({ notification }) {
  return (
    <StyledNotificationItem>
      <img src={vegan} alt="greenmate" />
      <p className="title">{notification.title}</p>
      <p className="date">{notification.createdAt}</p>
    </StyledNotificationItem>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape().isRequired,
};

export default NotificationItem;
