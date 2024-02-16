import { getAWSStore } from '../store/awsStore.js';
import { getValueFromLocalStorage, formatDateTime } from './helpers.js';

export function createS3Client() {
  const config = getAWSStore();
  // Get the identity pool ID.
  const { identityPoolId } = config;
  const USER_POOL_ID = config.userPoolId;
  const idToken = getValueFromLocalStorage('id_token');
  // Create a new Amazon S3 client.
  let s3Client = null;
  const logins = {
    [`cognito-idp.${AWS.config.region}.amazonaws.com/${USER_POOL_ID}`]: idToken,
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

async function fetchFilestoObject(s3Client, config, objects, bucketName) {
  const values = await s3Client
    .listObjectsV2({
      Bucket: bucketName,
      Prefix: `private/${config.identityPoolId}`,
    })
    .promise();
  // console.log(values);
  extractFileMetatadata(values, objects, bucketName);
}

export async function listFiles(bucket) {
  const s3Client = createS3Client();
  const objects = [];
  const config = getAWSStore();
  try {
    await fetchFilestoObject(s3Client, config, objects, bucket);
  } catch (errr) {
    console.error('Exception occurred while fetching files.');
  }
  objects.sort((a, b) => b.createdTime - a.createdTime);
  return objects;
}

export async function uploadS3Objects(files) {
  const s3Client = createS3Client();
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

    const params = {
      // TODO - bucketchange - 's3upload-ui-bucket-stage'
      Bucket: config.s3UploadBucket,
      Key: `private/${config.identityPoolId}/${file.name}`,
      Body: file,
      // ACL: 'public-read' // Adjust ACL permissions as needed
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
      }
    });
  }
}
