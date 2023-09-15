class ForgotPasswordApi {
  async forgotPassword(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.forgotPassword(req).promise();
    return data;
  }

  async confirmForgotPassword(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.confirmForgotPassword(req).promise();
    return data;
  }

  async resendConfirmationCode(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.resendConfirmationCode(req).promise();
    return data;
  }
}

export const forgotPasswordApi = new ForgotPasswordApi();
