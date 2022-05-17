import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { onDismissAtom } from '../../../atoms/bottomSheet';
import { exitMoim } from '../../../api/moim';
import CenteredModalBase from '../../common/CenteredModalBase';

function DesktopConfirmExitMember({ mateId }) {
  const [, onDismiss] = useAtom(onDismissAtom);
  const navigate = useNavigate();

  return (
    <CenteredModalBase
      mainAction={() => {
        exitMoim(mateId)
          .then(() => {
            navigate('/');
            onDismiss();
          })
          .catch(err => console.log(err));
      }}
    >
      <h2>정말 삭제하시겠습니까?</h2>
    </CenteredModalBase>
  );
}

DesktopConfirmExitMember.propTypes = {
  mateId: PropTypes.number.isRequired,
};

export default DesktopConfirmExitMember;
