import { authApi } from '../api/authApi.js';
import {
  getSignInSessionData,
  setSignInSessionData,
} from '../store/authStore.js';
import { getAWSStore } from '../store/awsStore.js';
import { removeUser, removeUserRole, setUser } from '../store/userStore.js';
import { getAdminUser } from './admin.js';
import { getCredentialsForIdentity } from './identity.js';
import { fetchUser } from './user.js';

export async function logIn(username, password) {
  const { clientId } = getAWSStore();
  try {
    const reqData = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientMetadata: { rawUsername: username },
    };
    const data = await authApi.signIn(reqData);
    if (data?.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      setSignInSessionData(data);
    } else if (data.Username) {
      setUser(data);
      await getCredentialsForIdentity();
      await getAdminUser();
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function respondToAuthChallenge(formData) {
  const sessionData = getSignInSessionData();
  const { clientId } = getAWSStore();
  const reqData = {
    ChallengeName: sessionData?.ChallengeName,
    ChallengeResponses: {
      USERNAME: sessionData?.ChallengeParameters?.USER_ID_FOR_SRP,
      NEW_PASSWORD: formData?.newPassword,
      'userAttributes.phone_number': formData?.phoneNumber,
      'userAttributes.name': formData?.name,
    },
    ClientId: clientId,
    Session: sessionData.Session,
  };

  try {
    const data = await authApi.respondToAuthChallenge(reqData);
    await fetchUser();
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function logOut() {
  try {
    await authApi.logout();
    removeUser();
    removeUserRole();
    window.location.reload();
  } catch {
    removeUser();
    removeUserRole();
    window.location.reload();
  }
}
