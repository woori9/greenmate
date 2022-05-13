import apiInstance from '../utils/apiInstance';

/* 모임 목록 조회 */
export function getMoimList(res, err) {
  apiInstance.get('/greenmates/mates/').then(res).catch(err);
}

/* 사용자의 모임 목록 조회 */
export function getMyMoimList(value, res, err) {
  const categoryDict = { 0: 'wait', 1: 'join', 5: 'myopen', 4: 'finished' };
  apiInstance
    .get(`/greenmates/mates/${categoryDict[value]}/`)
    .then(res)
    .catch(err);
}

/* 모임 생성 */
export function createMoim(data, res, err) {
  apiInstance.post('/greenmates/mates/', data).then(res).catch(err);
}

/* 모임 수정 */
export function updateMoim(moimId, data, res, err) {
  apiInstance.put(`/greenmates/mates/${moimId}/`, data).then(res).catch(err);
}

/* 모임 상세 조회 */
export function getMoimDetail(moimId, res, err) {
  apiInstance.get(`/greenmates/mates/${moimId}/`).then(res).catch(err);
}

/* 모임 상세 내용 번역 보기 */
export function getMoimContentTranslation(moimId, res, err) {
  apiInstance
    .get(`/greenmates/mates/translate/${moimId}/`)
    .then(res)
    .catch(err);
}

/* 모임 검색 및 필터 */
export function searchMoim(word, period, day, res, err) {
  apiInstance
    .get('/greenmates/mates/search/', {
      params: {
        word,
        period,
        day,
      },
    })
    .then(res)
    .catch(err);
}

/* 모임 대기 신청 */
export async function applyMoim(moimId, res, err) {
  await apiInstance
    .post(`/greenmates/mates/apply/${moimId}/`)
    .then(res)
    .catch(err);
}

/* 모임 대기 취소 */
export async function cancleApplyMoim(mateId, res, err) {
  await apiInstance
    .delete(`/greenmates/mates/cancle/${mateId}/`)
    .then(res)
    .catch(err);
}

/* 모임 참가자 수락 */
export async function acceptGuest(mateId) {
  try {
    const { data } = await apiInstance.put(
      `/greenmates/mates/accept/${mateId}/`,
    );
    return data;
  } catch (err) {
    return err;
  }
}

/* 모임 참가자 거절 */
export async function declineGuest(mateId) {
  try {
    const { data } = await apiInstance.put(
      `/greenmates/mates/decline/${mateId}/`,
    );
    return data;
  } catch (err) {
    return err;
  }
}

/* 모임 나가기 */
export async function exitMoim(mateId) {
  try {
    const { data } = await apiInstance.delete(
      `/greenmates/mates/out/${mateId}/`,
    );
    return data;
  } catch (err) {
    return err;
  }
}

export function evaluateMoim(evaluationList, res, err) {
  apiInstance
    .post('/greenmates/mates/evaluate/', evaluationList)
    .then(res)
    .catch(err);
}
