/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CommentIcon from '@mui/icons-material/Comment';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import GoBackBar from '../components/common/GoBackBar';
import UserInfo from '../components/moim/UserInfo';
import ProfileImage from '../components/common/ProfileImage';
import ConfirmDeleteMoim from '../components/moim/ConfirmDeleteMoim';
import { formattedDatetime } from '../utils/formattedDate';
import { diff2hour } from '../utils/timestamp';
import {
  applyMoim,
  exitMoim,
  cancleApplyMoim,
  getMoimDetail,
} from '../api/moim';
import { openSheetAtom } from '../atoms/bottomSheet';
import { userInfoAtom } from '../atoms/accounts';

import { snakeToCamel } from '../utils/formatKey';

const Container = styled.div`
  @media screen and (max-width: 1024px) {
    padding: 5rem 1rem 5rem 1rem;
  }

  @media screen and (min-width: 1025px) {
    margin: 112px 0 0 130px;
    padding: 0 2rem;
  }
`;

const OrangeBack = styled.div`
  position: absolute;
  top: 52px;
  left: 0;
  background-color: #f5bd68;
  width: 100%;
  height: 7rem;
  z-index: -1;

  @media screen and (min-width: 1025px) {
    top: 102px;
  }
`;

const MainBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #a9a9a9;
  border-radius: 10px;
  margin: 1.5rem 0;

  .profile-img {
    position: absolute;
    top: -1.5rem;
    order: 0;
  }

  p {
    margin: 1.5rem 0 1.2rem 0;
    order: 1;
  }

  h1 {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
    order: 2;
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 0.9rem;
  right: 2rem;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
`;

const DataList = styled.dl`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  .info-data {
    display: flex;

    dd {
      margin-bottom: 0.5rem;
    }

    .restaurant-data {
      display: flex;
      flex-direction: column;

      .go-map-btn {
        color: #f5a468;
        background: none;
        border: none;
        margin-left: 0.5rem;
        cursor: pointer;
      }
    }
  }
`;

const H2 = styled.h2`
  font-size: 1rem;
  font-weight: 400;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 62px;
  border-top: 1px solid #a9a9a9;

  button {
    width: 18rem;
    height: 2.8rem;
    font-size: 1rem;
    color: #fff;
    background-color: #fcb448;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
`;

function MoimDetail() {
  const navigate = useNavigate();
  const [moimInfo, setMoimInfo] = useState({
    id: null,
    author: { id: null, nickname: '', vegeType: null },
    title: '',
    content: '',
    headCnt: 0,
    nowCnt: 0,
    mates: [],
    restaurant: { id: null, name: '', address: '' },
    status: null,
    time: null,
  });
  const [needUpdate, setNeedUpdate] = useState(0);
  const [, setOpen] = useAtom(openSheetAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const { moimId } = useParams();
  const location = useLocation();
  const { moim } = location.state;

  useEffect(() => {
    if (!moimInfo) {
      setMoimInfo(moim);
    } else {
      getMoimDetail(moimId, res => {
        const formattedData = {
          ...snakeToCamel(res.data),
          time: new Date(res.data.time),
        };
        setMoimInfo(formattedData);
      });
    }
  }, [needUpdate]);

  const bottomButtons = {
    0: (
      <button
        type="button"
        onClick={() =>
          cancleApplyMoim(
            moimInfo.userMateId,
            () => setNeedUpdate(prev => prev + 1),
            err => console.log(err),
          )
        }
      >
        대기 취소하기
      </button>
    ),
    1: (
      <button
        type="button"
        onClick={() =>
          exitMoim(
            moimInfo.userMateId,
            () => setNeedUpdate(prev => prev + 1),
            err => console.log(err),
          )
        }
      >
        참여 취소하기
      </button>
    ),
    5: (
      <button
        type="button"
        onClick={() =>
          navigate('/moim/form', {
            state: {
              id: moimInfo.id,
              restaurantId: moimInfo.restaurant.id,
              restaurantName: moimInfo.restaurant.name,
              originalTitle: moimInfo.title,
              originalContent: moimInfo.content,
              originalTime: moimInfo.time,
              originalHeadCnt: moimInfo.headCnt,
            },
          })
        }
      >
        수정하기
      </button>
    ),
    6: (
      <button
        type="button"
        onClick={() => {
          applyMoim(
            moimInfo.id,
            () => setNeedUpdate(prev => prev + 1),
            err => console.log(err),
          );
        }}
      >
        참여하기
      </button>
    ),
  };

  return (
    <Container>
      <ResponsiveNavbar />
      <GoBackBar title="">
        {userInfo.id === moimInfo.author.id &&
          diff2hour(moimInfo.time, new Date()) &&
          moimInfo.nowCnt === 1 && (
            <DeleteBtn
              type="button"
              onClick={() => {
                setOpen({
                  open: true,
                  component: (
                    <ConfirmDeleteMoim mateId={moimInfo.mates[0].id} />
                  ),
                });
              }}
            >
              <DeleteIcon
                sx={{
                  color: '#a9a9a9',
                }}
              />
            </DeleteBtn>
          )}
      </GoBackBar>
      <OrangeBack />
      <MainBox>
        <h1>{moimInfo.title}</h1>
        <ProfileImage vegeType={moimInfo.author.vegeType} isBig={false} />
        <p>{moimInfo.author.nickname}</p>
      </MainBox>
      <DataList>
        <div className="info-data">
          <dt className="sr-only">시간</dt>
          <dd>
            <AccessTimeIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <dd>{formattedDatetime(moimInfo.time)}</dd>
        </div>

        <div className="info-data">
          <dt className="sr-only">장소</dt>
          <dd>
            <StorefrontIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <div className="restaurant-data">
            <dd>
              {moimInfo.restaurant.name}
              {/* TODO: 지도 연결 */}
              <button className="go-map-btn" type="button">
                지도 보기
              </button>
            </dd>
            <dd>{moimInfo.restaurant.address}</dd>
          </div>
        </div>

        <div className="info-data">
          <dt className="sr-only">인원</dt>
          <dd>
            <PeopleAltIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <dd>{moimInfo.headCnt}명</dd>
        </div>

        <div className="info-data">
          <dt className="sr-only">내용</dt>
          <dd>
            <CommentIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <dd>{moimInfo.content}</dd>
        </div>
      </DataList>

      <H2>멤버 소개</H2>
      {moimInfo.mates.map(mate => {
        if (mate.mateStatus === 1) {
          return <UserInfo userInfo={mate} key={mate.userId} />;
        }
      })}
      {[0, 1, 6].includes(moimInfo.userMateStatus) &&
        diff2hour(moimInfo.time, new Date()) && (
          <ButtonDiv>{bottomButtons[moimInfo.userMateStatus]}</ButtonDiv>
        )}
      {moimInfo.author.id === userInfo.id &&
        diff2hour(moimInfo.time, new Date()) && (
          <ButtonDiv>{bottomButtons[5]}</ButtonDiv>
        )}
    </Container>
  );
}

export default MoimDetail;
