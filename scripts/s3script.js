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

export async function listFiles() {
  const s3Client = createS3Client();
  const objects = [];
  const config = getAWSStore();
  // let buckets = ["s3upload-ui-bucket-stage"]
  // const buckets = [config.s3DownloadBucket, config.s3ScannedBucket];
  try {
    let values = await s3Client
      .listObjects({
        Bucket: config.s3DownloadBucket,
      })
      .promise();
    console.log(values);
    extractFileMetatadata(values, objects, config.s3DownloadBucket);
    // objects.push(...values.Contents);
    values = await s3Client
      .listObjects({
        Bucket: config.s3ScannedBucket,
      })
      .promise();
    // console.log(values);
    extractFileMetatadata(values, objects, config.s3ScannedBucket);
  } catch (errr) {
    console.error('Exception occurred while fetching files.');
  }
  objects.sort((a, b) => b.createdTime - a.createdTime);
  return objects;
}

// export async function uploadS3Object(files) {
//   const s3Client = createS3Client();
//   const config = getAWSStore();
//   for (const file of files) {
//     try {
//       await s3Client.upload({
//         Key: constructKey(file),
//         Body: file,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }
