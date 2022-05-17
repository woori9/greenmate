import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import vegeTypeList from '../../utils/vegeTypeList';

const Dialog = styled.dialog`
  text-align: center;
  padding: 1rem 1rem 4rem 1rem;
  border: none;
  border-radius: 10px;
  margin: auto;
  z-index: 5;

  &:backdrop {
    background: rgba(255, 0, 0, 0.3);
    z-index: 4;
  }

  h1 {
    font-size: 20px;
    font-weight: 400;
  }

  p {
    margin-top: 1rem;
  }

  .button-div {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      width: 50%;
      height: 2.8rem;
      border: none;

      &:first-child {
        background-color: #fcb448;
      }

      &:last-child {
        background-color: #f2f2f2;
      }
    }
  }
`;

const TypeLstContainer = styled.div`
  display: flex;
  padding: 1rem 0;
`;
const Page = styled.div`
  position: fixed;
  top: 45%;
  padding: 1rem;
  z-index: 6;
  background-color: #fff;
  border-radius: 10px;
  filter: drop-shadow(0 -1px 4px rgba(0, 0, 0, 0.25));
`;
const Description = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  color: #a9a9a9;
  p {
    margin: auto 0;
    font-size: 13px;
  }
  .descript-page {
    display: none;
  }
  :hover {
    cursor: pointer;
    ${Page} {
      display: block;
    }
  }
`;
const VegeTypeBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 5rem;

  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    border: ${props => props.selected && '3px solid #fcb448'};
    border-radius: ${props => props.selected && '50%'};

    img {
      width: 90%;
    }
  }
  p {
    font-size: 0.7rem;
    white-space: nowrap;
    color: ${props => (props.selected ? '#fcb448' : 'black')};
  }
  :hover {
    cursor: pointer;
  }
`;
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
  }
`;

function SettingCenteredModalBase({ vegeType, mainAction }) {
  // h1 태그로 모달 헤더, p 태그로 모달 내용 전달
  // mainAction: 확인 클릭 시 실행할 함수 전달
  // document.querySelector('#dialog').showModal(); 을 통해 모달 열어야 함 (show 메서드 사용할 경우 반투명 배경 적용 x)
  const [newVegeType, setNewVegeType] = useState(vegeType);

  return (
    <Dialog id="dialog">
      <p>채식타입</p>
      <Description>
        <Page className="descript-page">
          {vegeTypeList.map(ele => {
            return (
              <DescriptionVegeTypeContainer key={ele.title}>
                <DescriptionVegeTypeTitle>
                  <img src={ele.icon} alt={ele.id} />
                  <p>{ele.title}</p>
                </DescriptionVegeTypeTitle>
                <p>{ele.rule}</p>
              </DescriptionVegeTypeContainer>
            );
          })}
        </Page>
        <p className="descript-title">채식 타입 안내</p>
        <ChevronRightIcon />
      </Description>
      <TypeLstContainer>
        {vegeTypeList.map(ele => {
          return (
            <VegeTypeBox
              selected={newVegeType === ele.id}
              key={ele.title}
              onClick={() => setNewVegeType(ele.id)}
            >
              <div className="img-box">
                <img src={ele.icon} alt={ele.id} />
              </div>
              <p>{ele.title}</p>
            </VegeTypeBox>
          );
        })}
      </TypeLstContainer>
      <div className="button-div">
        <button
          type="button"
          value="default"
          onClick={() => {
            mainAction(newVegeType);
            document.querySelector('#dialog').close();
          }}
        >
          변경
        </button>
        <button
          type="button"
          value="cancel"
          onClick={() => document.querySelector('#dialog').close()}
        >
          취소
        </button>
      </div>
    </Dialog>
  );
}

SettingCenteredModalBase.propTypes = {
  mainAction: PropTypes.func.isRequired,
  vegeType: PropTypes.number.isRequired,
};

export default SettingCenteredModalBase;
