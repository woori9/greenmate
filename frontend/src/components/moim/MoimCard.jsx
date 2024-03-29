/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styled, { css } from 'styled-components';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import ProfileImage from '../common/ProfileImage';
import MoimCardButtons from './MoimCardButtons';
import { formattedDatetime } from '../../utils/formattedDate';
import { categoryAtom } from '../../atoms/moim';
import { getMoimDetail } from '../../api/moim';
import { snakeToCamel } from '../../utils/formatKey';
import useWindowDimensions from '../../utils/windowDimension';
import useUserInfo from '../../hooks/useUserInfo';

const Card = styled.div`
  margin-top: 1rem;
  transition: all 0.2s ease-in-out;

  ${props =>
    props.hasBorder
      ? css`
          display: inline-block;
          min-width: 24rem;
          padding: 0.5rem;
          border: 1px solid #a9a9a9;
          border-radius: 15px;
          margin: 0.5rem;
        `
      : css`
          &:not(:last-child) {
            border-bottom: 1px solid #a9a9a9;
            margin-bottom: 1rem;
          }
        `}

  @media screen and (min-width: 1025px) {
    &:hover {
      transform: scale(1.03);
      cursor: pointer;
    }
  }
`;

const StatusText = styled.p`
  display: inline-block;
  padding: 0.5rem;
  border-radius: 50px;
  margin-left: 0.5rem;

  ${props =>
    props.status === 0
      ? css`
          color: #92c769;
          border: 2px solid #92c769;
        `
      : props.status === 1
      ? css`
          color: #3e8bff;
          border: 2px solid #3e8bff;
        `
      : props.status === 2
      ? css`
          color: #a9a9a9;
          border: 2px solid #a9a9a9;
        `
      : css`
          color: #ff5959;
          border: 2px solid #ff5959;
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

function MoimCard({ moimInfo, setNeedUpdate, showStatus }) {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const moimStatus = ['모집 중', '모집 완료', '모집 취소', '모임 종료'];
  const moimStatusEng = [
    'Open',
    'Recruitment complete',
    'Recruitment cancelled',
    'Finished',
  ];
  const [selectedCategory] = useAtom(categoryAtom);
  const { width } = useWindowDimensions();

  return (
    <Card hasBorder={width > 1024}>
      <div
        onClick={() => {
          if (moimInfo.status === 3) return;
          if (!moimInfo.mates) {
            getMoimDetail(moimInfo.id, res => {
              const formattedData = {
                ...snakeToCamel(res.data),
                time: new Date(res.data.time),
              };
              navigate(`/moim/${moimInfo.id}`, {
                state: { moimInfo: formattedData },
              });
            });
            return;
          }
          navigate(`/moim/${moimInfo.id}`, {
            state: { moimInfo },
          });
        }}
        role="button"
        tabIndex="0"
      >
        {showStatus && (
          <StatusText status={moimInfo.status}>
            {
              (userInfo.language === 0 ? moimStatus : moimStatusEng)[
                moimInfo.status
              ]
            }
          </StatusText>
        )}
        <ProfileWithInfo>
          <ProfileImage vegeType={moimInfo.author.vegeType} isBig />
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
      </div>
      {[0, 1, 4, 5].includes(selectedCategory) && (
        <MoimCardButtons moimInfo={moimInfo} setNeedUpdate={setNeedUpdate} />
      )}
    </Card>
  );
}

MoimCard.propTypes = {
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
  showStatus: PropTypes.bool.isRequired,
};

MoimCard.defaultProps = {
  setNeedUpdate: null,
};

export default MoimCard;
