import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiPostFollow } from '../../api/accounts';
import {
  findPrivateChatRoom,
  createPrivateRoom,
  getJoinDate,
} from '../../service/chat_service';
import useUserInfo from '../../hooks/useUserInfo';
import formatUserInfo from '../../utils/formatUserInfo';

const Container = styled.div`
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  padding: 1rem 0;
  button {
    margin: 0 0.5rem;
    padding: 5px 0;
    width: 100%;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .inactive {
    color: #fcb448;
    border: 1px solid #fcb448;
    background-color: #fff;
  }
  .active {
    color: #fff;
    background-color: #fcb448;
  }
`;

function ButtonContainer({ getProfileInfo, profileInfo }) {
  const followingStatus = profileInfo.following_status;
  const { userPk } = useParams();
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  function postFollow() {
    apiPostFollow(
      {
        targetId: userPk,
      },
      () => getProfileInfo(),
    );
  }

  async function onClickMessage() {
    if (profileInfo.id === userInfo.id) {
      navigate('/chat');
      return;
    }

    let chatRoom = await findPrivateChatRoom(
      `${profileInfo.id}`,
      `${userInfo.id}`,
    );

    if (!chatRoom) {
      const pair = formatUserInfo(profileInfo);
      const user = formatUserInfo(userInfo);
      chatRoom = await createPrivateRoom(pair, user);
    }
    const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id);
    chatRoom.joinDate = joinDate;
    chatRoom.chatTitle = profileInfo.nickname;
    chatRoom.notificationTargetId = `${profileInfo.id}`;
    navigate('/chatRoom', {
      state: chatRoom,
    });
  }

  function getRightButton(statusNum) {
    let rightButton = '';
    if (statusNum === 0) {
      rightButton = (
        <button type="button" className="active" onClick={() => postFollow()}>
          팔로우
        </button>
      );
    } else if (statusNum === 1) {
      rightButton = (
        <button type="button" className="inactive" onClick={() => postFollow()}>
          팔로잉
        </button>
      );
    } else if (statusNum === 2) {
      rightButton = (
        <button type="button" className="active">
          글쓰기
        </button>
      );
    } else {
      return null;
    }
    return rightButton;
  }

  return (
    <Container>
      <button type="button" className="inactive" onClick={onClickMessage}>
        메시지
      </button>
      {getRightButton(followingStatus)}
    </Container>
  );
}
ButtonContainer.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  getProfileInfo: PropTypes.func.isRequired,
};
export default ButtonContainer;
