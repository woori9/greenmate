/* eslint-disable camelcase */
export default function formatUserInfo(userInfo) {
  const { id, nickname, vege_type, vegeType } = userInfo;
  const formattedInfo = {
    id: `${id}`,
    nickname,
    vegeType: vege_type || vegeType,
  };
  return formattedInfo;
}
