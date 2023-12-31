import { FOLDER_IDS } from '../../constants/googleDrive.js';
import '../../jslibraries/ag-grid-community.min.js';
import { getDataFromFolder } from '../../middleware/googleDrive.js';
import BtnCellRenderer from './btn-cell-renderer.js';
import { formatBytes } from '../../jslibraries/utility/utility.js';

export default async function decorate(block) {
  function formatBytesGetter(params) {
    return formatBytes(params.data.size, 0);
  }
  const files = await getDataFromFolder(FOLDER_IDS.availablefiles);
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
    <button class="selectfiles">SELECT FILES</button>
    <button class="upload">UPLOAD</button>
    </div>
    <div class="upload-status">
    <progress class="upload-progress upload-success" value=100></progress>
    <div class="upload-header">Success! Uploads Complete</div>
    <div class="upload-body">Success / Error Lorem ipsum message dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor.</div>
    <br/>
    <progress class="upload-progress upload-errors" value=100></progress>
    <div class="upload-header">Uploads completed with errors</div>
    <div class="upload-body">Success / Error Lorem ipsum message dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor.</div>
    </div>
    </div>
    <div class='column'>
        <div id="upload-files-grid" class="ag-theme-alpine" style="height:500px; width: 100%; font-size: 12px; --ag-line-height: 60px">
        </div>
    </div>
    `;

  block.textContent = '';

  class iconNameAndDateRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      const { fileName, createdTime } = params.data;
      this.eGui.innerHTML = `<div class="gridItemFileName">${fileName?.toUpperCase()}</div>
      <div class="gridItemCreatedTime">
      ${createdTime?.toUpperCase() || ''}</div>`;
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
    },
    { field: 'modifiedTime', headerName: 'DATE ADDED', sortable: true },
    { field: 'modifiedTime', headerName: 'USER / SYSTEM', sortable: true },
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
        clicked() {},
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
}
