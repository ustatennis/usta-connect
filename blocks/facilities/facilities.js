import { getUsersList } from '../../middleware/admin.js';
import { usstates } from '../../constants/usstates.js';
import { fetchFacilities } from '../../scripts/s3script.js';
// import { isAdminUser } from '../../store/userStore.js';
// import { uploadS3Objects, listFiles } from '../../scripts/s3script.js';
import '../../jslibraries/ag-grid-community.min.js';
import { getAWSStore } from '../../store/awsStore.js';
// import BtnCellRenderer from '../available-files/btn-cell-renderer.js';
// import userSystemCellRenderer from '../available-files/user-system-cell-renderer.js';
// import { formatBytes } from '../../jslibraries/utility/utility.js';
// import { iconColorBar } from '../../scripts/helpers.js';

export default async function decorate(block) {
  // function onSelectionChanged() {
  //   const selectedRows = this.gridOptions.api.getSelectedRows();
  //   alert(selectedRows.user);
  // }
  const { Users } = await getUsersList();

  const div = document.createElement('div');
  div.id = 'userGrid';
  div.style = 'height: 800px; max-width:1280px;font-size:14px';
  div.className = 'ag-theme-alpine';

  div.innerHTML = '';

  block.textContent = '';
  block.append(div);

  class nameAndCountryRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      this.eGui.innerHTML = `
        <div class="cellheader">${
          params.data.name
        }</div><div class="cellsubheader">COUNTRY: ${
        params.data['custom:country'] || ''
      }</div>
        `;
    }

    getGui() {
      return this.eGui;
    }
  }

  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name/Address',
      sortable: true,
      cellRenderer: nameAndCountryRenderer,
    },
    // { field: 'custom:country', headerName: 'Country', sortable: true },
    { field: 'email', headerName: 'Facility USTA Number', sortable: true },
    {
      field: 'zendesk',
      headerName: 'Zendesk Internal ID',
      sortable: true,
    },
    // { field: 'email_verified' },
    { field: 'facilitystatus', headerName: 'Facility Status', sortable: true },
    {
      field: 'verifiedby',
      headerName: 'Verified by',
      sortable: true,
      sort: 'desc',
    },
    {
      field: 'phone_number_verified',
      headerName: 'Created Date Time',
    },
    {
      field: 'phone_number_verified',
      headerName: 'Last Updated By',
    },
    {
      field: 'phone_number_verified',
      headerName: 'Last Updated Date Time',
    },
    { field: 'sub', headerName: 'ID' },
  ];

  const rowData = [];

  Users?.forEach(user => {
    const singleRow = {};
    user.Attributes.forEach(attr => {
      singleRow[attr.Name] = attr.Value;
    });
    singleRow.CreateDate = user.UserCreateDate;
    singleRow.LastModifiedDate = user.UserLastModifiedDate;

    rowData.push(singleRow);
  });

  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs,
    rowData,
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
  statebox.addEventListener('change', async function (event) {
    // Get the selected value
    const selectedValue = event.target.value;
    // Do something with the selected value
    console.log('Selected value:', selectedValue);
    const config = getAWSStore();
    const facili = await fetchFacilities(selectedValue);
    // eslint-disable-next-line no-debugger
    debugger;
    console.log(config);
    console.log(facili);
  });
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

  const gridDiv = document.querySelector('#userGrid');
  // eslint-disable-next-line
    const userGrid = new agGrid.Grid(gridDiv, gridOptions);
}
