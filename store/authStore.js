import { createStore } from '../scripts/helpers.js';

const authStore = createStore();

export function setSignInSessionData(data) {
  authStore.saveData('sessionData', data);
}

export function getSignInSessionData() {
  return authStore.getData('sessionData');
}

export function removeSignInSessionData() {
  authStore.removeData('sessionData');
}

export function setVerifyCodeData(data) {
  authStore.saveData('verifyData', data);
}

export function getVerifyCodeData() {
  return authStore.getData('verifyData');
}

export function removeVerifyCodeData() {
  authStore.removeData('verifyData');
}
