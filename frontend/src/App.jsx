import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Community from './routes/Community';
import Map from './routes/Map';
import MyMoim from './routes/MyMoim';
import MyPage from './routes/MyPage';
import Chat from './routes/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mymoim" element={<MyMoim />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
