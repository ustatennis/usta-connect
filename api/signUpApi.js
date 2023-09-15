class SignUpApi {
  async signUp(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.signUp(req).promise();
    return data;
  }

  async confirmSignUp(req) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const data = await cognito.confirmSignUp(req).promise();
    return data;
  }
}

export const signUpApi = new SignUpApi();
