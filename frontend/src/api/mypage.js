import apiInstance from '../utils/apiInstance';

/* 프로필 조회 */
export default function getProfileInfo(data, res, err) {
  apiInstance.get(`/greenmates/profile/${data.userId}/`).then(res).catch(err);
}
