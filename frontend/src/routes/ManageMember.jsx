import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAtom } from 'jotai';
import DesktopNavbar from '../components/common/navbar/DesktopNavbar';
import GoBackBar from '../components/common/GoBackBar';
import UserInfo from '../components/moim/UserInfo';
import ConfirmExitMember from '../components/moim/ConfirmExitMember';
import { openSheetAtom } from '../atoms/bottomSheet';
import { getMoimDetail, acceptGuest, declineGuest } from '../api/moim';
import { snakeToCamel } from '../utils/formatKey';
import { joinMoimChat } from '../service/chat_service';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  max-width: 800px;
  padding: 5rem 1rem 5rem 1rem;
  margin: 0 auto;

  .go-back-bar {
    left: 0;
  }

  @media screen and (min-width: 1025px) {
    padding: 112px 2rem 0 calc(130px + 2rem);

    .go-back-bar {
      background-color: #f2f2f2;
      left: 130px;

      p {
        position: absolute;
        left: 45%;
      }
    }
  }
`;

const MemberBox = styled.div`
  margin: 2rem 0;

  h2 {
    font-size: 1.25rem;
    font-weight: 400;

    span {
      color: #f5a468;
    }
  }

  @media screen and (min-width: 1025px) {
    h2 {
      margin-bottom: 1rem;
    }
  }
`;

const Ul = styled.ul`
  padding-left: 0;
  list-style: none;

  .wait-item {
    .button-list {
      display: flex;
      justify-content: space-evenly;

      button {
        width: 8.5rem;
        height: 1.8rem;
        background: none;
        border: 1px solid #a9a9a9;
        border-radius: 5px;

        &:first-child {
          color: #ff5858;
        }
      }
    }
  }

  .join-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media screen and (min-width: 1025px) {
    .wait-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem 0.5rem 0;

      button:first-child {
        margin-right: 1rem;
      }
    }

    .join-item {
      padding-right: 1rem;
    }

    .wait-item,
    .join-item {
      box-shadow: 0px 4px 5px 4px rgba(242, 242, 242, 1);
    }
  }
`;

function ManageMember() {
  const { width } = useWindowDimensions();
  const { moimId } = useParams();
  const [needUpdate, setNeedUpdate] = useState(0);
  const [waitList, setWaitList] = useState([]);
  const [joinList, setJoinList] = useState([]);
  const [, setOpen] = useAtom(openSheetAtom);

  function accept(mateId) {
    acceptGuest(mateId)
      .then(() => setNeedUpdate(prev => prev + 1))
      .catch(err => console.log(err));
  }

  function decline(mateId) {
    declineGuest(mateId)
      .then(() => setNeedUpdate(prev => prev + 1))
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getMoimDetail(
      moimId,
      res => {
        const waitData = [];
        const joinData = [];
        const formattedMates = res.data.mates.map(item => snakeToCamel(item));
        formattedMates.forEach((mate, idx) => {
          if (mate.mateStatus === 0) {
            waitData.push(mate);
          } else if (mate.mateStatus === 1 && idx !== 0) {
            joinData.push(mate);
          }
        });
        setWaitList(waitData);
        setJoinList(joinData);
      },
      err => console.log(err),
    );
  }, [needUpdate]);

  return (
    <Container>
      {width > 1024 && <DesktopNavbar />}
      <GoBackBar title="멤버 관리" />
      <MemberBox>
        <h2>
          참여 대기 멤버 <span>{waitList.length}명</span>
        </h2>
        {waitList.length > 0 && (
          <Ul>
            {waitList.map(member => (
              <li key={member.id} className="wait-item">
                <UserInfo userInfo={member} />
                <div className="button-list">
                  <button type="button" onClick={() => decline(member.id)}>
                    거절
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      accept(member.id);
                      joinMoimChat(moimId, `${member.userId}`);
                    }}
                  >
                    수락
                  </button>
                </div>
              </li>
            ))}
          </Ul>
        )}
      </MemberBox>
      <MemberBox>
        <h2>참여 확정 멤버</h2>
        {joinList.length > 0 && (
          <Ul>
            {joinList.map(member => (
              <li key={member.id} className="join-item">
                <UserInfo userInfo={member} />
                <LogoutIcon
                  onClick={() => {
                    setOpen({
                      open: true,
                      component: (
                        <ConfirmExitMember
                          mateId={member.id}
                          userId={member.userId}
                          moimId={moimId}
                          setNeedUpdate={setNeedUpdate}
                        />
                      ),
                    });
                  }}
                  sx={{ color: '#797979' }}
                />
              </li>
            ))}
          </Ul>
        )}
      </MemberBox>
    </Container>
  );
}

export default ManageMember;
