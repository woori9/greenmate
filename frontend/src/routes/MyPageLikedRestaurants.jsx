import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import GoBackBar from '../components/common/GoBackBar';
import { getLikedRestau } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';

const Container = styled.div`
  border-radius: 10px;
  padding: 78px 1rem 5rem 1rem;
  height: calc(100vh - 104px - 4rem);
  @media screen and (min-width: 1025px) {
    margin: 0 2rem 0 34rem;
    border: 1px solid #f2f2f2;
    height: 33rem;
  }
`;
const RestauDiv = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #f2f2f2;
  .info-container {
    display: flex;
    align-items: center;
    .name {
      padding-left: 1rem;
    }
  }
  .type-container {
    display: flex;
    align-items: center;
    p {
      width: 35px;
      height: 17px;
      border-radius: 15px;
      background-color: #fcb448;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
      font-size: 10px;
      color: #fff;
    }
  }
`;
const Img = styled.img`
  min-width: 100px;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  object-fit: cover;
`;
const NoContent = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function MyPageLikedRestaurants() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [likedRestau, setLikedRestau] = useState([]);
  useEffect(() => {
    getLikedRestau(
      res => {
        setLikedRestau(res.data);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  return (
    <>
      {width > 1024 ? (
        <>
          <ResponsiveNavbar />
          <ResponsiveProfile />
        </>
      ) : (
        <GoBackBar title="저장한 식당" />
      )}
      <Container>
        {likedRestau.length ? (
          <>
            {likedRestau.map(restau => (
              <RestauDiv
                key={restau.restaurant}
                onClick={() =>
                  navigate('/map', {
                    state: {
                      selectedRestauId: restau.restaurant,
                    },
                  })
                }
              >
                <div className="info-container">
                  <Img src={restau.img_url} alt="restau-img" />
                  <p className="name">{restau.name}</p>
                </div>
                <div className="type-container">
                  {restau.vege_types.split(' ').map((type, idx) => {
                    return <p key={idx && type}>{type}</p>;
                  })}
                </div>
              </RestauDiv>
            ))}
          </>
        ) : (
          <NoContent>
            <p>좋아요한 식당이 없습니다</p>
          </NoContent>
        )}
      </Container>
    </>
  );
}

export default MyPageLikedRestaurants;
