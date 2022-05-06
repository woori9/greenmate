import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CommentIcon from '@mui/icons-material/Comment';
import styled from 'styled-components';
import GoBackBar from '../components/common/GoBackBar';
import UserInfo from '../components/moim/UserInfo';
import ProfileImage from '../components/common/ProfileImage';
import formattedDatetime from '../utils/formattedDate';
import { categoryAtom } from '../atoms/moim';
import { diff2hour } from '../utils/timestamp';
// import { applyMoim, exitMoim } from '../api/moim';

// 모임 상세 api 수정된 후 수정 필요!!!!
// 응답으로 받은 userMateStatus 값에 따라 버튼 다르게 보여주기

const OrangeBack = styled.div`
  position: absolute;
  top: 52px;
  left: 0;
  background-color: #f5bd68;
  width: 100vw;
  height: 7rem;
  z-index: -1;
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
  const location = useLocation();
  const {
    id,
    restaurant,
    author,
    title,
    content,
    time,
    nowCnt,
    headCnt,
    mates,
  } = location.state.moimInfo;
  const [selectedCategory] = useAtom(categoryAtom);
  const navigate = useNavigate();

  // TODO: 대기 취소, 참여 취소 api 연결
  const bottomButtons = [
    <button type="button">대기 취소하기</button>,
    <button type="button">참여 취소하기</button>,
    <button
      type="button"
      onClick={() =>
        navigate('/moim/form', {
          state: {
            id,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            originalTitle: title,
            originalContent: content,
            originalTime: time,
            originalHeadCnt: headCnt,
          },
        })
      }
    >
      수정하기
    </button>,
    null,
    <button type="button">참여하기</button>,
  ];

  return (
    <>
      <GoBackBar title="">
        {/* TODO: category 대신 author.id === 로그인 유저 id 비교 */}
        {selectedCategory === 2 &&
          !diff2hour(time, new Date()) &&
          nowCnt === 1 && (
            <DeleteBtn
              type="button"
              onClick={() => {
                // TODO: 정말 삭제하시겠습니까 bottomsheet
                console.log('delete click');
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
        <h1>{title}</h1>
        <ProfileImage isBig={false} />
        <p>{author.nickname}</p>
      </MainBox>
      <DataList>
        <div className="info-data">
          <dt className="sr-only">시간</dt>
          <dd>
            <AccessTimeIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <dd>{formattedDatetime(time)}</dd>
        </div>

        <div className="info-data">
          <dt className="sr-only">장소</dt>
          <dd>
            <StorefrontIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <div className="restaurant-data">
            <dd>
              {restaurant.nameKr}
              {/* TODO: 지도 연결 */}
              <button className="go-map-btn" type="button">
                지도 보기
              </button>
            </dd>
            <dd>{restaurant.addressKr}</dd>
          </div>
        </div>

        <div className="info-data">
          <dt className="sr-only">인원</dt>
          <dd>
            <PeopleAltIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <dd>{headCnt}명</dd>
        </div>

        <div className="info-data">
          <dt className="sr-only">내용</dt>
          <dd>
            <CommentIcon sx={{ color: '#a9a9a9', marginRight: '0.5rem' }} />
          </dd>
          <dd>{content}</dd>
        </div>
      </DataList>

      <H2>멤버 소개</H2>
      {mates &&
        mates.length &&
        mates.map(mate => <UserInfo userInfo={mate} key={mate.userId} />)}
      {/* TODO : 카테고리 대신 각각 대기 중인지, 참여 중인지, author인지 비교해서 넣기 (main에서도 대기/참여/진행 받기 위함) */}
      {diff2hour(time, new Date()) && (
        <ButtonDiv>{bottomButtons[selectedCategory]}</ButtonDiv>
      )}
    </>
  );
}

export default MoimDetail;
