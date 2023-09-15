class GoogleDriveApi {
  async getDocumentsFromFolder(req) {
    const response = await gapi.client.drive.files.list(req);
    return response;
  }
}

export const googleDriveApi = new GoogleDriveApi();
