import apiInstance from '../utils/apiInstance';

/* 모임 목록 조회 */
export default async function getFeedList() {
  const response = await apiInstance.get('greenmates/community/feeds/');
  return response.data;
}
