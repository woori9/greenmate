import styled from 'styled-components';
import vegeTypeList from '../../utils/vegeTypeList';

const DescriptionVegeTypeContainer = styled.div`
  display: flex;
  justify-content: start;
  p {
    font-size: 10px;
  }
`;

const DescriptionVegeTypeTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 3rem;
  padding-bottom: 0.3rem;
  margin-right: 1rem;
  img {
    width: 60%;
  }
  p {
    color: black;
    font-size: 0.6rem;
    white-space: nowrap;
  }
`;

function VegeTypeInform() {
  return (
    <>
      {vegeTypeList.map(type => {
        return (
          <DescriptionVegeTypeContainer key={type.id}>
            <DescriptionVegeTypeTitle>
              <img src={type.icon} alt={type.id} />
              <p>{type.sentence}</p>
            </DescriptionVegeTypeTitle>
            <p>{type.rule}</p>
          </DescriptionVegeTypeContainer>
        );
      })}
    </>
  );
}

export default VegeTypeInform;
