import apiInstance from '../utils/apiInstance';

/* 식당 전체 목록 */
export async function apiGetAllRestau() {
  try {
    const response = await apiInstance.get('/greenmates/restaurant/all/');
    return response.data;
  } catch (error) {
    alert('식당 정보를 불러오는데 실패했습니다');
    return error;
  }
}

/* 식당 검색 결과 */
export function apiGetSearchRestau(data, res, err) {
  apiInstance
    .get(`/greenmates/restaurant/search/?word=${data.keyword}`)
    .then(res)
    .catch(err);
}

/* 식당 기본 정보 */
export function apiGetSummaryRestau(data, res, err) {
  apiInstance
    .get(`/greenmates/restaurant/${data.restauId}/`)
    .then(res)
    .catch(err);
}

/* 식당 상세 정보 */
export function apiGetDetailRestau(data, res, err) {
  apiInstance
    .get(`/greenmates/restaurant/detail/${data.restauId}/`)
    .then(res)
    .catch(err);
}

/* 식당 좋아요 */
export function apiPostLikeRestau(data, res, err) {
  apiInstance
    .post(`/greenmates/restaurant/like/${data.restauId}/`)
    .then(res)
    .catch(err);
}
