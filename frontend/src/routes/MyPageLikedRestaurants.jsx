import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';
import GoBackBar from '../components/common/GoBackBar';
import { getLikedRestau } from '../api/mypage';
import useWindowDimensions from '../utils/windowDimension';
import logo from '../assets/logo.png';

const Container = styled.div`
  margin: ${props =>
    props.isDesktop ? '0 2rem 0 34rem' : '78px 1rem 5rem 1rem'};
  border: ${props => (props.isDesktop ? '1px solid #f2f2f2' : null)};
  border-radius: 10px;
  height: ${props =>
    props.isDesktop
      ? 'calc(100vh - 60px - 2rem)'
      : 'calc(100vh - 104px - 4rem)'};
`;
const RestauDiv = styled.div`
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
  width: 100px;
  height: 100px;
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
  const isDesktop = width > 1024;
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
        <GoBackBar title="좋아요한 식당" />
      )}
      <Container isDesktop={isDesktop}>
        {/* <RestauDiv>
          <div className="info-container">
            <Img src={logo} alt="restau-img" />
            <p className="name">제목</p>
          </div>
          <div className="type-container">
            <p>내용</p>
          </div>
        </RestauDiv> */}
        {likedRestau.length ? (
          <>
            {likedRestau.map(restau => (
              <RestauDiv>
                <div className="info-container">
                  <Img src={logo} alt="restau-img" />
                  <p className="name">{restau.name}</p>
                </div>
                <div className="type-container">
                  {restau.vege_types.map(type => (
                    <p>{type}</p>
                  ))}
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
