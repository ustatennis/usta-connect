import { getAWSStore } from '../store/awsStore.js';
import { getValueFromLocalStorage, formatDateTime } from './helpers.js';
import { getUser } from '../store/userStore.js';

export function getFederationId(identityPoolId) {
  // fedeation Id = aws.cognito.identity-id.us-east-1:a5df722d-28a6-408b-a10c-8a391051bfb5
  return getValueFromLocalStorage(`aws.cognito.identity-id.${identityPoolId}`);
}

export function getUserPoolIDP(identityPoolId) {
  return getValueFromLocalStorage(
    `aws.cognito.identity-providers.${identityPoolId}`,
  );
}

export async function createS3Client() {
  const config = getAWSStore();
  // Get the identity pool ID.
  const { identityPoolId } = config;

  const idToken = getValueFromLocalStorage('id_token');
  // Create a new Amazon S3 client.
  let s3Client = null;
  const userPoolIdIDP = getUserPoolIDP(identityPoolId);
  const logins = {
    [`${userPoolIdIDP}`]: idToken,
  };
  try {
    s3Client = new AWS.S3({
      region: AWS.config.region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: logins,
      }),
    });
  } catch (e) {
    console.error(e);
  }
  return s3Client;
}

export function getObject(details) {
  const s3Client = createS3Client();
  // const bucketName = config.
  try {
    return s3Client
      .getObject({
        Bucket: details.Bucket,
        Key: details.Key,
      })
      .promise();
  } catch (e) {
    return new Promise(reject => {
      reject(new Error('download failed'));
    });
  }
}

function extractFileMetatadata(values, objects, bucket) {
  values.Contents.forEach(file => {
    objects.push({
      fileName: file.Key.split('/').pop(),
      Key: file.Key,
      Bucket: bucket,
      size: file?.Size,
      downloadLink: file?.webContentLink,
      viewLink: file?.webViewLink,
      modifiedTime: formatDateTime(file?.LastModified),
      createdTime: file?.LastModified,
      owner: file?.Owner?.[0]?.DisplayName,
    });
  });
}

async function fetchFilestoObject(s3Client, config, objects, bucketName, max) {
  const values = await s3Client
    .listObjectsV2({
      Bucket: bucketName,
      Prefix: `private/${getFederationId(config.identityPoolId)}/`,
      MaxKeys: max,
    })
    .promise();
  // console.log(values);
  extractFileMetatadata(values, objects, bucketName);
}

export async function listFiles(bucket, max) {
  const s3Client = await createS3Client();
  const objects = [];
  const config = getAWSStore();
  try {
    await fetchFilestoObject(s3Client, config, objects, bucket, max);
  } catch (errr) {
    console.error('Exception occurred while fetching files.');
  }
  return objects;
}

function constructFileKey(fileName) {
  const user = getUser();
  const config = getAWSStore();
  let uploadFileKey = `private/${getFederationId(config.identityPoolId)}/${
    user.Username
  }/`;
  const currDateStr = `_${new Date().getTime()}`;
  const fileExtIndex = fileName.search(/\.\w{3}$/g);
  if (fileExtIndex >= 0) {
    uploadFileKey +=
      fileName.slice(0, fileExtIndex) +
      currDateStr +
      fileName.slice(fileExtIndex);
  } else {
    uploadFileKey += fileName + currDateStr;
  }
  return uploadFileKey;
}

export function triggerUpdate() {
  console.log('triggering custom evnet');
  const customEvent = new CustomEvent('uploaded', {
    detail: 'data changed/new files uploaded',
  });
  document.dispatchEvent(customEvent);
}

export async function uploadS3Objects(files) {
  const s3Client = await createS3Client();
  const config = getAWSStore();
  const output = document.getElementById('output');
  output.innerHTML = '';
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploadStatusDiv = document.createElement('div');
    uploadStatusDiv.className = 'upload-status';

    const progressBar = document.createElement('progress');
    progressBar.id = `upload-progress-${i}`;
    progressBar.className = 'upload-progress';
    progressBar.value = 0;
    progressBar.max = 100;

    const uploadHeader = document.createElement('div');
    uploadHeader.className = 'upload-header';
    uploadHeader.textContent = 'Uploading in Progress';

    const uploadBody = document.createElement('div');
    uploadBody.className = 'upload-body';
    uploadBody.textContent = file.name;

    uploadStatusDiv.appendChild(progressBar);
    uploadStatusDiv.appendChild(uploadHeader);
    uploadStatusDiv.appendChild(uploadBody);

    output.appendChild(uploadStatusDiv);
    // const user = getUser();
    // console.log(getUser());
    const params = {
      // TODO - bucketchange - 's3upload-ui-bucket-stage'
      Bucket: config.s3UploadBucket,
      Key: constructFileKey(file.name),
      Body: file,
      ACL: 'private', // Adjust ACL permissions as needed
    };

    const request = s3Client.upload(params);
    request.on('httpUploadProgress', function (progress) {
      const percentUploaded = Math.round(
        (progress.loaded / progress.total) * 100,
      );
      const progressBarU = document.getElementById(`upload-progress-${i}`);
      progressBarU.value = percentUploaded;
    });

    request.send(function (err /* , data */) {
      if (err) {
        console.error('Error uploading file:', err);
        uploadHeader.textContent = 'Upload Failed';
        document.getElementById(`upload-progress-${i}`).value = 0;
        document
          .getElementById(`upload-progress-${i}`)
          .classList.add('upload-errors');
      } else {
        uploadHeader.textContent = 'Upload Successful';
        document.getElementById(`upload-progress-${i}`).value = 100;
        document
          .getElementById(`upload-progress-${i}`)
          .classList.add('upload-success');
        triggerUpdate();
      }
    });
  }
}

// https://s3upload-ui-scanned-prod.s3.us-east-1.amazonaws.com/?list-type=2&prefix=private%2Fus-east-1%3Aa0ea4540-cbcc-4ff9-9b53-2c258f383593%2F
// https://s3upload-ui-scanned-stage.s3.amazonaws.com/?list-type=2&prefix=private%2Fus-east-1%3A68ffed30-3180-48d2-8b37-2e07596c5389

// https://s3upload-ui-upload-prod.s3.us-east-1.amazonaws.com/private/us-east-1%3Aa0ea4540-cbcc-4ff9-9b53-2c258f383593/sai.theja%40contractor.usta.com/logo192_1708367868662.png?x-id=PutObjecthttps://s3upload-ui-upload-prod.s3.us-east-1.amazonaws.com/private/us-east-1%3Aa0ea4540-cbcc-4ff9-9b53-2c258f383593/sai.theja%40contractor.usta.com/logo192_1708367868662.png?x-id=PutObject
