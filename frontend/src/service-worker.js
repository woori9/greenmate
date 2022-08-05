export default async function serviceWorker() {

  const firebaseConfig = new URLSearchParams({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  }).toString();

  const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js?${firebaseConfig}`;
  const response = await navigator.serviceWorker.register(swUrl);
  console.log('FIREBASE SERVICE WORKER LOADED', response);
}
