import PropTypes from 'prop-types';
import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';

const Container = styled.div`
  display: flex;
  padding: 1rem 0;
`;
const Img = styled.img`
  min-width: 100px;
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
    width: 43px;
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
    white-space: pre-line;
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

function RestaurantInfoCard({ arrayResult }) {
  const categoryLst = [
    '한식',
    '양식',
    '일식',
    '중식',
    '분식',
    '동남아',
    '인도/중동',
    '술집',
    '카페',
    '베이커리',
  ];
  const { category, score } = arrayResult;
  const restauImg = arrayResult.img_url;
  const { name, address } = arrayResult.res_info;
  const VegeTypes = arrayResult.res_info.vege_types.split(' ');
  return (
    <Container>
      <Img src={restauImg} alt="restaurant-img" />
      <Text>
        <VegeTypeLst>
          {VegeTypes.map((vegeType, idx) => (
            <div key={idx && vegeType} className="vege-type">
              {vegeType}
            </div>
          ))}
        </VegeTypeLst>
        <RestaurantInfo>
          <div className="restaurant-name">
            <p className="name">{name}</p>
            <p className="category">{categoryLst[category]}</p>
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
RestaurantInfoCard.propTypes = {
  arrayResult: PropTypes.shape().isRequired,
};
export default RestaurantInfoCard;
