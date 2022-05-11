import { useLocation } from 'react-router-dom';

function EvaluateMoim() {
  const location = useLocation();
  const { mateList } = location.state;
  console.log(mateList);
  return <h1>evaluate</h1>;
}

export default EvaluateMoim;
