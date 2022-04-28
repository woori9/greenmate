import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyMoim from './routes/MyMoim';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mymoim" element={<MyMoim />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
