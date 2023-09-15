import {
  getValueFromLocalStorage,
  removeTokens,
  resetAWSConfigs,
  setLocalStorage,
} from '../scripts/helpers.js';

class AuthApi {
  async signIn(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.initiateAuth(req).promise();

    if (data?.AuthenticationResult?.AccessToken) {
      setLocalStorage('access_token', data?.AuthenticationResult?.AccessToken);
      setLocalStorage(
        'refresh_token',
        data?.AuthenticationResult?.RefreshToken,
      );
      setLocalStorage('id_token', data?.AuthenticationResult?.IdToken);
    }

    return data;
  }

  async respondToAuthChallenge(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();

    const data = await cognito.respondToAuthChallenge(req).promise();

    if (data?.AuthenticationResult?.AccessToken) {
      setLocalStorage('access_token', data?.AuthenticationResult?.AccessToken);
      setLocalStorage(
        'refresh_token',
        data?.AuthenticationResult?.RefreshToken,
      );
      setLocalStorage('id_token', data?.AuthenticationResult?.IdToken);
    }
    return data;
  }

  async logout() {
    const AccessToken = getValueFromLocalStorage('access_token');
    if (!AccessToken) return;
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const reqData = {
      AccessToken,
    };
    await cognito.globalSignOut(reqData);
    removeTokens();
    resetAWSConfigs();
  }
}

export const authApi = new AuthApi();
