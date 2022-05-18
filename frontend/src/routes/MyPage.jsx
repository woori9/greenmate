import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';

const Container = styled.div`
  min-height: calc(100vh + 62px);
`;

function MyPage() {
  return (
    <Container>
      <ResponsiveNavbar />
      <ResponsiveProfile />
    </Container>
  );
}

export default MyPage;
