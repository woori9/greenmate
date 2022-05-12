import { useAtom } from 'jotai';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { categoryAtom } from '../../atoms/moim';
import { cancleApplyMoim, exitMoim } from '../../api/moim';
import {
  excludeFromChatRoom,
  queryChatRoomInfo,
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
`;

function MoimCardButtons({
  moimId,
  mateId,
  mateList,
  setNeedUpdate,
  moimTitle,
}) {
  const [selectedCategory] = useAtom(categoryAtom);
  const navigate = useNavigate();

  const buttonDict = {
    0: (
      <ButtonDiv>
        <Button type="button">호스트 문의</Button>
        <Button
          type="button"
          onClick={() =>
            cancleApplyMoim(
              mateId,
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
              mateId,
              () => setNeedUpdate(prev => prev + 1),
              err => console.log(err),
            );

            excludeFromChatRoom(`${moimId}`, `${useUserInfo.id}`);
          }}
        >
          참여 취소
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const chatRoomInfo = await queryChatRoomInfo(`${moimId}`);
            chatRoomInfo.chatTitle = moimTitle;
            navigate('/chatRoom', {
              state: chatRoomInfo,
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
            navigate(`/moim/${moimId}/evaluation`, { state: { mateList } })
          }
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
            mateList.forEach((mate, idx) => {
              if (mate.mateStatus === 0) {
                waitList.push(mate);
              } else if (mate.mateStatus === 1 && idx !== 0) {
                joinList.push(mate);
              }
            });
            navigate(`/moim/${moimId}/member`, {
              state: { waitList, joinList },
            });
          }}
        >
          멤버 관리
        </Button>
        <Button
          type="button"
          onClick={async () => {
            const chatRoomInfo = await queryChatRoomInfo(`${moimId}`);
            chatRoomInfo.chatTitle = moimTitle;
            navigate('/chatRoom', {
              state: chatRoomInfo,
            });
          }}
        >
          채팅방 입장
        </Button>
      </ButtonDiv>
    ),
  };

  return buttonDict[selectedCategory];
}

MoimCardButtons.propTypes = {
  moimId: PropTypes.number.isRequired,
  mateId: PropTypes.number,
  mateList: PropTypes.oneOfType([
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
  setNeedUpdate: PropTypes.func,
  moimTitle: PropTypes.string.isRequired,
};

MoimCardButtons.defaultProps = {
  mateId: null,
  setNeedUpdate: null,
};

export default MoimCardButtons;
