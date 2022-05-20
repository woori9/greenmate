import styled from 'styled-components';
import useNotificationList from '../../hooks/useNotificationList';

const StyledMessageModal = styled.div`
  border-radius: 3px;
  position: absolute;
  width: 300px;
  right: -10px;
  z-index: 10;
  border: 1px solid #e0e0e0;

  @media screen and (max-width: 1024px) {
    display: none;
  }

  .content {
    word-break: break-word;
  }

  .message {
    display: flex;
    position: relative;
    align-items: center;
    padding: 12px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #f2f2f2;
  }

  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function MessageModal() {
  const { notifications } = useNotificationList();
  const recent = notifications.slice(0, 5);

  return (
    <StyledMessageModal>
      <div className="content">
        {recent.map(item => (
          <div className="message" key={item.id}>
            <p className="text">{item.body}</p>
          </div>
        ))}
      </div>
    </StyledMessageModal>
  );
}

export default MessageModal;
