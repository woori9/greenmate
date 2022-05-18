/* eslint-disable camelcase */
export default function formatUserInfo(userInfo) {
  const { id, nickname, vege_type } = userInfo;
  const formattedInfo = {
    id: `${id}`,
    nickname,
    vegeType: vege_type,
  };
  return formattedInfo;
}
