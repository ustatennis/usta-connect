// import { getUsersList } from '../../middleware/admin.js';
import { usstates } from '../../constants/usstates.js';
import { fetchAllFacilities } from '../../scripts/s3script.js';
// import { isAdminUser } from '../../store/userStore.js';
// import { uploadS3Objects, listFiles } from '../../scripts/s3script.js';
import '../../jslibraries/ag-grid-community.min.js';
// import BtnCellRenderer from '../available-files/btn-cell-renderer.js';
// import userSystemCellRenderer from '../available-files/user-system-cell-renderer.js';
// import { formatBytes } from '../../jslibraries/utility/utility.js';
// import { iconColorBar } from '../../scripts/helpers.js';

export default async function decorate(block) {
  // function onSelectionChanged() {
  //   const selectedRows = this.gridOptions.api.getSelectedRows();
  //   alert(selectedRows.user);
  // }
  // const { Users } = await getUsersList();
  let { Facilities } = [];

  const div = document.createElement('div');
  div.id = 'userGrid';
  div.style = 'height: 800px; max-width:1280px;font-size:14px';
  div.className = 'ag-theme-alpine';

  div.innerHTML = `<div id="spinner" style="display: none;">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;

  function showSpinner() {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'block';
  }

  function hideSpinner() {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'none';
  }

  block.textContent = '';
  block.append(div);
  class nameAndAddressRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      // debugger;
      this.eGui.innerHTML = `
        <div class="cellheader">${
          params.data.name
        }</div><div class="cellsubheader">${
        params.data.address.streetAddressLine1 || ''
      }, ${params.data.address.city || ''}, ${
        params.data.address.state || ''
      } ${params.data.address.zip || ''}</div>
        `;
    }

    getGui() {
      return this.eGui;
    }
  }

  let columnDefs = [
    {
      field: 'name',
      headerName: 'Name/Address',
      sortable: true,
      // cellRenderer: nameAndCountryRenderer,
    },
    { field: 'address', headerName: 'Address', hidden: true, sortable: true },
    {
      field: 'ustaFacilityId',
      headerName: 'Facility USTA Number',
      sortable: true,
    },
    // {
    //   field: 'zendesk',
    //   headerName: 'Zendesk Internal ID',
    //   sortable: true,
    // },
    // // { field: 'email_verified' },
    // { field: 'facilitystatus', headerName: 'Facility Status', sortable: true },
    // {
    //   field: 'verifiedby',
    //   headerName: 'Verified by',
    //   sortable: true,
    //   sort: 'desc',
    // },
    // {
    //   field: 'phone_number_verified',
    //   headerName: 'Created Date Time',
    // },
    // {
    //   field: 'phone_number_verified',
    //   headerName: 'Last Updated By',
    // },
    // {
    //   field: 'phone_number_verified',
    //   headerName: 'Last Updated Date Time',
    // },
    // { field: 'sub', headerName: 'ID' },
  ];

  // const rowData = [];

  // Facilities?.forEach(fac => {
  //   const singleRow = {};
  //   user.Attributes.forEach(attr => {
  //     singleRow[attr.Name] = attr.Value;
  //   });
  //   singleRow.CreateDate = user.UserCreateDate;
  //   singleRow.LastModifiedDate = user.UserLastModifiedDate;

  //   rowData.push(singleRow);
  // });

  // let the grid know which columns and what data to use
  let gridOptions = {
    columnDefs,
    rowData: Facilities,
    headerHeight: 53,
    rowHeight: 60,
    rowSelection: 'single',
    onSelectionChanged: () => {
      const selectedRows = gridOptions.api.getSelectedRows();
      // eslint-disable-next-line no-alert
      alert(`${selectedRows[0].name} selected`);
    },
  };
  const statebox = document.createElement('select');
  statebox.id = 'filter-state-box';
  statebox.placeholder = 'SEARCH BY STATE';
  statebox.addEventListener('input', () => {
    const inp = document.getElementById('filter-text-box');
    inp.disabled = false;
    // gridOptions.api.setQuickFilter(
    //   document.getElementById('filter-state-box').value,
    // );
  });
  const selectstate = document.createElement('option');
  selectstate.text = 'SEARCH BY STATE';
  selectstate.disabled = true;
  selectstate.selected = true;
  selectstate.hidden = true;
  statebox.appendChild(selectstate);
  usstates.data.forEach(state => {
    const option = document.createElement('option');
    option.value = state.id;
    option.text = state.value;
    statebox.appendChild(option);
  });
  // statebox.addEventListener('change', async function (event) {
  //   // Get the selected value
  //   const selectedValue = event.target.value;
  //   // Do something with the selected value
  //   console.log('Selected value:', selectedValue);
  //   // const config = getAWSStore();
  //   Facilities = await fetchFacilities(selectedValue, '');
  //   // eslint-disable-next-line no-debugger
  //   debugger;
  //   // console.log(config);
  //   console.log(Facilities);
  //   // userGrid.GridApi.setGridOption('rowData', Facilities);
  // });
  const inputbox = document.createElement('input');
  inputbox.id = 'filter-text-box';
  inputbox.disabled = true;
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH FACILITIES';
  inputbox.addEventListener('input', () => {
    gridOptions.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  block.append(statebox, inputbox);
  block.append(div);

  let gridDiv = document.querySelector('#userGrid');
  // eslint-disable-next-line no-debugger
  // eslint-disable-next-line
    // const userGrid = new agGrid.Grid(gridDiv, gridOptions);
  statebox.addEventListener('change', async function (event) {
    // Get the selected value
    const selectedValue = event.target.value;
    // Do something with the selected value
    // onsole.log('Selected value:', selectedValue);
    // const config = getAWSStore();
    gridDiv = document.querySelector('#userGrid');
    gridDiv.innerHTML = `<div id="spinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
    showSpinner();
    Facilities = await fetchAllFacilities(selectedValue, '');
    hideSpinner();
    columnDefs = [
      {
        field: 'name',
        headerName: 'Name/Address',
        sortable: true,
        cellRenderer: nameAndAddressRenderer,
        width: 300,
      },
      {
        field: 'address.streetAddressLine1',
        headerName: 'Address',
        hide: true,
      },
      { field: 'address.city', headerName: 'Country', hide: true },
      { field: 'address.state', headerName: 'Country', hide: true },
      { field: 'address.zip', headerName: 'Country', hide: true },
      {
        field: 'ustaFacilityId',
        headerName: 'Facility USTA No',
        sortable: true,
        width: 160,
      },
      {
        field: 'externalFacilityId',
        headerName: 'Zendesk Ticket Number',
        sortable: true,
      },
      // { field: 'email_verified' },
      {
        field: 'facilityStatus',
        headerName: 'Facility Status',
        sortable: true,
        width: 140,
      },
      {
        field: 'verifiedBy',
        headerName: 'Verified by',
        sortable: true,
        width: 120,
      },
      {
        field: 'createdDateTime',
        headerName: 'Created Date Time',
        sortable: true,
      },
      {
        field: 'lastUpdatedBy',
        headerName: 'Last Updated By',
        width: 145,
        sortable: true,
      },
      {
        field: 'lastUpdatedDateTime',
        headerName: 'Last Updated Date Time',
        sortable: true,
      },
      // { field: 'sub', headerName: 'ID' },
    ];

    // const rowData = [];

    // Facilities?.forEach(fac => {
    //   const singleRow = {};
    //   user.Attributes.forEach(attr => {
    //     singleRow[attr.Name] = attr.Value;
    //   });
    //   singleRow.CreateDate = user.UserCreateDate;
    //   singleRow.LastModifiedDate = user.UserLastModifiedDate;

    //   rowData.push(singleRow);
    // });

    // let the grid know which columns and what data to use
    gridOptions = {
      columnDefs,
      rowData: Facilities,
      headerHeight: 53,
      rowHeight: 60,
      rowSelection: 'single',
      includeHiddenColumnsInQuickFilter: true,
      onSelectionChanged: () => {
        const selectedRows = gridOptions.api.getSelectedRows();
        window.location.assign(
          `/facility-update?ustafacilityid=${selectedRows[0].ustaFacilityId}`,
        );
        // eslint-disable-next-line no-alert
        // alert(`${selectedRows[0].name} selected`);
      },
    };
    // console.log(config);
    // console.log(Facilities);
    gridDiv = document.querySelector('#userGrid');
    gridDiv.innerHTML = `<div id="spinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
    // eslint-disable-next-line no-undef, no-unused-vars
    const userGrid = new agGrid.Grid(gridDiv, gridOptions);
    // userGrid.GridApi.setGridOption('rowData', Facilities);
  });
}
