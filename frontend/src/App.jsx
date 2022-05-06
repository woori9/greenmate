import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KakaoRedirectHandler from './routes/KakaoRedirectHandler';
import Signup from './routes/Signup';
import Home from './routes/Home';
import Community from './routes/Community';
import CommunityForm from './routes/CommunityForm';
import Map from './routes/Map';
import MyMoim from './routes/MyMoim';
import MoimForm from './routes/MoimForm';
import MoimDetail from './routes/MoimDetail';
import MyPage from './routes/MyPage';
import Chat from './routes/Chat';

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
        <Route path="/community/form" element={<CommunityForm />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mymoim" element={<MyMoim />} />
        <Route path="/moim/form" element={<MoimForm />} />
        <Route path="/moim/:moimId" element={<MoimDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
