import { FOLDER_IDS } from '../../constants/googleDrive.js';
import '../../jslibraries/ag-grid-community.min.js';
import { getDataFromFolder } from '../../middleware/googleDrive.js';
import BtnCellRenderer from './btn-cell-renderer.js';

export default async function decorate(block) {
  const schedules = await getDataFromFolder(FOLDER_IDS.umpire);
  const isHomePage = window.location.pathname === '/';
  const div = document.createElement('div');
  div.id = 'umpire-schedules-grid';
  div.style = isHomePage
    ? 'width:100%;font-size:17px'
    : 'width:100%;font-size:17px';
  div.className = 'ag-theme-alpine';

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>DAILY MEDIA INFORMATION</div>
    <div class='grid-header-center'>&nbsp;</div>
    <a href='/archive' class='grid-header-right button primary'>View All</a>
    </div>`;
  } else {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>DAILY MEDIA INFORMATION</div>
    <div class='grid-header-center'>&nbsp;</div>
    </div>`;
  }

  block.textContent = '';

  const columnDefs = [
    {
      field: 'fileName',
      headerName: 'FILE NAME',
      sortable: true,
      minWidth: 380,
    },
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

  const rowData2 = [...schedules];

  // let the grid know which columns and what data to use
  const gridOptions2 = {
    icons: {
      sortAscending: '<i class="icon-sort-up"/>',
      sortDescending: '<i class="icon-sort-down"/>',
      sortUnSort: '<i class="icon-sort"/>',
    },
    columnDefs,
    rowData: rowData2,
  };
  gridOptions2.unSortIcon = true;

  const inputbox = document.createElement('input');
  inputbox.id = 'filter-text-box';
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH ARCHIVE';
  inputbox.addEventListener('input', () => {
    gridOptions2.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  if (isHomePage) {
    block.className += ' homepage';
    block.append(divheader, div);
  } else {
    block.append(inputbox, divheader, div);
  }

  const gridDiv2 = document.querySelector('#umpire-schedules-grid');
  // eslint-disable-next-line
  const userGrid1 = new agGrid.Grid(gridDiv2, gridOptions2);
  gridOptions2.api.setRowData(rowData2);
  gridOptions2.api.sizeColumnsToFit();
  gridOptions2.api.setDomLayout('autoHeight');
  // const inputbox = document.getElementById('filter-text-box');
  inputbox.addEventListener('input', () => {
    gridOptions2.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });
}
