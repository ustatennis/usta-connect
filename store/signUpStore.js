import { createStore } from '../scripts/helpers.js';

const signUpStore = createStore();

export function setSignUpFormData(data) {
  signUpStore.saveData('formData', data);
}

export function getSignUpFormData() {
  return signUpStore.getData('formData');
}

export function removeSignUpFormData() {
  signUpStore.removeData('formData');
}

export function setSignUpCodeData(data) {
  signUpStore.saveData('codeData', data);
}

export function getSignUpCodeData() {
  return signUpStore.getData('codeData');
}

export function removeSignUpCodeData() {
  signUpStore.removeData('codeData');
}
