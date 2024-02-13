import { authApi } from '../api/authApi.js';
import { userApi } from '../api/userApi.js';
import {
  getValueFromLocalStorage,
  removeTokens,
  resetAWSConfigs,
} from '../scripts/helpers.js';
import { removeVerifyCodeData, setVerifyCodeData } from '../store/authStore.js';
import { getAWSStore } from '../store/awsStore.js';
import { removeGoogleStore, setGoogleStore } from '../store/googleStore.js';
import {
  getUser,
  removeUser,
  removeUserRole,
  setUser,
} from '../store/userStore.js';
import { getCredentialsForIdentity } from './identity.js';

export async function fetchUser() {
  const userData = getUser();
  const accessToken = getValueFromLocalStorage('access_token');
  if (userData) {
    setGoogleStore();
    return userData;
  }
  try {
    const reqData = {
      AccessToken: accessToken,
    };
    const data = await userApi.getUser(reqData);
    setUser(data);
    setGoogleStore();
    await getCredentialsForIdentity();
    // await getAdminUser();
    return getUser();
  } catch (error) {
    if (getValueFromLocalStorage('refresh_token')) {
      try {
        const REFRESH_TOKEN = getValueFromLocalStorage('refresh_token');
        const { clientId } = getAWSStore();
        const reqData = {
          AuthFlow: 'REFRESH_TOKEN',
          ClientId: clientId,
          AuthParameters: {
            REFRESH_TOKEN,
          },
        };
        const user = await authApi.signIn(reqData);
        setUser(user);
        setGoogleStore();
        await getCredentialsForIdentity();
        // await getAdminUser();
        return getUser();
      } catch (err) {
        removeTokens();
        resetAWSConfigs();
        throw new Error(err);
      }
    } else {
      removeTokens();
      resetAWSConfigs();
      removeUser();
      removeGoogleStore();
      removeUserRole();
      throw new Error(error);
    }
  }
}

export async function updateUserInitialAttributes(affiliation, country) {
  const attributesData = [];
  if (affiliation) {
    attributesData.push({
      Name: 'custom:affiliation',
      Value: affiliation,
    });
  }
  if (country) {
    attributesData.push({
      Name: 'custom:country',
      Value: country,
    });
  }
  const reqData = {
    AccessToken: getValueFromLocalStorage('access_token'),
    UserAttributes: attributesData,
  };
  try {
    return await userApi.updateUserAttributes(reqData);
  } catch (err) {
    throw new Error(err);
  }
}

export async function getEmailVerificationCode() {
  const reqData = {
    AccessToken: getValueFromLocalStorage('access_token'),
    AttributeName: 'email',
  };
  try {
    const res = await userApi.getUserAttributeVerificationCode(reqData);
    setVerifyCodeData(res);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function verifyEmail(code) {
  const reqData = {
    AccessToken: getValueFromLocalStorage('access_token'),
    AttributeName: 'email',
    Code: code,
  };
  try {
    const res = await userApi.verifyUserAttribute(reqData);
    removeVerifyCodeData();
    return res;
  } catch (err) {
    throw new Error(err);
  }
}
