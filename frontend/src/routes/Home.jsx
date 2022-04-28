import styled from 'styled-components';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';

const Check = styled.div`
  border: 1px solid red;
`;

function Home() {
  return (
    <Check>
      <ResponsiveNavbar />
      <h1>그린메이트그린메이트그린메이트그린메이트그린메이트그린메이트</h1>
    </Check>
  );
}

export default Home;
