import apiInstance from '../utils/apiInstance';

/* 모임 목록 조회 */
export function getMoimList(res, err) {
  apiInstance.get('/greenmates/mates/').then(res).catch(err);
}

/* 사용자의 모임 목록 조회 */
/* HTTP code가 404일 경우 해당 카테고리의 모임 목록이 없는 것! */
/* TODO: 404 에러 처리 */
export function getWaitMoimList(index, res, err) {
  const categoryList = ['wait', 'join', 'myopen', 'finished'];
  apiInstance
    .get(`/greenmates/mates/${categoryList[index]}/`)
    .then(res)
    .catch(err);
}

/* 모임 생성 */
export function createMoim(data, res, err) {
  apiInstance.post('/greenmates/mates/', data).then(res).catch(err);
}

/* 모임 수정 */
export function updateMoim(moimId, data, res, err) {
  apiInstance.put(`/greenmates/mates/${moimId}`, data).then(res).catch(err);
}

/* 모임 상세 조회 */
export function getMoimDetail(moimId, res, err) {
  apiInstance.get(`/greenmates/mates/${moimId}`).then(res).catch(err);
}

/* 모임 검색 */
export function searchMoim(word, res, err) {
  apiInstance
    .get('/greenmates/mates/search/', {
      params: {
        word,
      },
    })
    .then(res)
    .catch(err);
}

/* 모임 필터링 */
export function filterMoim(period, day, res, err) {
  apiInstance
    .get('/greenmates/mates/filter/', { params: { period, day } })
    .then(res)
    .catch(err);
}
