import { loadDriveApiClient } from '../api/googleClientApi.js';
import { googleDriveApi } from '../api/googleDriveApi.js';
import { DISCOVERY_DOCS } from '../constants/googleDrive.js';
import { formatDateTime } from '../scripts/helpers.js';
import { getGoogleStore } from '../store/googleStore.js';

export async function getDataFromFolder(folderId) {
  const googleStore = getGoogleStore();
  if (!googleStore) {
    return;
  }
  const { apiKey, clientId } = googleStore;
  try {
    const connectionReqData = {
      apiKey,
      clientId,
      discoveryDocs: [DISCOVERY_DOCS.discoveryApis],
      // scope: SCOPE.driveReadOnly,
    };
    const documentReqData = {
      q: `'${folderId}' in parents`,
      pageSize: 50,
      fields:
        'files(id, name, mimeType, webViewLink, webContentLink, modifiedTime, createdTime, owners(displayName))',
    };
    await loadDriveApiClient(connectionReqData);
    const response = await googleDriveApi.getDocumentsFromFolder(
      documentReqData,
    );
    const { files } = response.result;
    const res = [];
    if (files && files.length > 0) {
      files.forEach(file => {
        res.push({
          fileName: file.name,
          downloadLink: file?.webContentLink,
          viewLink: file?.webViewLink,
          modifiedTime: formatDateTime(file?.modifiedTime),
          createdTime: formatDateTime(file?.createdTime),
          owner: file?.owners?.[0]?.displayName,
        });
      });
    } else {
      console.log('No public shared documents found.');
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}
