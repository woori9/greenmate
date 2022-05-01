import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KakaoRedirectHandler from './routes/KakaoRedirectHandler';
import Signup from './routes/Signup';
import Home from './routes/Home';
import Community from './routes/Community';
import Map from './routes/Map';
import MyMoim from './routes/MyMoim';
import MoimForm from './routes/MoimForm';
import MyPage from './routes/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: 로그인 필수 분기처리 */}
        <Route
          path="/oauth/callback/kakao"
          element={<KakaoRedirectHandler />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mymoim" element={<MyMoim />} />
        <Route path="/mymoim/create" element={<MoimForm />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
