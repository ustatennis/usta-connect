import { createStore } from '../scripts/helpers.js';

const forgotPasswordStore = createStore();

export function setFPFormData(data) {
  forgotPasswordStore.saveData('formData', data);
}

export function getFPFormData() {
  return forgotPasswordStore.getData('formData');
}

export function removeFPFormData() {
  forgotPasswordStore.removeData('formData');
}

export function setFPCodeData(data) {
  forgotPasswordStore.saveData('codeData', data);
}

export function getFPCodeData() {
  return forgotPasswordStore.getData('codeData');
}

export function removeFPCodeData() {
  forgotPasswordStore.removeData('codeData');
}
