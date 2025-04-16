// import { getUsersList } from '../../middleware/admin.js';
import { usstates } from '../../constants/usstates.js';
import {
  listScheduleGroups,
  listSchedules,
  getSchedule,
  listAllSchedules,
  listTagsForResource,
} from '../../scripts/s3script.js';
import titleAndDescriptionRenderer from './title-and-description-renderer.js';
import timeAndStatusRenderer from './time-and-status-renderer.js';
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
  let { campaigns } = [];

  const div = document.createElement('div');
  div.id = 'campaignGrid';
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
  // class titleAndDescriptionRenderer {
  //   init(params) {
  //     this.eGui = document.createElement('div');
  //     this.eGui.innerHTML = `<div class="cellicon">
  //       <div class="cellheader">${
  //         params.data?.Title || params.data?.Name
  //       }</div><div class="cellsubheader">${params.data.Description || ''}</div>
  //       <div class="cellbuttons"><button class="cellbutton" type="button">Edit Campaign</button></div>
  //       </div>`;
  //   }

  //   getGui() {
  //     return this.eGui;
  //   }
  // }

  let columnDefs = [
    {
      field: 'name',
      headerName: 'Campaign',
      sortable: true,
      width: 320,
      cellRenderer: titleAndDescriptionRenderer,
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
    rowData: campaigns?.ScheduleGroups,
    headerHeight: 53,
    rowHeight: 130,
    rowSelection: 'single',
    onSelectionChanged: () => {
      const selectedRows = gridOptions.api.getSelectedRows();
      // eslint-disable-next-line no-alert
      alert(`${selectedRows[0].name} selected`);
    },
  };
  // const statebox = document.createElement('select');
  // statebox.id = 'filter-state-box';
  // statebox.placeholder = 'SEARCH BY STATE';
  // statebox.addEventListener('input', () => {
  //   const inp = document.getElementById('filter-text-box');
  //   inp.disabled = false;
  //   // gridOptions.api.setQuickFilter(
  //   //   document.getElementById('filter-state-box').value,
  //   // );
  // });
  // const selectstate = document.createElement('option');
  // selectstate.text = 'SEARCH BY STATE';
  // selectstate.disabled = true;
  // selectstate.selected = true;
  // selectstate.hidden = true;
  // statebox.appendChild(selectstate);
  // usstates.data.forEach(state => {
  //   const option = document.createElement('option');
  //   option.value = state.id;
  //   option.text = state.value;
  //   statebox.appendChild(option);
  // });
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
  //   // campaignGrid.GridApi.setGridOption('rowData', Facilities);
  // });
  const inputbox = document.createElement('input');
  inputbox.id = 'filter-text-box';
  inputbox.disabled = true;
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH FCAMPAIGNS';
  inputbox.addEventListener('input', () => {
    gridOptions.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  block.append(inputbox);
  block.append(div);

  let gridDiv = document.querySelector('#campaignGrid');
  // eslint-disable-next-line no-debugger
  // eslint-disable-next-line
    // const campaignGrid = new agGrid.Grid(gridDiv, gridOptions);
  // tatebox.addEventListener('change', async function (event) {
  // Get the selected value
  // eslint-disable-next-line no-unused-vars
  // const selectedValue = event.target.value;
  // Do something with the selected value
  // onsole.log('Selected value:', selectedValue);
  // const config = getAWSStore();
  gridDiv = document.querySelector('#campaignGrid');
  gridDiv.innerHTML = `<div id="spinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
  showSpinner();
  campaigns = await listScheduleGroups('MT-');
  const schedules = await listAllSchedules();
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const s in [...campaigns.ScheduleGroups]) {
    const schedule = campaigns.ScheduleGroups[s];
    // eslint-disable-next-line no-await-in-loop
    const GroupTags = await listTagsForResource(schedule.Arn);
    // eslint-disable-next-line no-restricted-syntax
    for (const t in GroupTags.Tags) {
      // eslint-disable-next-line no-prototype-builtins
      if (GroupTags.Tags.hasOwnProperty(t)) {
        const kv = GroupTags.Tags[t];
        campaigns.ScheduleGroups[s][kv.Key] = kv.Value;
      }
    }
    let s3schedulessummary = schedules
      .filter(el => el.GroupName === schedule.Name)
      .filter(el => el.Arn.includes('-S3-'));
    const s3res = [];
    for (let i = 0; i < s3schedulessummary.length; i++) {
      const sch = s3schedulessummary[i];
      // eslint-disable-next-line no-await-in-loop
      const ss = await getSchedule({
        groupName: sch.GroupName,
        scheduleName: sch.Name,
      });
      s3res.push(ss);
    }
    s3schedulessummary = s3res;

    let statusschedulessummary = schedules
      .filter(el => el.GroupName === schedule.Name)
      .filter(el => el.Arn.includes('Status-'));
    const stres = [];
    for (let i = 0; i < statusschedulessummary.length; i++) {
      const sch = statusschedulessummary[i];
      // eslint-disable-next-line no-await-in-loop
      const ss = await getSchedule({
        groupName: sch.GroupName,
        scheduleName: sch.Name,
      });
      stres.push(ss);
    }
    statusschedulessummary = stres;

    let sendchedulessummary = schedules
      .filter(el => el.GroupName === schedule.Name)
      .filter(el => el.Arn.includes('Send-'));
    const sndres = [];
    for (let i = 0; i < sendchedulessummary.length; i++) {
      const sch = sendchedulessummary[i];
      // eslint-disable-next-line no-await-in-loop
      const ss = await getSchedule({
        groupName: sch.GroupName,
        scheduleName: sch.Name,
      });
      sndres.push(ss);
    }
    sendchedulessummary = sndres;

    campaigns.ScheduleGroups[s].status = 'ENABLED';
  }
  // await campaigns.ScheduleGroups.forEach(async (schedule, index, arr) => {
  //   const GroupTags = await listTagsForResource(schedule.Arn);
  //   if (GroupTags) {
  //     console.log(`index: ${index}`);
  //   }
  //   arr[index].groupTags = GroupTags;
  //   console.log(GroupTags.Tags?.join(', '));
  // });
  // debugger;
  hideSpinner();
  columnDefs = [
    {
      field: 'name',
      headerName: 'Campaign',
      sortable: true,
      cellRenderer: titleAndDescriptionRenderer,
      width: 600,
    },
    {
      field: 'facilityStatus',
      headerName: 'Status',
      sortable: true,
      type: 'rightAligned',
      cellRenderer: timeAndStatusRenderer,
      width: 600,
    },
    {
      field: 'createdDateTime',
      headerName: 'Created Date Time',
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
    rowData: campaigns?.ScheduleGroups,
    headerHeight: 53,
    rowHeight: 130,
    rowSelection: 'single',
    includeHiddenColumnsInQuickFilter: true,
    onSelectionChanged: () => {
      const selectedRows = gridOptions.api.getSelectedRows();
      window.location.assign(
        `/marketing-trigger-update?campaignid=${selectedRows[0].Name}`,
      );
      // eslint-disable-next-line no-alert
      // alert(`${selectedRows[0].Name} selected`);
    },
  };
  // console.log(config);
  // console.log(Facilities);
  gridDiv = document.querySelector('#campaignGrid');
  gridDiv.innerHTML = `<div id="spinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
  // eslint-disable-next-line no-undef, no-unused-vars
  const campaignGrid = new agGrid.Grid(gridDiv, gridOptions);
  // campaignGrid.GridApi.setGridOption('rowData', Facilities);
  //  });
}
