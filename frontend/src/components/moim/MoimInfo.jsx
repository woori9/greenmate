import styled, { css } from 'styled-components';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PropTypes from 'prop-types';
import MoimButtons from './MoimButtons';

const MoimCard = styled.div`
  ${props =>
    props.hasBorder &&
    css`
      border: 1px solid #a9a9a9;
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

const ProfileImg = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #c4c4c4;
  margin: 0 1rem;
`;

function MoimInfo({ moimInfo, hasBorder, showStatus }) {
  const moimStatus = ['모집 중', '모집 완료', '모집 취소', '모임 종료'];

  return (
    <MoimCard hasBorder={hasBorder}>
      {showStatus && <p>{moimStatus[moimInfo.status]}</p>}
      <ProfileWithInfo>
        <ProfileImg />
        <div>
          <h2>{moimInfo.title}</h2>
          <dl>
            <div className="info-data">
              <dt className="sr-only">장소</dt>
              <dd>
                <StorefrontIcon />
              </dd>
              <dd>{moimInfo.restaurant.nameKr}</dd>
            </div>

            <div className="info-data">
              <dt className="sr-only">시간</dt>
              <dd>
                <AccessTimeIcon />
              </dd>
              <dd>{JSON.stringify(moimInfo.time)}</dd>
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
      {!hasBorder && <hr />}
    </MoimCard>
  );
}

MoimInfo.propTypes = {
  moimInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  hasBorder: PropTypes.bool.isRequired,
  showStatus: PropTypes.bool.isRequired,
};

export default MoimInfo;
