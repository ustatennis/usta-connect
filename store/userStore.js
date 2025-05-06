import { createStore } from '../scripts/helpers.js';
import { USER_ROLES, COGNITO_GROUPS } from '../constants/user.js';

const userStore = createStore();

export function setUser(data) {
  if (data.UserAttributes) {
    data.UserAttributes.forEach(attr => {
      data[attr.Name] = attr.Value;
    });
  }
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

export function setGroups(groups) {
  userStore.saveData('groups', groups);
}

export function getGroups() {
  return userStore.getData('groups');
}

export function isFacilityGroupMember() {
  const groups = getGroups();
  if (!groups) return false;
  return groups.some(g => g.GroupName === COGNITO_GROUPS.facility_admin);
}
