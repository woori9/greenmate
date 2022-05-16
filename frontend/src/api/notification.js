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

const sendNotification = async (targetId, chatType, chatroomId) => {
  if (chatType === 1) {
    try {
      await api.post(`/notifications/personal-chat/${targetId}/`, {
        chatroom_id: chatroomId,
      }); // pairId
    } catch (err) {
      throw new Error(err);
    }
  }

  if (chatType === 2) {
    try {
      await api.post(`/notifications/moim-chat/${targetId}/`, {
        chatroom_id: chatroomId,
      }); // moimId
    } catch (err) {
      throw new Error(err);
    }
  }
};

const getNotifications = async setNotifications => {
  try {
    const { data } = await api.get('/notifications/alirm/');
    setNotifications(data);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteNotification = async notificationId => {
  try {
    await api.delete(`/notifications/alirm/${notificationId}/`);
  } catch (err) {
    throw new Error(err);
  }
};

export {
  sendToken,
  deleteToken,
  sendNotification,
  getNotifications,
  deleteNotification,
};
