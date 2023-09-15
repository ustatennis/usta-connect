class UserApi {
  async getUser(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.getUser(req).promise();
    return data;
  }

  async updateUserAttributes(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.updateUserAttributes(req).promise();
    return data;
  }

  async getUserAttributeVerificationCode(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.getUserAttributeVerificationCode(req).promise();
    return data;
  }

  async verifyUserAttribute(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.verifyUserAttribute(req).promise();
    return data;
  }
}

export const userApi = new UserApi();
