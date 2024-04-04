import { createStore } from '../scripts/helpers.js';
import { USER_ROLES } from '../constants/user.js';

const userStore = createStore();

export function setUser(data) {
  userStore.saveData('user', data);
}

export function getUser() {
  return userStore.getData('user');
}

export function removeUser() {
  userStore.removeData('user');
}

export function setUserRole(role) {
  userStore.saveData('role', { role });
}

export function getUserRole() {
  return userStore.getData('role');
}

export function removeUserRole() {
  userStore.removeData('role');
}

export function isAdminUser() {
  if (!userStore.getData('role')) return USER_ROLES.user;
  return userStore.getData('role').role === USER_ROLES.admin;
}
