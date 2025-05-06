import { createStore } from '../scripts/helpers.js';

const awsStore = createStore();

export function setAWSStore() {
  const identityPoolId = window.hlx.IDENTITY_POOL_ID;
  const userPoolId = window.hlx.USER_POOL_ID;
  const clientId = window.hlx.CLIENT_ID;
  const s3UploadBucket = window.hlx.APP_S3_BUCKETS_UPLOAD_BUCKET;
  const s3DownloadBucket = window.hlx.APP_S3_BUCKETS_DOWNLOAD_BUCKET;
  const s3ScannedBucket = window.hlx.APP_S3_BUCKETS_UPLOADED_FILES_BUCKET;
  const appFileStatusEndpoint = window.hlx.APP_FILE_STATUS_API_ENDPOINT;
  const appAuthorizationEndpoint = window.hlx.APP_AUTHORIZATION_API_ENDPOINT;
  const appFileStatusClientId = window.hlx.APP_FILE_STATUS_API_CLIENT_ID;
  const appFileStatusClientSecret =
    window.hlx.APP_FILE_STATUS_API_CLIENT_SECRET;
  const appSinitiEndpoint = window.hlx.APP_SINITI_API_ENDPOINT;
  const appSinitiAuthorizationEndpoint =
    window.hlx.APP_SINITI_AUTHORIZATION_API_ENDPOINT;
  const appSinitiClientId = window.hlx.APP_SINITI_API_CLIENT_ID;
  const appSinitiClientSecret = window.hlx.APP_SINITI_API_CLIENT_SECRET;

  awsStore.saveData('config', {
    identityPoolId,
    userPoolId,
    clientId,
    s3UploadBucket,
    s3DownloadBucket,
    s3ScannedBucket,
    appFileStatusEndpoint,
    appAuthorizationEndpoint,
    appFileStatusClientId,
    appFileStatusClientSecret,
    appSinitiEndpoint,
    appSinitiAuthorizationEndpoint,
    appSinitiClientId,
    appSinitiClientSecret,
  });
}

export function getAWSStore() {
  return awsStore.getData('config');
}

export function removeAWSStore() {
  awsStore.removeData('config');
}
