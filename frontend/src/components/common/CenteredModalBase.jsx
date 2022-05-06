import styled from 'styled-components';
import PropTypes from 'prop-types';

const Dialog = styled.dialog`
  text-align: center;
  padding: 3rem 4rem 5.8rem 4rem;
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
        background-color: #f9795d;
      }

      &:last-child {
        background-color: #f2f2f2;
      }
    }
  }
`;

function CenteredModalBase({ mainAction, children }) {
  // h1 태그로 모달 헤더, p 태그로 모달 내용 전달
  // mainAction: 확인 클릭 시 실행할 함수 전달
  // document.querySelector('#dialog').showModal(); 을 통해 모달 열어야 함 (show 메서드 사용할 경우 반투명 배경 적용 x)

  return (
    <Dialog id="dialog">
      {children}
      <div className="button-div">
        <button type="button" value="default" onClick={() => mainAction()}>
          확인
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

CenteredModalBase.propTypes = {
  mainAction: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
};

export default CenteredModalBase;
