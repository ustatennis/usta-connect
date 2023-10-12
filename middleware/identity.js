import { identityApi } from '../api/identityApi.js';
import { USER_ROLES } from '../constants/user.js';
import { getValueFromLocalStorage, setAWSConfigs } from '../scripts/helpers.js';
import { getAWSStore } from '../store/awsStore.js';
import { getUser, removeUserRole, setUserRole } from '../store/userStore.js';

export async function getCredentialsForIdentity() {
  const { userPoolId, identityPoolId } = getAWSStore();
  const idToken = getValueFromLocalStorage('id_token');
  const user = getUser();

  if (!user) {
    removeUserRole();
    return;
  }

  const logins = {
    [`cognito-idp.${AWS.config.region}.amazonaws.com/${userPoolId}`]: idToken,
  };
  const reqData = {
    IdentityPoolId: identityPoolId,
    Logins: logins,
  };
  try {
    const res = await identityApi.getCredentialsForIdentity(reqData);
    setAWSConfigs(res);
    return res;
  } catch (e) {
    try {
      console.log('retry cognito login');
      const res = await identityApi.getCredentialsForIdentity(reqData);
      setAWSConfigs(res);
      return res;
    } catch (er) {
      setUserRole(USER_ROLES.user);
    }
  }
}
