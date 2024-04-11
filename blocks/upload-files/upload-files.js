// import { FOLDER_IDS } from '../../constants/googleDrive.js';
import '../../jslibraries/ag-grid-community.min.js';
// import { getDataFromFolder } from '../../middleware/googleDrive.js';
// import BtnCellRenderer from './btn-cell-renderer.js';
import { formatBytes } from '../../jslibraries/utility/utility.js';
import { uploadS3Objects, listFiles } from '../../scripts/s3script.js';
import { getAWSStore } from '../../store/awsStore.js';
import { getUser } from '../../store/userStore.js';

export default async function decorate(block) {
  function formatBytesGetter(params) {
    return formatBytes(params.data.size, 0);
  }
  async function fetchFiles() {
    const config = getAWSStore();
    const user = getUser();
    let files = await listFiles(config.s3ScannedBucket, 1000, user);
    files.sort((a, b) => b.createdTime - a.createdTime);
    files = files.slice(0, 3);
    files.forEach(f => {
      f.fileName = f.fileName.split('/').pop();
    });
    return files;
  }

  // const files = await getDataFromFolder(FOLDER_IDS.availablefiles);
  let files = await fetchFiles();
  const isHomePage = window.location.pathname === '/';

  // const div = document.createElement('div');
  // div.id = 'upload-files-grid';
  // div.style = isHomePage
  //     ? 'height: 500px; width:100%;font-size:12px'
  //     : 'height: 500px; width:100%;font-size:12px';
  // div.className = 'ag-theme-alpine';

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>Upload Files</div>
    <div class='grid-header-center'>&nbsp;</div>
    <div class='grid-header-right'>

    </div>
    </div>`;
  } else {
    divheader.innerHTML = `<div class='grid-header'>
        <div class='grid-header-left'>Upload Files</div>
        <div class='grid-header-center'>&nbsp;</div>
        <div class='grid-header-right'>
    
        </div>
        </div>`;
  }

  const divcolumns = document.createElement('div');
  divcolumns.className = 'flexrow';
  divcolumns.innerHTML = `
    <div class='column'>
    <div class='button-row'>
    <input type="file" name="uploadedFile" class="inputfile" id="uploadedFile" data-multiple-caption="{count} files selected" multiple>
    <label for="uploadedFile" id="uploadFileTest"><img class="total-center" src=""></label>
    <button id='uploadBtn' class="upload" >UPLOAD</button>
    
    </div>
    <div id="output"></div>
    </div>
    <div class='column'>
        <div id="upload-files-grid" class="ag-theme-alpine" style="height:250px; width: 100%; font-size: 12px; --ag-line-height: 60px">
        </div>
    </div>
    `;

  /*
    <div class="upload-status">
      <progress id="upload-success" class="upload-progress upload-success" value=0 max=100></progress>
      <div class="upload-header">Success! Uploads Complete</div>
      <div class="upload-body">Success / Error Lorem ipsum message dolor sit amet,
      consectetur adipiscing elit, sed do eiusmod tempor.</div>
      <br/>
      <progress id="upload-errors" class="upload-progress upload-errors" value=0 max=100></progress>
      <div class="upload-header">Uploads completed with errors</div>
      <div class="upload-body">Success / Error Lorem ipsum message dolor sit amet,
      consectetur adipiscing elit, sed do eiusmod tempor.</div>
    </div>
     */

  block.textContent = '';

  class iconNameAndDateRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      const { fileName, createdTime } = params.data;
      this.eGui.innerHTML = `<div class="gridItemFileName">${fileName?.toUpperCase()}</div>
      <div class="gridItemCreatedTime">
      ${createdTime.toString() || ''}</div>`;
    }

    getGui() {
      return this.eGui;
    }
  }

  const columnDefs = [
    {
      field: 'fileName',
      headerName: 'FILE NAME',
      minWidth: 280,
      cellRenderer: iconNameAndDateRenderer,
    },
    {
      field: 'modifiedTime',
      headerName: 'DATE ADDED',
      minWidth: 100,
    },
    // { field: 'modifiedTime', headerName: 'USER / SYSTEM', sortable: true },
    {
      field: 'size',
      valueGetter: formatBytesGetter,
      headerName: 'SIZE',
    },
    // {
    //   field: 'action',
    //   headerName: 'DOWNLOAD',
    //   cellRenderer: BtnCellRenderer,
    //   cellRendererParams: {
    //     clicked() {},
    //   },
    //   minWidth: 150,
    // },
  ];

  const rowData = [...files];
  // let the grid know which columns and what data to use
  const gridOptions1 = {
    columnDefs,
    rowData,
    rowHeight: 60,
    icons: {
      sortAscending: '<i class="icon-sort-up"/>',
      sortDescending: '<i class="icon-sort-down"/>',
      sortUnSort: '<i class="icon-sort"/>',
    },
  };
  gridOptions1.unSortIcon = true;

  const inputbox = document.createElement('input');
  // const inputbox = document.getElementById('filter-text-box');
  inputbox.id = 'filter-text-box';
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH ARCHIVE';
  inputbox.addEventListener('input', () => {
    gridOptions1.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  if (isHomePage) {
    block.className += ' homepage';
    block.append(divheader, divcolumns);
  } else {
    block.append(divheader, divcolumns);
  }

  const gridDiv1 = document.querySelector('#upload-files-grid');
  // eslint-disable-next-line
  const userGrid1 = new agGrid.Grid(gridDiv1, gridOptions1);
  gridOptions1.api.setRowData(rowData);
  gridOptions1.api.sizeColumnsToFit();
  gridOptions1.api.setDomLayout('autoHeight');
  // const inputbox = document.getElementById('filter-text-box');
  inputbox.addEventListener('input', () => {
    gridOptions1.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  // const input = document.getElementById('uploadedFile');
  // // eslint-disable-next-line func-names
  // input.addEventListener('change', function (e) {
  //   const filenames = document.getElementById('file-names');
  //   if (e.target.files.length > 0) {
  //     Array.from(e.target.files).forEach(file => {
  //       filenames.innerHTML += `<br>${file.name}`;
  //     });
  //   }
  // });

  // const uploadsuccess = document.getElementById('upload-success');
  // const succ = Math.floor(Math.random() * 100);
  // uploadsuccess.value = succ;
  // const uploaderrors = document.getElementById('upload-errors');
  // uploaderrors.value = 100 - succ;

  const uploadFiles = () => {
    const fileInput = document.getElementById('uploadedFile');
    // output for progress
    const config = getAWSStore();
    const user = getUser();
    uploadS3Objects(fileInput.files, config.s3UploadBucket, user);
  };
  const uploadBtn = document.getElementById('uploadBtn');
  uploadBtn.addEventListener('click', uploadFiles);

  document.addEventListener('uploaded', async function (/* event */) {
    console.log('able to listend to uploaded files');
    await new Promise(resolve => {
      setTimeout(() => resolve('success'), 2000);
    });
    files = await fetchFiles();
    gridOptions1.api.setRowData(files);
  });
}
