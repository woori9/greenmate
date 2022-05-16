import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';
import { sendToken } from '../api/notification';

const messaging = getMessaging(app);

export const checkToken = async setTokenId => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_CLOUD_MESSAGE_KEY,
    });

    if (currentToken) {
      const tokenId = await sendToken(currentToken);
      setTokenId(tokenId);
    } else {
      setTokenId(null);
    }
  } catch (err) {
    setTokenId(null);
    throw new Error(err);
  }
};

export const onMessageListener = handleOpenSnackbar => {
  return onMessage(messaging, payload => {
    const { data } = payload;
    console.log('Foreground Message', data);
    const { body } = data;

    const sampleNotification = {
      id: '3',
      title: body,
      sentBy: '1',
      createdAt: new Date().toLocaleDateString(),
    };
    handleOpenSnackbar(sampleNotification.title);
  });
};
