import apiInstance from '../utils/apiInstance';

// 피드 목록 조회
export async function getFeedList() {
  const response = await apiInstance.get('/greenmates/community/feeds/');
  return response.data;
}

// 피드 작성
export async function createFeed(data) {
  const response = await apiInstance.post('/greenmates/community/feeds/', data);
  return response.data;
}

// 댓글 조회
export async function getCommentList(feedId) {
  const response = await apiInstance.get(
    `/greenmates/community/comment/${feedId}/`,
  );
  return response.data;
}

// 좋아요 등록
export async function postLike(feedId) {
  const response = await apiInstance.post(
    `/greenmates/community/feed/${feedId}/like/`,
  );
  return response.data;
}

// 피드 번역 보기
export async function getFeedTrans(feedId) {
  const response = await apiInstance.get(
    `/greenmates/community/feed/${feedId}/trans/`,
  );
  return response.data;
}

// 댓글 번역 보기
export async function getCommentTrans(commentId) {
  const response = await apiInstance.get(
    `/greenmates/community/comment/${commentId}/trans/`,
  );
  return response.data;
}
