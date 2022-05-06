import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';
import resImg from '../../assets/logo.png';

const Container = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #f2f2f2;
`;
const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  object-fit: cover;
`;
const Text = styled.div`
  margin: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const VegeTypeLst = styled.div`
  display: flex;
  .vege-type {
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
`;
const RestaurantInfo = styled.div`
  .restaurant-name {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .name {
      font-size: 15px;
      margin-right: 10px;
    }
    .category {
      color: #a9a9a9;
      font-size: 10px;
    }
  }
  .restaurant-address {
    p {
      color: #a9a9a9;
      font-size: 10px;
    }
  }
`;
const RestaurantRate = styled.div`
  display: flex;
  align-items: center;
  .star-icon {
    color: #fcb448;
    font-size: 15px;
  }
  p {
    color: #a9a9a9;
    font-size: 10px;
  }
`;

function RestaurantInfoCard() {
  const category = '한식';
  const score = '4.5';
  const name = '불난버섯집';
  const address = '평택시 고덕면';
  const vegeTypes = '락토';
  return (
    <Container>
      <Img src={resImg} alt="restaurant-img" />
      <Text>
        <VegeTypeLst>
          <div className="vege-type">{vegeTypes}</div>
          <div className="vege-type">{vegeTypes}</div>
        </VegeTypeLst>
        <RestaurantInfo>
          <div className="restaurant-name">
            <p className="name">{name}</p>
            <p className="category">{category}</p>
          </div>
          <div className="restaurant-address">
            <p>{address}</p>
          </div>
        </RestaurantInfo>
        <RestaurantRate>
          <StarIcon className="star-icon" />
          <p>{score}</p>
        </RestaurantRate>
      </Text>
    </Container>
  );
}

export default RestaurantInfoCard;
