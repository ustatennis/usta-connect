export function loadDriveApiClient(req) {
  return new Promise((resolve, reject) => {
    gapi.load(
      'client',
      () => {
        gapi.client
          .init(req)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      },
      error => {
        reject(error);
      },
    );
  });
}
