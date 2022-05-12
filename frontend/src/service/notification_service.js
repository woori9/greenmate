import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';
import { saveNotification } from './chat_service';

const messaging = getMessaging(app);

export const checkToken = setTokenFound => {
  getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_CLOUD_MESSAGE_KEY,
  })
    .then(currentToken => {
      if (currentToken) {
        setTokenFound(true);
      }
    })
    .catch(err => {
      setTokenFound(false);
      throw new Error('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = userId => {
  return onMessage(messaging, payload => {
    const { data } = payload;
    saveNotification(userId, data);
  });
};
