import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import { onDismissAtom } from '../../../atoms/bottomSheet';
import { declineGuest } from '../../../api/moim';
import { excludeFromChatRoom } from '../../../service/chat_service';
import CenteredModalBase from '../../common/CenteredModalBase';

function DesktopConfirmExitMember({ mateId, userId, moimId, setNeedUpdate }) {
  const [, onDismiss] = useAtom(onDismissAtom);

  return (
    <CenteredModalBase
      mainAction={() => {
        declineGuest(mateId)
          .then(() => {
            setNeedUpdate(prev => prev + 1);
            onDismiss();
          })
          .catch(err => console.log(err));

        excludeFromChatRoom(`${moimId}`, `${userId}`);
      }}
    >
      <h2>정말 내보내시겠습니까?</h2>
      <p>내보낸 이후 취소할 수 없습니다.</p>
    </CenteredModalBase>
  );
}

DesktopConfirmExitMember.propTypes = {
  mateId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  moimId: PropTypes.string.isRequired,
  setNeedUpdate: PropTypes.func.isRequired,
};

export default DesktopConfirmExitMember;
