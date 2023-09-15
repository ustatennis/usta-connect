import { FOLDER_IDS } from '../../constants/googleDrive.js';
import '../../jslibraries/ag-grid-community.min.js';
import { getDataFromFolder } from '../../middleware/googleDrive.js';
import BtnCellRenderer from './btn-cell-renderer.js';

export default async function decorate(block) {
  const files = await getDataFromFolder(FOLDER_IDS.daily);

  const isHomePage = window.location.pathname === '/';

  const div = document.createElement('div');
  div.id = 'file-grid';
  div.className = 'ag-theme-alpine';

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>PRESS KIT</div>
    <div class='grid-header-center'>&nbsp;</div>
    <a href='/archive' class='grid-header-right button primary'>View All PDF's</a>
    </div>`;
  } else {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>PRESS KIT</div>
    <div class='grid-header-center'>&nbsp;</div>
    </div>`;
  }

  block.textContent = '';

  const columnDefs = [
    { field: 'fileName', headerName: 'FILE NAME', sortable: true },
    { field: 'modifiedTime', headerName: 'CHANGED', sortable: true },
    {
      field: 'action',
      headerName: 'ACTION',
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked() {},
      },
      minWidth: 150,
    },
  ];

  const rowData = [...files];

  // let the grid know which columns and what data to use
  const gridOptions3 = {
    icons: {
      sortAscending: '<i class="icon-sort-up"/>',
      sortDescending: '<i class="icon-sort-down"/>',
      sortUnSort: '<i class="icon-sort"/>',
    },
    columnDefs,
    rowData,
  };
  gridOptions3.unSortIcon = true;

  const inputbox = document.createElement('input');
  inputbox.id = 'filter-text-box';
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH ARCHIVE';
  inputbox.addEventListener('input', () => {
    gridOptions3.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  if (isHomePage) {
    block.append(divheader, div);
  } else {
    block.append(divheader, div);
  }

  const gridDiv = document.querySelector('#file-grid');
  // eslint-disable-next-line
  const userGrid = new agGrid.Grid(gridDiv, gridOptions3);
  gridOptions3.api.sizeColumnsToFit();
  gridOptions3.api.setRowData(rowData);
  gridOptions3.api.sizeColumnsToFit();
  gridOptions3.api.setDomLayout('autoHeight');
}
