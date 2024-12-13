import { getAWSStore } from '../store/awsStore.js';
import { getValueFromLocalStorage, formatDateTime, setLocalStorage } from './helpers.js';
import { getUser } from '../store/userStore.js';
import { logOut  } from '../middleware/auth.js';

// Checks user object data is not found will logout.
async function isUserValid(){
  const user = getUser();
  if(user && user.sub){
    return;
  }
  await logOut();
}


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
  await isUserValid();
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
    await logOut();
  }
  return s3Client;
}

export async function getObject(details) {
  const s3Client = await createS3Client();
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
      // fileName: file.Key.split('/').pop(),
      fileName: file.Key,
      Key: file.Key,
      Bucket: bucket,
      size: file?.Size,
      downloadLink: file?.webContentLink,
      md5: file?.ETag.replace(/"/g, ''),
      viewLink: file?.webViewLink,
      modifiedTime: formatDateTime(file?.LastModified),
      createdTime: file?.LastModified,
      owner: file?.Owner?.[0]?.DisplayName,
    });
  });
}

async function fetchFilestoObject(
  s3Client,
  config,
  objects,
  bucketName,
  max,
  user,
) {
  const values = await s3Client
    .listObjectsV2({
      Bucket: bucketName,
      Prefix: `private/${user.sub}/${user.Username}`,
      MaxKeys: max,
    })
    .promise();
  // console.log(values);
  extractFileMetatadata(values, objects, bucketName);
}

export async function listFiles(bucket, max, user) {
  const s3Client = await createS3Client();
  let objects = [];
  const config = getAWSStore();
  try {
    await fetchFilestoObject(s3Client, config, objects, bucket, max, user);
  } catch (errr) {
    console.log('Exception occurred while fetching files.');
  }
  objects = objects.filter(obj => !obj.Key.endsWith('/'));
  return objects;
}

