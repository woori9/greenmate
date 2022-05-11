export default async function serviceWorkerDev() {
  const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
  const response = await navigator.serviceWorker.register(swUrl);
  console.log('FIREBASE SERVICE WORKER LOADED', response);
}
