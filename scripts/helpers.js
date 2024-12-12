/**
 * Sets a key-value pair in the local storage, overwriting any existing value for the provided key.
 * @param {string} key - The key for the data to be stored.
 * @param {string} value - The value of the data to be stored.
 */
export function setLocalStorage(key, value) {
  if (!value) {
    return;
  }
  // Check if there is already a value stored for the provided key
  const existingValue = localStorage.getItem(key);

  // If there is a value, remove it from the local storage
  if (existingValue !== null) {
    localStorage.removeItem(key);
  }

  // Set the new key-value pair in the local storage
  localStorage.setItem(key, value);
}

/**
 * Deletes a key-value pair from the local storage based on the provided key.
 * @param {string} key - The key of the data to be removed from the local storage.
 */
export function deleteLocalStorage(key) {
  localStorage.removeItem(key);
}

/**
 * Retrieves a value from localStorage with the given key.
 * @param {string} key - The key to retrieve the value for.
 * @returns {string|null} - The value associated with the key, or null if it doesn't exist.
 */
export function getValueFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value === null ? null : value;
}

/**
 * Navigate to a new URL with optional query parameters.
 * @param {string} path - The new path to navigate to.
 * @param {Object} [query] - An optional object containing key-value pairs to include in the query string.
 */
export function redirectTo(path, query = {}) {
  let queryString = '';

  if (Object.keys(query).length > 0) {
    queryString = `?${Object.keys(query)
      .map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`,
      )
      .join('&')}`;
  }

  window.location.href = path + queryString;
}

/**
 * Retrieves query parameters from the current URL and returns them as an object
 * @returns {object} An object containing query parameters as key-value pairs
 */
export function getQueryParams() {
  const queryParams = {};
  const queryString = window.location.search;

  if (queryString) {
    const pairs = queryString.substring(1).split('&');

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      const key = decodeURIComponent(pair[0]);
      queryParams[key] = decodeURIComponent(pair[1] || '');
    }
  }

  return queryParams;
}

/**
 * Constructs a URL with a given path and query parameters.
 *
 * @param {string} path - The path to append query parameters to.
 * @param {Object} [query] - An optional object of key-value pairs to include as query parameters.
 * @returns {string} - The URL with query parameters included.
 */
export function buildUrl(path, query = {}) {
  const queryString = Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Remove access, id and refresh tokens from local storage.
 */
export function removeTokens() {
  deleteLocalStorage('access_token');
  deleteLocalStorage('refresh_token');
  deleteLocalStorage('id_token');
  deleteLocalStorage('api_file_status_token')
}

export function resetAWSConfigs() {
  AWS.config.update({
    credentials: undefined,
    sessionToken: undefined,
  });
}

export function setAWSConfigs(credentials) {
  AWS.config.update({
    credentials,
    sessionToken: credentials.sessionToken,
  });
}

export function setInitialAWSConfigs() {
  AWS.config.update({ region: 'us-east-1' });
}

/**

 Creates a data storage object with methods to save and get data by key.
 @returns {Object} An object with methods to save and get data.
 */
export function createStore() {
  const data = {};

  /**

   Saves data with the given key to the storage object.
   @param {string} key - The key to store the data under.
   @param {*} value - The value to store under the given key.
   */
  function saveData(key, value) {
    if (key) {
      data[key] = value;
    }
  }

  /**

   Retrieves the data stored under the given key from the storage object.
   @param {string} key - The key to retrieve the data for.
   @returns {*} The data stored under the given key.
   */
  function getData(key) {
    return data[key];
  }

  /**

   Remove the data stored under the given key from the storage object.
   @param {string} key - The key to remove the data for.
   */
  function removeData(key) {
    if (key && data[key]) {
      delete data[key];
    }
  }

  return { saveData, getData, removeData };
}

export function padZero(value) {
  return value.toString().padStart(2, '0');
}

export function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // const hours = padZero(date.getHours());
  // const minutes = padZero(date.getMinutes());
  // const seconds = padZero(date.getSeconds());

  // const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const formattedDateTime = ` ${month} / ${day} / ${year}`;

  return formattedDateTime;
}

export function iconColorBar() {
  console.log();
  return `<div class="colorbar"></div>`;
}
