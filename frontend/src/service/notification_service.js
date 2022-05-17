import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';
import { sendToken, getNotifications } from '../api/notification';

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

export const onMessageListener = (handleOpenSnackbar, setNotifications) => {
  return onMessage(messaging, payload => {
    const { data } = payload;
    console.log('Foreground Message', data);
    const { body } = data;
    getNotifications(setNotifications);
    handleOpenSnackbar(body);
  });
};
