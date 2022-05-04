import apiInstance from '../utils/apiInstance';

/* 모임 목록 조회 */
export function getMoimList(res, err) {
  apiInstance.get('/greenmates/mates/').then(res).catch(err);
}

/* 사용자가 대기 중인 모임 목록 조회 */
export function getWaitMoimList(res, err) {
  apiInstance.get('/greenmates/mates/wait/').then(res).catch(err);
}

/* 사용자가 참여 중인 모임 목록 조회 */
export function getJoinMoimList(res, err) {
  apiInstance.get('/greenmates/mates/join/').then(res).catch(err);
}

/* 사용자가 진행 중인 모임 목록 조회 */
export function getMyOpenMoimList(res, err) {
  apiInstance.get('/greenmates/mates/myopen/').then(res).catch(err);
}

/* 사용자의 종료된 모임 목록 조회 */
export function getFinishedMoimList(res, err) {
  apiInstance.get('/greenmates/mates/finished/').then(res).catch(err);
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
