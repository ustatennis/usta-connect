/* eslint-disable prefer-destructuring */
// import { getUsersList } from '../../middleware/admin.js';
// import { usstates } from '../../constants/usstates.js';
import {
  listScheduleGroups,
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
  div.id = 'campaign-grid';
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

  function findFirstTwoNumbers(str) {
    const numbers = str.match(/(\d+|\*)/g);

    if (numbers && numbers.length >= 2) {
      return `${numbers[1]}:${numbers[0].length === 1 ? '0' : ''}${numbers[0]}`;
    }
    if (numbers && numbers.length === 1) {
      return `${numbers[0]}`;
    }
    return ``;
  }

  function getCharsAfterT(str) {
    const indexOfT = str.indexOf('T');

    if (indexOfT === -1) {
      return ''; // "T" not found
    }

    return str.substring(indexOfT + 1, Math.min(indexOfT + 6, str.length));
  }

  function schedulefulltime(schedule, startdate) {
    const scheduleExpression = schedule?.ScheduleExpression;
    if (scheduleExpression && scheduleExpression.substring(0, 5) === 'cron(') {
      const match = scheduleExpression.match(/\(([^)]+)\)/);
      const crontime = match ? match[1] : null;
      const items = crontime.split(' ');
      const firstrun = startdate || new Date();
      if (items[0] !== '*' && items[1] !== '*')
        firstrun.setHours(items[1], items[0], 0);
      return firstrun;
    }
    if (scheduleExpression && scheduleExpression.substring(0, 3) === 'at(') {
      const match = scheduleExpression.match(/\(([^)]+)\)/);
      const atTime = match ? match[1] : null;
      return Date(atTime);
    }
    return new Date();
  }

  function scheduletime(schedule) {
    const scheduleExpression = schedule?.ScheduleExpression;
    if (scheduleExpression && scheduleExpression.substring(0, 5) === 'cron(') {
      return findFirstTwoNumbers(scheduleExpression);
    }
    if (scheduleExpression && scheduleExpression.substring(0, 3) === 'at(') {
      return getCharsAfterT(scheduleExpression);
    }
    return '';
  }

  block.textContent = '';
  block.append(div);

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
  ];

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

  const inputbox = document.createElement('input');
  inputbox.id = 'filter-text-box';
  inputbox.disabled = false;
  inputbox.type = 'text';
  inputbox.placeholder = 'SEARCH FOR CAMPAIGNS';
  inputbox.addEventListener('input', () => {
    gridOptions.api.setQuickFilter(
      document.getElementById('filter-text-box').value,
    );
  });

  block.textContent = '';
  block.append(inputbox);
  block.append(div);

  let gridDiv = document.querySelector('#campaign-grid');

  gridDiv = document.querySelector('#campaign-grid');
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
    // eslint-disable-next-line no-unused-vars
    const s3pulltime = scheduletime(sendchedulessummary[0]);
    const s3pullfulltime = schedulefulltime(sendchedulessummary[0]);
    // const { startDate } = sendchedulessummary[0] || {};
    const { EndDate } = sendchedulessummary[0] || {};
    // eslint-disable-next-line no-unused-vars
    const adobestatustime = scheduletime(statusschedulessummary[0]);
    const adobestatusfulltime = schedulefulltime(sendchedulessummary[0]);
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    console.log(currentTime);
    campaigns.ScheduleGroups[s].Status = 'SCHEDULED';
    if (campaigns.ScheduleGroups[s].State === 'DISABLED') {
      if (EndDate > now) {
        campaigns.ScheduleGroups[s].Status = 'PAUSED';
      } else {
        campaigns.ScheduleGroups[s].Status = 'INACTIVE';
      }
    } else if (EndDate > now) {
      campaigns.ScheduleGroups[s].Status = 'SCHEDULED';
      if (s3pullfulltime <= now && now <= adobestatusfulltime) {
        campaigns.ScheduleGroups[s].Status = 'RUNNING';
      }
    } else {
      campaigns.ScheduleGroups[s].Status = 'INACTIVE';
    }
    // eslint-disable-next-line prefer-destructuring
    campaigns.ScheduleGroups[s].S3Groups = s3schedulessummary[0];
    // eslint-disable-next-line prefer-destructuring
    campaigns.ScheduleGroups[s].StatusGroups = statusschedulessummary[0];
    // eslint-disable-next-line prefer-destructuring
    campaigns.ScheduleGroups[s].SendGroups = sendchedulessummary[0];
    campaigns.ScheduleGroups[s].DeliveryTime = scheduletime(
      sendchedulessummary[0],
    );
  }

  hideSpinner();
  columnDefs = [
    {
      field: 'Name',
      headerName: 'Campaign',
      sortable: true,
      cellRenderer: titleAndDescriptionRenderer,
      width: 600,
    },
    {
      field: 'Description',
      headerName: 'Description',
      hide: true,
    },
    {
      field: 'Title',
      headerName: 'Title',
      hide: true,
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
    },
  };
  // console.log(config);
  // console.log(Facilities);
  gridDiv = document.querySelector('#campaign-grid');
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
