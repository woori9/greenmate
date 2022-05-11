import apiInstance from '../utils/apiInstance';

/* 프로필 조회 */
export function getProfileInfo(data, res, err) {
  apiInstance.get(`/greenmates/profile/${data.userId}/`).then(res).catch(err);
}

/* 평가 정보 조회 */
export function getEvaluationLst(data, res, err) {
  apiInstance
    .get(`/greenmates/profile/evaluation/${data.userId}/`)
    .then(res)
    .catch(err);
}

/* 좋아요한 식당 조회 */
export function getLikedRestau(res, err) {
  apiInstance.get(`/greenmates/profile/like/restaurant/`).then(res).catch(err);
}

/* 작성한 식당 리뷰 조회 */
export function getMyReviews(data, res, err) {
  apiInstance
    .get(`/greenmates/profile/feed/r/${data.userId}/`)
    .then(res)
    .catch(err);
}

/* 작성한 피드 조회 */
export function getMyFeeds(data, res, err) {
  apiInstance
    .get(`/greenmates/profile/feed/f/${data.userId}/`)
    .then(res)
    .catch(err);
}

/* 좋아요한 리뷰 조회 */
export function getLikedReivews(res, err) {
  apiInstance.get(`/greenmates/profile/like/feed/r/`).then(res).catch(err);
}

/* 좋아요한 피드 조회 */
export function getLikedFeeds(res, err) {
  apiInstance.get(`/greenmates/profile/like/feed/f/`).then(res).catch(err);
}

/* 식당 등록 요청 */
export function postReqNewRestau(data, res, err) {
  apiInstance
    .post(`/greenmates/profile/request/restaurant/`, data)
    .then(res)
    .catch(err);
}
