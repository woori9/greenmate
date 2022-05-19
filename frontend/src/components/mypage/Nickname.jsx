import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms/accounts';

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

function Nickname({ profileInfo, isDesktop }) {
  const [{ language }] = useAtom(userInfoAtom);
  const vegeTypes = [
    '비건',
    '락토',
    '오보',
    '락토오보',
    '페스코',
    '폴로',
    '관심',
  ];
  const engVegeTypes = [
    'vegan',
    'lacto',
    'ovo',
    'lacto-ovo',
    'pesco',
    'pollo',
    'flexitarian',
  ];
  const getVegeType = idx => {
    if (language === 0) {
      return vegeTypes[idx];
    }
    return engVegeTypes[idx];
  };
  return (
    <NameBox isDesktop={isDesktop}>
      <p className="nickname">{profileInfo.nickname}</p>
      <p className="vege-type">{getVegeType(profileInfo.vege_type)}</p>
    </NameBox>
  );
}
Nickname.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};
export default Nickname;
