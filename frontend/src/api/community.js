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

// 피드 삭제
export async function deleteFeed(feedId) {
  const response = await apiInstance.delete(
    `/greenmates/community/feed/${feedId}`,
  );
  return response.data;
}

// 댓글 조회
export async function getCommentList(feedId) {
  const response = await apiInstance.get(
    `/greenmates/community/comment/${feedId}/`,
  );
  return response.data;
}

// 댓글 작성
export async function createComment({ feedId, data }) {
  const response = await apiInstance.post(
    `/greenmates/community/comment/${feedId}/`,
    data,
  );
  return response.data;
}

// 댓글 삭제
export async function deleteComment(commentId) {
  const response = await apiInstance.delete(
    `/greenmates/community/comment/detail/${commentId}/`,
  );
  return response.data;
}

// 피드 좋아요 등록
export async function postFeedLike(feedId) {
  const response = await apiInstance.post(
    `/greenmates/community/feed/${feedId}/like/`,
  );
  return response.data;
}

// 댓글 좋아요 등록
export async function postCommentLike(commentId) {
  const response = await apiInstance.post(
    `/greenmates/community/feed/${commentId}/like/`,
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
