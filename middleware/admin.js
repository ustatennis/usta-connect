import { adminApi } from '../api/adminApi.js';
import { USER_ROLES } from '../constants/user.js';
import { getValueFromLocalStorage } from '../scripts/helpers.js';
import { getAWSStore } from '../store/awsStore.js';
import { getUser, setUserRole } from '../store/userStore.js';

export async function getAdminUser() {
  const { userPoolId } = getAWSStore();
  const user = getUser();
  if (!user) {
    return;
  }
  if (!AWS.config.credentials) {
    setUserRole(USER_ROLES.user);
    return;
  }

  const reqData = {
    UserPoolId: userPoolId,
    Username: user.Username,
  };

  try {
    const res = await adminApi.adminGetUser(reqData);
    setUserRole(USER_ROLES.admin);
    return res;
  } catch (e) {
    setUserRole(USER_ROLES.user);
  }
}

export async function adminInitiateAuth() {
  const REFRESH_TOKEN = getValueFromLocalStorage('refresh_token');
  const { clientId, userPoolId } = getAWSStore();
  if (!REFRESH_TOKEN) {
    return;
  }
  const reqData = {
    AuthFlow: 'REFRESH_TOKEN',
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      REFRESH_TOKEN,
    },
  };
  try {
    const res = await adminApi.adminInitiateAuth(reqData);
    return res;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

export async function getUsersList(num) {
  let count = num > 0 ? num : 999999;
  const pageSize = num < 50 ? num : 50;
  const { userPoolId } = getAWSStore();
  if (!AWS.config.credentials) {
    return;
  }
  const reqData = {
    UserPoolId: userPoolId,
    Limit: pageSize,
  };
  try {
    let response = [];
    let res = [];
    do {
      reqData.Limit = Math.min(pageSize, count);
      count -= pageSize;
      // eslint-disable-next-line no-await-in-loop
      res = await adminApi.listUsers(reqData);
      if (res.PaginationToken) {
        reqData.PaginationToken = res.PaginationToken;
      }
      response = response.concat(res.Users);
    } while (res.PaginationToken !== undefined && count > 0);
    return response;
  } catch (e) {
    console.error(e);
  }
}

export async function adminConfirmSignUp(username) {
  const { userPoolId } = getAWSStore();
  const reqData = {
    UserPoolId: userPoolId,
    Username: username,
  };
  try {
    const res = await adminApi.adminConfirmSignUp(reqData);
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function adminCreateUser(username, email, temporaryPassword) {
  const { userPoolId } = getAWSStore();
  const reqData = {
    UserPoolId: userPoolId,
    Username: username,
    TemporaryPassword: temporaryPassword,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };
  try {
    const res = await adminApi.adminCreateUser(reqData);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function adminDeleteUser(username) {
  const { userPoolId } = getAWSStore();
  const reqData = {
    UserPoolId: userPoolId,
    Username: username,
  };
  try {
    const res = await adminApi.adminDeleteUser(reqData);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}
