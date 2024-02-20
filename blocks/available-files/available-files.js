// import { FOLDER_IDS } from '../../constants/googleDrive.js';
import '../../jslibraries/ag-grid-community.min.js';
// import { getDataFromFolder } from '../../middleware/googleDrive.js';
import { listFiles } from '../../scripts/s3script.js';
import BtnCellRenderer from './btn-cell-renderer.js';
import userSystemCellRenderer from './user-system-cell-renderer.js';
import { formatBytes } from '../../jslibraries/utility/utility.js';
import { iconColorBar } from '../../scripts/helpers.js';
import { getAWSStore } from '../../store/awsStore.js';

export default async function decorate(block) {
  function formatBytesGetter(params) {
    return formatBytes(params.data.size, 0);
  }
  // const files = await getDataFromFolder(FOLDER_IDS.availablefiles);
  const config = getAWSStore();

  let downloadFiles = await listFiles(config.s3DownloadBucket, 1000);
  const scannedFiles = await listFiles(config.s3ScannedBucket, 1000);
  // let files = [...downloadFiles, ...scannedFiles];
  let files = [
    ...downloadFiles.map(obj => {
      return { ...obj, owner: 'SYSTEM' };
    }),
    ...scannedFiles.map(obj => {
      return { ...obj, owner: 'USER' };
    }),
  ];
  files.sort((a, b) => b.createdTime - a.createdTime);
  const isHomePage = window.location.pathname === '/';

  const div = document.createElement('div');
  div.id = 'available-files-grid';
  div.style = isHomePage
    ? 'height: 800px; width:100%;font-size:12px'
    : 'height: 800px; width:100%;font-size:12px';
  div.className = 'ag-theme-alpine';

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>Available Files</div>
    <div class='grid-header-center'>&nbsp;</div>
    <div class='grid-header-right'>
    <span id='btn-user'></span><span id='btn-legend'> = USER UPLOADED</span>
    <span id='btn-system'></span><span id='btn-legend'> = SYSTEM UPLOADED</span>
    </div>
    </div>`;
  } else {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>Available Files</div>
    <div class='grid-header-center'>&nbsp;</div>
    </div>`;
  }

  block.textContent = '';

  class iconNameAndDateRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      this.eGui.className = 'cellIconWrapper';
      const { fileName, createdTime } = params.data;
      const clr = 'red';
      this.eGui.innerHTML = `${iconColorBar(
        clr,
      )}<div class="gridNameDate"><div class="gridItemFileName"><u>${fileName?.toUpperCase()}</u></div>
      <div class="gridItemCreatedTime">
      ${Date(createdTime) || ''}</div></div>`;
    }

    getGui() {
      return this.eGui;
    }
  }

  const columnDefs = [
    {
      field: 'fileName',
      headerName: 'FILE NAME',
      sortable: true,
      minWidth: 380,
      cellRenderer: iconNameAndDateRenderer,
      cellClass: 'fileName',
    },
    { field: 'modifiedTime', headerName: 'DATE ADDED', sortable: true },
    {
      field: 'userfiles',
      headerName: 'USER / SYSTEM',
      cellRenderer: userSystemCellRenderer,
      sortable: true,
    },
    {
      field: 'size',
      valueGetter: formatBytesGetter,
      headerName: 'SIZE',
      sortable: true,
    },
    {
      field: 'action',
      headerName: 'DOWNLOAD',
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked() {
          // console.log(this)
        },
      },
      minWidth: 150,
    },
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
    block.append(divheader, div);
  } else {
    block.append(divheader, div);
  }

  const gridDiv1 = document.querySelector('#available-files-grid');
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

  document.addEventListener('uploaded', async function (/* event */) {
    console.log('able to listend to uploaded files');
    await new Promise(resolve => {
      setTimeout(() => resolve('success'), 4000);
    });
    downloadFiles = await listFiles(config.s3DownloadBucket, 1000);
    // const scannedFiles = await listFiles(config.s3ScannedBucket, 1000);
    files = [...downloadFiles, ...scannedFiles];
    files.sort((a, b) => b.createdTime - a.createdTime);
    console.log(files);
    gridOptions1.api.setRowData(files);
  });
}
