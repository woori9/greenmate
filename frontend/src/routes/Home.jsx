import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';

const Container = styled.div`
  border: 1px solid red;
`;

function Home() {
  return (
    <Container>
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim />
      <h1>그린메이트그린메이트 그린메이트그린메이트그린메이트그린메이트</h1>
    </Container>
  );
}

export default Home;
