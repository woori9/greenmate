import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyMoim from './routes/MyMoim';
import MoimForm from './routes/MoimForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mymoim" element={<MyMoim />} />
        <Route path="/mymoim/create" element={<MoimForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
