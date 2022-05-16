import { useAtom } from 'jotai';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { categoryAtom } from '../../atoms/moim';
import { cancleApplyMoim, exitMoim } from '../../api/moim';
import {
  excludeFromChatRoom,
  getMoimChatRoom,
  getJoinDate,
} from '../../service/chat_service';
import useUserInfo from '../../hooks/useUserInfo';

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 1rem 0;
`;

const Button = styled.button`
  width: 8.5rem;
  height: 2rem;
  color: #000;
  background: none;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    color: #a9a9a9;
    cursor: inherit;
  }

  &:disabled:after {
    content: ' 완료';
  }
`;

function MoimCardButtons({ moimInfo, setNeedUpdate }) {
  const [selectedCategory] = useAtom(categoryAtom);
  const navigate = useNavigate();
  const userInfo = useUserInfo();

  const buttonDict = {
    0: (
      <ButtonDiv>
        <Button type="button">호스트 문의</Button>
        <Button
          type="button"
          onClick={() =>
            cancleApplyMoim(
              moimInfo.userMateId,
              () => setNeedUpdate(prev => prev + 1),
              err => console.log(err),
            )
          }
        >
          대기 취소
        </Button>
      </ButtonDiv>
    ),
    1: (
      <ButtonDiv>
        <Button
          type="button"
          onClick={() => {
            exitMoim(
              moimInfo.userMateId,
              () => setNeedUpdate(prev => prev + 1),
              err => console.log(err),
            );

            excludeFromChatRoom(`${moimInfo.id}`, `${userInfo.id}`);
          }}
        >
          참여 취소
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const chatRoom = await getMoimChatRoom(`${moimInfo.id}`);

            if (!chatRoom) {
              alert('해당 모임이 존재하지 않습니다.');
              return;
            }

            const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id); // userId, roomId

            chatRoom.joinDate = joinDate;
            chatRoom.chatTitle = moimInfo.title;
            chatRoom.notificationTargetId = `${moimInfo.id}`;
            navigate('/chatRoom', {
              state: chatRoom,
            });
          }}
        >
          채팅방 입장
        </Button>
      </ButtonDiv>
    ),
    4: (
      <ButtonDiv>
        <Button type="button">식당 리뷰</Button>
        <Button
          type="button"
          onClick={() =>
            navigate(`/moim/${moimInfo.id}/evaluation`, {
              state: {
                moimInfo: {
                  title: moimInfo.title,
                  time: moimInfo.time,
                  restaurantName: moimInfo.restaurant.name,
                },
                mateList: moimInfo.mates,
              },
            })
          }
          disabled={moimInfo.isEvaluated}
        >
          모임 평가
        </Button>
      </ButtonDiv>
    ),
    5: (
      <ButtonDiv>
        <Button
          type="button"
          onClick={() => {
            const waitList = [];
            const joinList = [];
            moimInfo.mates.forEach((mate, idx) => {
              if (mate.mateStatus === 0) {
                waitList.push(mate);
              } else if (mate.mateStatus === 1 && idx !== 0) {
                joinList.push(mate);
              }
            });
            navigate(`/moim/${moimInfo.id}/member`, {
              state: { waitList, joinList },
            });
          }}
        >
          멤버 관리
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const chatRoom = await getMoimChatRoom(`${moimInfo.id}`);

            if (!chatRoom) {
              alert('해당 모임이 존재하지 않습니다.');
              return;
            }

            const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id); // userId, roomId

            chatRoom.joinDate = joinDate;
            chatRoom.chatTitle = moimInfo.title;
            chatRoom.notificationTargetId = `${moimInfo.id}`;
            navigate('/chatRoom', {
              state: chatRoom,
            });
          }}
        >
          채팅방 입장
        </Button>
      </ButtonDiv>
    ),
  };

  const buttonDictEng = {
    0: (
      <ButtonDiv>
        <Button type="button">Contact the host</Button>
        <Button
          type="button"
          onClick={() =>
            cancleApplyMoim(
              moimInfo.userMateId,
              () => setNeedUpdate(prev => prev + 1),
              err => console.log(err),
            )
          }
        >
          Cancel wait
        </Button>
      </ButtonDiv>
    ),
    1: (
      <ButtonDiv>
        <Button
          type="button"
          onClick={() => {
            exitMoim(
              moimInfo.userMateId,
              () => setNeedUpdate(prev => prev + 1),
              err => console.log(err),
            );

            excludeFromChatRoom(`${moimInfo.id}`, `${userInfo.id}`);
          }}
        >
          Cancel participation
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const chatRoom = await getMoimChatRoom(`${moimInfo.id}`);

            if (!chatRoom) {
              alert('This meeting does not exist.');
              return;
            }

            const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id); // userId, roomId

            chatRoom.joinDate = joinDate;
            chatRoom.chatTitle = moimInfo.title;
            chatRoom.notificationTargetId = `${moimInfo.id}`;
            navigate('/chatRoom', {
              state: chatRoom,
            });
          }}
        >
          Enter the chat room
        </Button>
      </ButtonDiv>
    ),
    4: (
      <ButtonDiv>
        <Button type="button">Create a restaurant review</Button>
        <Button
          type="button"
          onClick={() =>
            navigate(`/moim/${moimInfo.id}/evaluation`, {
              state: {
                moimInfo: {
                  title: moimInfo.title,
                  time: moimInfo.time,
                  restaurantName: moimInfo.restaurant.name,
                },
                mateList: moimInfo.mates,
              },
            })
          }
          disabled={moimInfo.isEvaluated}
        >
          Evaluate a meeting
        </Button>
      </ButtonDiv>
    ),
    5: (
      <ButtonDiv>
        <Button
          type="button"
          onClick={() => {
            const waitList = [];
            const joinList = [];
            moimInfo.mates.forEach((mate, idx) => {
              if (mate.mateStatus === 0) {
                waitList.push(mate);
              } else if (mate.mateStatus === 1 && idx !== 0) {
                joinList.push(mate);
              }
            });
            navigate(`/moim/${moimInfo.id}/member`, {
              state: { waitList, joinList },
            });
          }}
        >
          Manage members
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const chatRoom = await getMoimChatRoom(`${moimInfo.id}`);

            if (!chatRoom) {
              alert('This meeting does not exist.');
              return;
            }

            const joinDate = await getJoinDate(`${userInfo.id}`, chatRoom.id); // userId, roomId

            chatRoom.joinDate = joinDate;
            chatRoom.chatTitle = moimInfo.title;
            chatRoom.notificationTargetId = `${moimInfo.id}`;
            navigate('/chatRoom', {
              state: chatRoom,
            });
          }}
        >
          Enter the chat room
        </Button>
      </ButtonDiv>
    ),
  };

  return (userInfo.language === 0 ? buttonDict : buttonDictEng)[
    selectedCategory
  ];
}

MoimCardButtons.propTypes = {
  moimInfo: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
      vegeType: PropTypes.number,
    }),
    title: PropTypes.string,
    content: PropTypes.string,
    time: PropTypes.instanceOf(Date),
    status: PropTypes.number,
    headCnt: PropTypes.number,
    nowCnt: PropTypes.number,
    userMateId: PropTypes.number,
    userMateStatus: PropTypes.number,
    mates: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          userId: PropTypes.number,
          nickname: PropTypes.string,
          vegeType: PropTypes.number,
          mateStatus: PropTypes.number,
        }),
      ),
    ]),
    restaurant: PropTypes.shape({
      address: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    isEvaluated: PropTypes.bool,
  }).isRequired,
  setNeedUpdate: PropTypes.func,
};

MoimCardButtons.defaultProps = {
  setNeedUpdate: null,
  isEvaluated: false,
};

export default MoimCardButtons;
