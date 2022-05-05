import styled, { css } from 'styled-components';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../common/ProfileImage';
import MoimButtons from './MoimButtons';
import formattedDatetime from '../../utils/formattedDate';

const Card = styled.div`
  ${props =>
    props.hasBorder
      ? css`
          border: 1px solid #a9a9a9;
        `
      : css`
          &:not(:last-child) {
            border-bottom: 1px solid #a9a9a9;
            margin-bottom: 1rem;
          }
        `}
`;

const ProfileWithInfo = styled.div`
  display: flex;
  align-items: center;

  h2 {
    font-size: 1.25rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
  }

  .info-data {
    display: flex;

    dd {
      color: #a9a9a9;
    }

    svg {
      margin-right: 0.5rem;
    }
  }
`;

function MoimCard({ moimInfo, hasBorder, showStatus }) {
  const navigate = useNavigate();
  const moimStatus = ['모집 중', '모집 완료', '모집 취소', '모임 종료'];

  return (
    <Card
      hasBorder={hasBorder}
      onClick={() =>
        navigate(`/moim/${moimInfo.id}`, {
          state: { moimInfo },
        })
      }
    >
      {showStatus && <p>{moimStatus[moimInfo.status]}</p>}
      <ProfileWithInfo>
        <ProfileImage isBig />
        <div>
          <h2>{moimInfo.title}</h2>
          <dl>
            <div className="info-data">
              <dt className="sr-only">시간</dt>
              <dd>
                <AccessTimeIcon />
              </dd>
              <dd>{formattedDatetime(moimInfo.time)}</dd>
            </div>

            <div className="info-data">
              <dt className="sr-only">장소</dt>
              <dd>
                <StorefrontIcon />
              </dd>
              <dd>{moimInfo.restaurant.name}</dd>
            </div>

            <div className="info-data">
              <dt className="sr-only">인원</dt>
              <dd>
                <PeopleAltIcon />
              </dd>
              <dd>
                {moimInfo.nowCnt} / {moimInfo.headCnt}
              </dd>
            </div>
          </dl>
        </div>
      </ProfileWithInfo>
      <MoimButtons />
    </Card>
  );
}

MoimCard.propTypes = {
  moimInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string.isRequired,
      vegeType: PropTypes.number.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.number.isRequired,
    headCnt: PropTypes.number.isRequired,
    nowCnt: PropTypes.number.isRequired,
    mates: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ]),
    restaurant: PropTypes.objectOf(PropTypes.number).isRequired,
  }).isRequired,
  hasBorder: PropTypes.bool.isRequired,
  showStatus: PropTypes.bool.isRequired,
};

export default MoimCard;
