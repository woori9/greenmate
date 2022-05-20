import api from '../utils/apiInstance';

const sendToken = async token => {
  try {
    const result = await api.post('/notifications/set/', {
      registration_token: token,
    });
    if (result.statusCode === 409 && result.message === '중복된 토큰입니다.') {
      // eslint-disable-next-line no-alert
      return alert(
        '알림 설정이 제대로 되지 않았습니다. 알림 기능을 사용하려면 브라우저의 알림을 껐다가 다시 켜주세요.',
      );
    }

    return result.data.id;
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

const deleteNotification = notificationId => {
  try {
    api.delete(`/notifications/alirm/${notificationId}/`);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteAllNotification = () => {
  try {
    api.delete('/notifications/alirm');
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
  deleteAllNotification,
};
