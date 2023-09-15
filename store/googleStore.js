import { createStore } from '../scripts/helpers.js';

const googleStore = createStore();

export function setGoogleStore() {
  const apiKey = window.hlx.GOOGLE_API_KEY;
  const clientId = window.hlx.GOOGLE_CLIENT_ID;
  googleStore.saveData('config', { apiKey, clientId });
}

export function getGoogleStore() {
  return googleStore.getData('config');
}

export function removeGoogleStore() {
  googleStore.removeData('config');
}
