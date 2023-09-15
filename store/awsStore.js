import { createStore } from '../scripts/helpers.js';

const awsStore = createStore();

export function setAWSStore() {
  const identityPoolId = window.hlx.IDENTITY_POOL_ID;
  const userPoolId = window.hlx.USER_POOL_ID;
  const clientId = window.hlx.CLIENT_ID;
  awsStore.saveData('config', { identityPoolId, userPoolId, clientId });
}

export function getAWSStore() {
  return awsStore.getData('config');
}

export function removeAWSStore() {
  awsStore.removeData('config');
}
