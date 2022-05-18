import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../../atoms/accounts';

const Ul = styled.ul`
  padding: 0;
  display: flex;
  justify-content: space-between;
  width: ${props => (props.isDesktop ? '80%' : '40%')};
  padding: ${props => (props.isDesktop ? '1rem 0' : null)};
`;
const Li = styled.li`
  list-style: none;
  text-align: center;
  font-size: 13px;
  .name {
    padding-bottom: 5px;
    font-size: 70%;
  }
`;

function FollowerStatus({ profileInfo, isDesktop }) {
  const [{ language }] = useAtom(userInfoAtom);
  const statusLst = [
    {
      name: `${language === 0 ? '팔로워' : 'follower'}`,
      cnt: profileInfo.follower_cnt,
    },
    {
      name: `${language === 0 ? '팔로잉' : 'following'}`,
      cnt: profileInfo.following_cnt,
    },
    {
      name: `${language === 0 ? '그린메이트' : 'greenmate'}`,
      cnt: profileInfo.moim_cnt,
    },
  ];
  return (
    <Ul isDesktop={isDesktop}>
      {statusLst.map(lst => (
        <Li key={lst.name}>
          <p className="name">{lst.name}</p>
          <p className="num-cnt">{lst.cnt}</p>
        </Li>
      ))}
    </Ul>
  );
}
FollowerStatus.propTypes = {
  profileInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

export default FollowerStatus;
