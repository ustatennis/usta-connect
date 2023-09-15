import { FOLDER_IDS } from '../../constants/googleDrive.js';
import '../../jslibraries/ag-grid-community.min.js';
import { getDataFromFolder } from '../../middleware/googleDrive.js';
import BtnCellRenderer from './btn-cell-renderer.js';

export default async function decorate(block) {
  const files = await getDataFromFolder(FOLDER_IDS.scorecard);
  const isHomePage = window.location.pathname === '/';

  const div = document.createElement('div');
  div.id = 'scorecard-grid';
  div.style = isHomePage
    ? 'height: 800px; width:100%;font-size:17px'
    : 'height: 800px; width:100%;font-size:17px';
  div.className = 'ag-theme-alpine';

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>RECENT SCORECARDS</div>
    <div class='grid-header-center'>&nbsp;</div>
    <a href='/archive' class='grid-header-right button primary'>View All scorecards</a>
    </div>`;
  } else {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>RECENT SCORECARDS</div>
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

  const rowData = [...files];

  // let the grid know which columns and what data to use
  const gridOptions1 = {
    columnDefs,
    rowData,
    icons: {
      sortAscending: '<i class="icon-sort-up"/>',
      sortDescending: '<i class="icon-sort-down"/>',
      sortUnSort: '<i class="icon-sort"/>',
    },
  };
  gridOptions1.unSortIcon = true;

  // const inputbox = document.getElementById('filter-text-box');
  // //   inputbox.id = 'filter1-text-box';
  // //   inputbox.type = 'text';
  // //   inputbox.placeholder = 'SEARCH ARCHIVE';
  // inputbox.addEventListener('input', () => {
  //     gridOptions1.api.setQuickFilter(
  //         document.getElementById('filter-text-box').value,
  //     );
  // });

  block.textContent = '';
  if (isHomePage) {
    block.className += ' homepage';
    block.append(divheader, div);
  } else {
    block.append(divheader, div);
  }

  const gridDiv1 = document.querySelector('#scorecard-grid');
  // eslint-disable-next-line
  const userGrid1 = new agGrid.Grid(gridDiv1, gridOptions1);
  gridOptions1.api.setRowData(rowData);
  gridOptions1.api.sizeColumnsToFit();
  gridOptions1.api.setDomLayout('autoHeight');
  const inputbox = document.getElementById('filter-text-box');
  inputbox.addEventListener('input', () => {
    gridOptions1.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });
}
