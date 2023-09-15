class IdentityApi {
  async getCredentialsForIdentity(req) {
    const credentials = new AWS.CognitoIdentityCredentials(req, {
      region: AWS.config.region,
    });
    await credentials.getPromise();
    return credentials;
  }
}

export const identityApi = new IdentityApi();
