import PropTypes from 'prop-types';
import styled from 'styled-components';

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
  }
`;

function FollowerStatus({ userInfo, isDesktop }) {
  const statusLst = [
    {
      name: '팔로워',
      cnt: userInfo.follower_cnt,
    },
    {
      name: '팔로잉',
      cnt: userInfo.following_cnt,
    },
    {
      name: '모임횟수',
      cnt: userInfo.moim_cnt,
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
  userInfo: PropTypes.shape().isRequired,
  isDesktop: PropTypes.bool.isRequired,
};

export default FollowerStatus;
