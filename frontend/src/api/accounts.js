import apiInstance from '../utils/apiInstance';

/* 카카오 access_token 받아오기 */
export function getToken(data, res, err) {
  const queryStringBody = Object.keys(data)
    .map(k => `${encodeURIComponent(k)}=${encodeURI(data[k])}`)
    .join('&');
  apiInstance
    .post('https://kauth.kakao.com/oauth/token', queryStringBody, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: process.env.REACT_APP_ADMIN_KEY,
      },
    })
    .then(res)
    .catch(err);
}

/* 로그인 > 유저 정보 db에 저장 */
export function apiLogin(data, res, err) {
  apiInstance.post('/accounts/kakao/login/', data).then(res).catch(err);
}

/* 로그인 > 토큰 유효성 검사 */
export function apiVerifyToken(res, err) {
  apiInstance
    .get('/accounts/token/', {
      headers: {
        AuthorizationRefresh: `Bearer ${sessionStorage.getItem(
          'AuthorizationRefresh',
        )}`,
      },
    })
    .then(res)
    .catch(err);
}

/* 닉네임 중복 검사 */
export function apiCheckNickname(data, res, err) {
  apiInstance.get('/accounts/userinfo/', data).then(res).catch(err);
}

/* 채식단계 + 닉네임 변경 */
export function apiPutUserInfo(data, res, err) {
  apiInstance.put('/accounts/userinfo/', data).then(res).catch(err);
}