function constructFileKey(fileName, pUser) {
  const user = !pUser ? getUser() : pUser;
  let uploadFileKey = `private/${user.sub}/${user.Username}/`;
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

export async function uploadS3Objects(files, bucket, user) {
  const s3Client = await createS3Client();
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
      Bucket: bucket,
      Key: constructFileKey(file.name, user),
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

export async function getFileStatuses(user, retry = 3) {
  const config = getAWSStore();
  const myHeaders = await getAuthHeaders();

  const raw = JSON.stringify({
    "username": user.Username
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  try{
    let response = await fetch(config.appFileStatusEndpoint + "/v1/usta-connect/file/status", requestOptions)
    if(response.status === 404){
      if(retry > 0){
        await authenticateFileStatusEndpoint();
        return await getFileStatuses(user, retry - 1);
      }
    }else{
      response = await response.json();
      return response.files;
    } 
  }catch(e){
    console.log("unable to fetch files status, retrying ", retry - 3 )
    if(retry > 0){
      await authenticateFileStatusEndpoint();
      return await getFileStatuses(user, retry - 1);
    }
  }
  return [];
}

export async function fetchAllFacilities(state, text) {
  let fac = [];
  let page = 1;
  let resp=[];
  do {
    resp = await fetchFacilities(state, text, page);
    if (resp.length>0) fac.push(...resp);
    page++;;
  }
  while (resp.length>0);
  return fac;
}

export async function fetchFacilities(state, text, page, size){
  const config = getAWSStore();
  const headers = await getAuthHeaders();

  const raw = JSON.stringify({
    "state": state || "",
    "text": text || "",
    "page" : page,
    "size" : size
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw
  };

  try{
    let response = await fetch(config.appFileStatusEndpoint + "/v1/usta-connect/facilities/lookup", requestOptions);
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response.data;
  }catch(e){
    console.log(e)
  }
  return [];
}

export async function fetchFacilityById(facilityId){
  const headers = await getAuthHeaders();
  const config =  getAWSStore();
  const requestOptions = {
    method: "GET",
    headers: headers
  };
  try{
    let response = await fetch(config.appFileStatusEndpoint+ "/v1/usta-connect/facilities/" + facilityId, requestOptions);
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response;
  }catch(e){
    console.log(e)
  }
  return {}; 
}

export async function createOrUpdateFacility(facility){
  const raw = JSON.stringify(facility);
  const headers = await getAuthHeaders();
  const config =  getAWSStore();
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
  };
  try{
    let response = await fetch(config.appFileStatusEndpoint+ "/v1/usta-connect/facilities", requestOptions);
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response;
  }catch(e){
    console.log(e)
  }
  return {}; 
}

export async function fetchReferenceCategories(){
  const headers = await getAuthHeaders();
  const config =  getAWSStore();
  const requestOptions = {
    method: "GET",
    headers: headers
  };
  try{
    let response = await fetch(config.appFileStatusEndpoint+ "/v1/usta-connect/facilities/reference/category-types", requestOptions);
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response;
  }catch(e){
    console.log(e)
  }
  return {}; 
}

export async function fetchReferenceDataByCatergory(category){
  const headers = await getAuthHeaders();
  const config =  getAWSStore();
  const requestOptions = {
    method: "GET",
    headers: headers
  };
  try{
    let response = await fetch(config.appFileStatusEndpoint+ "/v1/usta-connect/facilities/reference?category=" + category, requestOptions);
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response;
  }catch(e){
    console.log(e)
  }
  return {}; 
}


async function getAuthHeaders() {
  if (!getValueFromLocalStorage('api_file_status_token')) {
    await authenticateFileStatusEndpoint();
  }
  let authToken = getValueFromLocalStorage('api_file_status_token');
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${authToken}`);
  return myHeaders;
}

async function authenticateFileStatusEndpoint() {
  let config = getAWSStore();
  const myHeaders = new Headers();
  const encodedCred = btoa(`${config.appFileStatusClientId}:${config.appFileStatusClientSecret}`);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${encodedCred}`);
  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };
  try {
    let response = await fetch(config.appAuthorizationEndpoint + "/oauth2/token", requestOptions);
    response = await response.json();
    setLocalStorage("api_file_status_token", response.access_token);
  } catch (e) {
    console.log("File Status Authentication Failed");
  }
}

// https://s3upload-ui-scanned-prod.s3.us-east-1.amazonaws.com/?list-type=2&prefix=private%2Fus-east-1%3Aa0ea4540-cbcc-4ff9-9b53-2c258f383593%2F
// https://s3upload-ui-scanned-stage.s3.amazonaws.com/?list-type=2&prefix=private%2Fus-east-1%3A68ffed30-3180-48d2-8b37-2e07596c5389

// https://s3upload-ui-upload-prod.s3.us-east-1.amazonaws.com/private/us-east-1%3Aa0ea4540-cbcc-4ff9-9b53-2c258f383593/sai.theja%40contractor.usta.com/logo192_1708367868662.png?x-id=PutObjecthttps://s3upload-ui-upload-prod.s3.us-east-1.amazonaws.com/private/us-east-1%3Aa0ea4540-cbcc-4ff9-9b53-2c258f383593/sai.theja%40contractor.usta.com/logo192_1708367868662.png?x-id=PutObject
async function getSinitiAuthHeaders() {
  if (!getValueFromLocalStorage('api_siniti_status_token')) {
    await authenticateSinitiEndpoint();
  }
  let authToken = getValueFromLocalStorage('api_file_status_token');
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${authToken}`);
  myHeaders.append("X-Internal-Traffic",'true');
  myHeaders.append("Access-Control-Allow-Methods",'POST')
  myHeaders.append("Access-Control-Allow-Headers",'authorization,content-type')
  myHeaders.append("Access-Control-Allow-Origin",'*')
  return myHeaders;
}
async function authenticateSinitiEndpoint() {
  let config = getAWSStore();
  const myHeaders = new Headers();
  const encodedCred = btoa(`${config.appSinitiClientId}:${config.appSinitiClientSecret}`);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${encodedCred}`);
  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };
  try {
    let response = await fetch(config.appSinitiAuthorizationEndpoint + "/oauth2/token", requestOptions);
    response = await response.json();
    setLocalStorage("api_siniti_status_token", response.access_token);
  } catch (e) {
    console.log("Siniti Authentication Failed");
  }
}
export async function addressValidation(address){
  const raw = JSON.stringify(address);
  const headers = await getSinitiAuthHeaders();
  const config =  getAWSStore();
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
  };
  try{
    let response = await fetch(config.appSinitiEndpoint+ "/v1/address/validation", requestOptions);
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response;
  }catch(e){
    console.log(e)
  }
  return {}; 
}
export async function validateAddressV2 (address)
{
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "key": "EF31-BC17-AR21-HT29",
  "geocode": true,
  "addresses": [
  address
  ]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};


  try{
    let response = await fetch("https://api.addressy.com/Cleansing/International/Batch/v1.00/json4.ws", requestOptions)
    if(response.status != 200){
      //Handle error status.
    }
    response = await response.json();
    return response;
  }catch(e){
    console.log(e)
  }
  return []; 
}