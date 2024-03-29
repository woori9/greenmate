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
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import GoBackBar from '../components/common/GoBackBar';
import UserInfo from '../components/moim/UserInfo';
import ProfileImage from '../components/common/ProfileImage';
import DesktopConfirmDeleteMoim from '../components/moim/confirmDelete/DesktopConfirmDeleteMoim';
import MobileConfirmDeleteMoim from '../components/moim/confirmDelete/MobileConfirmDeleteMoim';
import { openSheetAtom } from '../atoms/bottomSheet';
import { formattedDatetime } from '../utils/formattedDate';
import { diff2hour } from '../utils/timestamp';
import {
  applyMoim,
  exitMoim,
  cancleApplyMoim,
  getMoimDetail,
  getMoimContentTranslation,
} from '../api/moim';
import { snakeToCamel } from '../utils/formatKey';
import useWindowDimensions from '../utils/windowDimension';
import useUserInfo from '../hooks/useUserInfo';

const Container = styled.div`
  @media screen and (max-width: 1024px) {
    padding: 5rem 1rem 5rem 1rem;
  }

  @media screen and (min-width: 1025px) {
    padding: 112px 10rem 0 calc(130px + 10rem);
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
    height: 9rem;
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

  .profile-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    background: none;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  .profile-img {
    position: absolute;
    top: -1.5rem;
    order: 0;
  }

  p {
    margin: 1.8rem 0 1.2rem 0;
    order: 1;
  }

  h1 {
    font-size: 1.2rem;
    margin-bottom: 1.8rem;
    order: 2;
  }

  @media screen and (min-width: 1025px) {
    margin-top: 4rem;
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 1rem;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
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

    .moim-content {
      white-space: pre-line;
    }

    .mini-btn {
      color: #f5a468;
      background: none;
      border: none;
      cursor: pointer;
    }

    .restaurant-data {
      display: flex;
      flex-direction: column;
    }
  }

  .translation-box {
    display: flex;
    flex-flow: column wrap;

    div {
      display: flex;
      flex-flow: row wrap;
    }

    button {
      display: inline-block;
      text-align: left;
      padding: 0;
      margin-left: 32px;
    }

    .translation-txt {
      margin-top: 0.8rem;
      margin-left: 32px;
    }
  }
`;

const H2 = styled.h2`
  font-size: 1rem;
  font-weight: 400;
`;

const ButtonDiv = styled.div`
  position: fixed;
  border-top: 1px solid #a9a9a9;
  background-color: #fff;
  z-index: 1;

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

  @media screen and (max-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 62px;
  }

  @media screen and (min-width: 1025px) {
    border-top: none;
    bottom: 2rem;
    right: 1rem;
    background: none;

    button {
      width: 10rem;
      border-radius: 50px;
    }
  }
`;

function MoimDetail() {
  const { width } = useWindowDimensions();
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
  const [translation, setTranslation] = useState('');
  const [toggleTranslation, setToggleTranslation] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(0);
  const [, setOpen] = useAtom(openSheetAtom);
  const userInfo = useUserInfo();
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
        {userInfo.language === 0 ? '대기 취소하기' : 'Cancel wait'}
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
        {userInfo.language === 0 ? '참여 취소하기' : 'Cancel participation'}
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
        {userInfo.language === 0 ? '수정하기' : 'Modify'}
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
        {userInfo.language === 0 ? '참여하기' : 'Participate in'}
      </button>
    ),
  };

  return (
    <Container>
      {width > 1024 && <DesktopNavbar />}
      <GoBackBar title="">
        {userInfo.id === moimInfo.author.id &&
          diff2hour(moimInfo.time, new Date()) &&
          moimInfo.nowCnt === 1 && (
            <>
              <DeleteBtn
                type="button"
                onClick={() => {
                  if (width > 1024) {
                    document.querySelector('#dialog').showModal();
                  } else {
                    setOpen({
                      open: true,
                      component: (
                        <MobileConfirmDeleteMoim
                          mateId={moimInfo.mates[0].id}
                        />
                      ),
                    });
                  }
                }}
              >
                <DeleteIcon
                  sx={{
                    color: '#a9a9a9',
                  }}
                />
              </DeleteBtn>
              <DesktopConfirmDeleteMoim mateId={moimInfo.mates[0].id} />
            </>
          )}
      </GoBackBar>
      <OrangeBack />
      <MainBox>
        <h1>{moimInfo.title}</h1>
        <button
          type="button"
          className="profile-btn"
          onClick={() => navigate(`/mypage/${moimInfo.author.id}`)}
        >
          <ProfileImage vegeType={moimInfo.author.vegeType} isBig={false} />
          <p>{moimInfo.author.nickname}</p>
        </button>
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
              <button
                className="mini-btn"
                type="button"
                onClick={() =>
                  navigate('/map', {
                    state: {
                      selectedRestauId: moimInfo.restaurant.id,
                      selectedRestauName: moimInfo.restaurant.name,
                      selectedRestauLat: moimInfo.restaurant.latitude,
                      selectedRestauLong: moimInfo.restaurant.longitude,
                    },
                  })
                }
              >
                {userInfo.language !== 0 ? 'View map' : '지도 보기'}
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
          <dd>{`${moimInfo.nowCnt} / ${moimInfo.headCnt}`}</dd>
        </div>

        <div className="info-data translation-box">
          <dt className="sr-only">내용</dt>
          <div>
            <dd>
              <CommentIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
            </dd>
            <dd className="moim-content">{moimInfo.content}</dd>
          </div>
          {!toggleTranslation && (
            <button
              type="button"
              className="mini-btn translate-btn"
              onClick={() => {
                if (translation.length === 0) {
                  getMoimContentTranslation(moimInfo.id, res => {
                    setTranslation(res.data.content_trans);
                  });
                }
                setToggleTranslation(prev => !prev);
              }}
            >
              {userInfo.language === 0 ? '번역 보기' : 'See translation'}
            </button>
          )}
          {toggleTranslation && (
            <>
              <button
                type="button"
                className="mini-btn translate-btn"
                onClick={() => {
                  setToggleTranslation(prev => !prev);
                }}
              >
                {userInfo.language === 0 ? '원문 보기' : 'Collapse translation'}
              </button>
              <dd className="translation-txt">{translation}</dd>
            </>
          )}
        </div>
      </DataList>

      <H2>{userInfo.language === 0 ? '멤버 소개' : 'Members'}</H2>
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
