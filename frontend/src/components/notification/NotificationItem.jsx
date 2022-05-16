import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import vegan from '../../assets/vegan-icon.png';
import {
  findPrivateChatRoom,
  getJoinDate,
  getMoimChatRoom,
} from '../../service/chat_service';
import useUserInfo from '../../hooks/useUserInfo';

const StyledNotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1rem;
  border-bottom: 1px solid #d3d3d3;

  .title {
    padding: 0rem 2rem;
    max-width: 60%;
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
  const userInfo = useUserInfo();
  const navigate = useNavigate();

  const handleNotification = async target => {
    if (target.type === 1) {
      const chatRoom = await findPrivateChatRoom(
        target.sentBy,
        `${userInfo.id}`,
      );
      const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id);
      const notificationTargetId = target.sentBy;
      const chatTitle = chatRoom.membersInfo[`nickname${target.sentBy}`];
      navigate('/chatRoom', {
        state: {
          ...chatRoom,
          joinDate,
          notificationTargetId,
          chatTitle,
        },
      });
    }

    if (target.type === 2) {
      const chatRoom = await getMoimChatRoom(target.sentBy);
      const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id);
      const chatTitle = '모임 타이틀';
      const notificationTargetId = target.sentBy;
      navigate('/chatRoom', {
        state: {
          ...chatRoom,
          joinDate,
          notificationTargetId,
          chatTitle,
        },
      });
    }
  };

  return (
    <StyledNotificationItem onClick={() => handleNotification(notification)}>
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
