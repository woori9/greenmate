import styled from 'styled-components';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import ResponsiveNavbar from '../components/common/navbar/ResponsiveNavbar';
import FloatingActionBtn from '../components/common/FloatingActionBtn';
import moim from '../atoms/moim';

const Container = styled.div`
  border: 1px solid red;
`;

function Home() {
  const [, setSelectedCategory] = useAtom(moim);

  useEffect(() => {
    setSelectedCategory(null);
  }, []);

  return (
    <Container>
      <ResponsiveNavbar />
      <FloatingActionBtn isForMoim />
      <h1>그린메이트그린메이트 그린메이트그린메이트그린메이트그린메이트</h1>
    </Container>
  );
}

export default Home;
