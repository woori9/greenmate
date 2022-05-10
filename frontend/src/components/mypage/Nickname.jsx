import PropTypes from 'prop-types';
import styled from 'styled-components';

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isDesktop ? 'center' : null)};
  margin-right: ${props => (props.isDesktop ? null : '1rem')};
  .nickname {
    font-size: 15px;
    font-weight: 700;
    padding-top: ${props => (props.isDesktop ? '1rem' : null)};
    padding-bottom: 3px;
  }
  .vege-type {
    font-size: 13px;
    color: #ff9900;
    padding-bottom: ${props => (props.isDesktop ? '1rem' : null)};
  }
`;

function Nickname({ userInfo, isDesktop }) {
  const vegeTypes = [
    '비건',
    '락토',
    '오보',
    '락토오보',
    '페스토',
    '폴로',
    '관심',
  ];
  return (
    <NameBox isDesktop={isDesktop}>
      <p className="nickname">{userInfo.nickname}</p>
      <p className="vege-type">{vegeTypes[userInfo.vege_type]}</p>
    </NameBox>
  );
}
Nickname.propTypes = {
  userInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};
export default Nickname;
