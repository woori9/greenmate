import api from '../utils/apiInstance';

const sendToken = async token => {
  try {
    const { data } = await api.post('/notifications/set/', {
      registration_token: token,
    });

    return data.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteToken = async tokenId => {
  try {
    await api.delete(`/notifications/cancel/${tokenId}/`);
  } catch (err) {
    throw new Error(err);
  }
};

export { sendToken, deleteToken };
