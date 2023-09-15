import { createStore } from '../scripts/helpers.js';

const globalDatesStore = createStore();

export function setDates(data) {
  globalDatesStore.saveData('dateRange', data);
}

export function getDates() {
  return globalDatesStore.getData('dateRange');
}

export function removeDates() {
  globalDatesStore.removeData('dateRange');
}
