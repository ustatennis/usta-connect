import { createStore } from '../scripts/helpers.js';

const awsStore = createStore();

export function setAWSStore() {
  const identityPoolId = window.hlx.IDENTITY_POOL_ID;
  const userPoolId = window.hlx.USER_POOL_ID;
  const clientId = window.hlx.CLIENT_ID;
  const s3UploadBucket = window.hlx.APP_S3_BUCKETS_UPLOAD_BUCKET;
  const s3DownloadBucket = window.hlx.APP_S3_BUCKETS_DOWNLOAD_BUCKET;
  const s3ScannedBucket = window.hlx.APP_S3_BUCKETS_UPLOADED_FILES_BUCKET;
  debugger;
  awsStore.saveData('config', {
    identityPoolId,
    userPoolId,
    clientId,
    s3UploadBucket,
    s3DownloadBucket,
    s3ScannedBucket,
  });
}

export function getAWSStore() {
  return awsStore.getData('config');
}

export function removeAWSStore() {
  awsStore.removeData('config');
}
