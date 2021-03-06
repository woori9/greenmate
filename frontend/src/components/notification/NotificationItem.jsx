import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import {
  findPrivateChatRoom,
  getJoinDate,
  getMoimChatRoom,
} from '../../service/chat_service';
import useUserInfo from '../../hooks/useUserInfo';
import { deleteNotification } from '../../api/notification';

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
`;

function NotificationItem({ notification, handleDelete }) {
  const userInfo = useUserInfo();
  const navigate = useNavigate();

  const handleNotification = async target => {
    deleteNotification(target.id);
    handleDelete(target.id);

    if (target.category === 0) {
      const chatRoom = await findPrivateChatRoom(
        `${target.sent_by}`,
        `${userInfo.id}`,
      );
      const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id);
      const notificationTargetId = `${target.sent_by}`;
      const chatTitle = chatRoom.membersInfo[`nickname${target.sent_by}`];
      navigate('/chatRoom', {
        state: {
          ...chatRoom,
          joinDate,
          notificationTargetId,
          chatTitle,
        },
      });
    }

    if (target.category === 1) {
      const chatRoom = await getMoimChatRoom(`${target.sent_by}`);
      const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id);
      const chatTitle = target.title;
      const notificationTargetId = `${target.sent_by}`;
      navigate('/chatRoom', {
        state: {
          ...chatRoom,
          joinDate,
          notificationTargetId,
          chatTitle,
        },
      });
    }

    if (target.category === 2) {
      navigate('/mymoim');
    }
  };

  return (
    <StyledNotificationItem onClick={() => handleNotification(notification)}>
      <EmailIcon sx={{ color: '#454545', fontSize: 30 }} />
      <p className="title">{notification.body}</p>
      <p className="date">{notification.createdAt}</p>
    </StyledNotificationItem>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape().isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default NotificationItem;
