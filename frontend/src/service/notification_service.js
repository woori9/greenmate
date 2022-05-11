import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';
import { saveNotification } from './chat_service';

const messaging = getMessaging(app);

export const checkToken = async setTokenFound => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_CLOUD_MESSAGE_KEY,
    });

    if (currentToken) {
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log(
        'No registration token available. Request permission to generate one.',
      );
      setTokenFound(false);
      // shows on the UI that permission is required
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const onMessageListener = userId => {
  onMessage(messaging, payload => {
    const { notification } = payload;
    saveNotification(userId, notification);
  });
};
