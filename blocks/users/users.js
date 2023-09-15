import { getUsersList } from '../../middleware/admin.js';
import { isAdminUser } from '../../store/userStore.js';
import '../../jslibraries/ag-grid-community.min.js';
import DeleteBtnCellRenderer from './delete-btn-cell-renderer.js';

export default async function decorate(block) {
  if (!isAdminUser()) return;

  const isHomePage = window.location.pathname === '/';

  const Users = isHomePage ? await getUsersList(10) : await getUsersList(0);

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>New Users</div>
    <div class='grid-header-denter'>&nbsp;</div>
    <a href='/users' class='grid-header-right button primary'>View All Users</a>
    </div>`;
  } else {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>Users</div>
    <div class='grid-header-denter'>&nbsp;</div>
    </div>`;
  }
  const div = document.createElement('div');
  div.id = 'userGrid';
  div.style = isHomePage
    ? 'height: 800px; width:100%;font-size:17px'
    : 'height: 800px; width:100%;font-size:17px';
  div.className = 'ag-theme-alpine';

  div.innerHTML = '';

  block.textContent = '';

  // divheader.appendchild(div);
  // block.append(divheader);

  class nameAndCountryRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      const username = params.data.name;
      const country = params.data['custom:country'];
      this.eGui.innerHTML = `<div class="gridItemUser">${username?.toUpperCase()}</div>
      <div class="gridItemCountry">
      COUNTRY: ${country?.toUpperCase() || ''}</div>`;
    }

    getGui() {
      return this.eGui;
    }
  }
  const columnDefs = [
    {
      field: 'name',
      headerName: 'NAME',
      sortable: true,
      cellRenderer: nameAndCountryRenderer,
    },
    {
      field: 'custom:country',
      headerName: 'Country',
      sortable: true,
      hide: true,
    },
    {
      field: 'custom:affiliation',
      headerName: 'AFFILIATION',
      sortable: true,
      hide: isHomePage,
    },
    { field: 'email', headerName: 'EMAIL', sortable: true, hide: isHomePage },
    {
      field: 'phone_number',
      headerName: 'PHONE',
      sortable: true,
      hide: isHomePage,
    },
    { field: 'email_verified', hide: true },
    {
      field: 'phone_number_verified',
      headerName: 'PhoneNo Verified',
      hide: true,
    },
    { field: 'sub', headerName: 'ID', hide: true },
    {
      field: 'action',
      headerName: 'ACTIONS',
      cellRenderer: DeleteBtnCellRenderer,
      cellRendererParams: {
        clicked() {},
      },
      minWidth: 150,
    },
  ];

  const miscGridOptions = {
    rowHeight: 78,
    unSortIcon: true,
    icons: {
      sortAscending: '<i class="icon-sort-up"/>',
      sortDescending: '<i class="icon-sort-down"/>',
      sortUnSort: '<i class="icon-sort"/>',
    },
  };

  const rowData = [];

  Users.forEach(user => {
    const singleRow = {};
    user.Attributes.forEach(attr => {
      singleRow[attr.Name] = attr.Value;
    });
    rowData.push(singleRow);
  });

  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs,
    ...miscGridOptions,
    rowData,
  };

  const inputbox = document.createElement('input');
  inputbox.id = 'filter-text-box';
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH USERS';
  inputbox.addEventListener('input', () => {
    gridOptions.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  if (isHomePage) {
    block.append(divheader, div);
  } else {
    block.append(inputbox, divheader, div);
  }

  const gridDiv = document.querySelector('#userGrid');
  // gridDiv.style.setProperty('height', 800);
  // eslint-disable-next-line
  const userGrid = new agGrid.Grid(gridDiv, gridOptions);
  if (!isHomePage) gridOptions.api.sizeColumnsToFit();
  gridOptions.api.sizeColumnsToFit();
  // gridOptions.api.setDomLayout('autoHeight');
}
