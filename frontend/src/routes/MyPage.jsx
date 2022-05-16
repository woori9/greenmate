import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import ResponsiveProfile from '../components/mypage/profile/ResponsiveProfile';

const Page = styled.div`
  min-height: 800px;
`;

function MyPage() {
  return (
    <Page>
      <ResponsiveNavbar />
      <ResponsiveProfile />
    </Page>
  );
}

export default MyPage;
