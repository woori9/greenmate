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
import ManageMember from './routes/ManageMember';
import MyPage from './routes/MyPage';
import MyPageLikedRestaurants from './routes/MyPageLikedRestaurants';
import MyPageLikedFeeds from './routes/MyPageLikedFeeds';
import MyPageLikedReview from './routes/MyPageLikedReview';
import MyPageEvaluation from './routes/MyPageEvaluation';
import MyPageReviews from './routes/MyPageReviews';
import MyPageFeeds from './routes/MyPageFeeds';
import MyPageSetting from './routes/MyPageSetting';
import Chat from './routes/Chat';
import BottomSheetBase from './components/common/BottomSheetBase';
import ChatRoom from './components/chat/ChatRoom';

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
        <Route path="/moim/:moimId/member" element={<ManageMember />} />
        <Route path="/mypage/:userPk" element={<MyPage />} />
        <Route
          path="/mypage/:userPk/liked-restaurants"
          element={<MyPageLikedRestaurants />}
        />
        <Route
          path="/mypage/:userPk/liked-feeds"
          element={<MyPageLikedFeeds />}
        />
        <Route
          path="/mypage/:userPk/liked-reviews"
          element={<MyPageLikedReview />}
        />
        <Route
          path="/mypage/:userPk/evaluation"
          element={<MyPageEvaluation />}
        />
        <Route path="/mypage/:userPk/my-reviews" element={<MyPageReviews />} />
        <Route path="/mypage/:userPk/my-feeds" element={<MyPageFeeds />} />
        <Route path="/mypage/:userPk/setting" element={<MyPageSetting />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chatRoom" element={<ChatRoom />} />
      </Routes>
      <BottomSheetBase />
    </BrowserRouter>
  );
}

export default App;
