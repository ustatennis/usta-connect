class AdminApi {
  async adminGetUser(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminGetUser(req).promise();
    return data;
  }

  async adminInitiateAuth(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminInitiateAuth(req).promise();
    return data;
  }

  async adminUserGlobalSignOut(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminUserGlobalSignOut(req).promise();
    return data;
  }

  async adminConfirmSignUp(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminConfirmSignUp(req).promise();
    return data;
  }

  async adminAddUserToGroup(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminAddUserToGroup(req).promise();
    return data;
  }

  async listUsers(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.listUsers(req).promise();
    return data;
  }

  async adminDeleteUserAttributes(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminDeleteUserAttributes(req).promise();
    return data;
  }

  async adminDisableUser(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminDisableUser(req).promise();
    return data;
  }

  async adminEnableUser(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminEnableUser(req).promise();
    return data;
  }

  async adminRemoveUserFromGroup(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminRemoveUserFromGroup(req).promise();
    return data;
  }

  async adminUpdateUserAttributes(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminUpdateUserAttributes(req).promise();
    return data;
  }

  async adminResetUserPassword(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminResetUserPassword(req).promise();
    return data;
  }

  async adminCreateUser(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminCreateUser(req).promise();
    return data;
  }

  async adminDeleteUser(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.adminDeleteUser(req).promise();
    return data;
  }
}

export const adminApi = new AdminApi();
