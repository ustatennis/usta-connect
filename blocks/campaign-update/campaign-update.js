/* eslint-disable no-debugger */
import {
  listSchedule,
  getScheduleGroup,
  // createScheduleGroup,
  // deleteScheduleGroup,
  listTagsForResource,
  getSchedule,
  tagResource,
  updateSchedule,
} from '../../scripts/s3script.js';
import { htmlForm } from './campaign-update-html.js';

// let modalSelect;
let schedule = {};
let scheduleGroup = {};
let schedules = [];
const extendedSchedules = [];
let tags = [];
let sanitizedtags = [];
let startDate = '';
let endDate = '';
// eslint-disable-next-line no-unused-vars
// const user = getUser();
// const userName = user.UserAttributes.find(o => o.Name === 'name')?.Value;
// const userNameCpitalized =
//   // eslint-disable-next-line no-unsafe-optional-chaining
//   userName?.charAt(0).toUpperCase() + userName.slice(1);

export default async function decorate(block) {
  // Get the query string from the URL
  const queryString = window.location.search;

  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Get the value of a specific parameter
  const campaignid = urlParams.get('campaignid');

  // eslint-disable-next-line no-unused-vars
  if (campaignid) {
    // to-do
    schedule = await listSchedule(campaignid);
    schedules = schedule?.Schedules;

    if (schedules.length > 0) {
      for (let i = 0; i < schedules.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const extendedSchedule = await getSchedule({
          groupName: campaignid,
          scheduleName: schedules[i]?.Name,
        });
        // debugger;
        extendedSchedules.push(extendedSchedule);
        startDate = extendedSchedule.StartDate
          ? extendedSchedule.StartDate
          : startDate;
        endDate = extendedSchedule.EndDate ? extendedSchedule.EndDate : endDate;
      }
    }
    // eslint-disable-next-line no-use-before-define
    startDate = formatDate(startDate);
    // eslint-disable-next-line no-use-before-define
    endDate = formatDate(endDate);
    console.log(`startDate = ${startDate}, endDate = ${endDate}`);
    scheduleGroup = await getScheduleGroup(campaignid);
    const arn = scheduleGroup?.Arn;
    const tgs = await listTagsForResource(arn);
    // eslint-disable-next-line no-use-before-define
    tags = tagsToObj(tgs?.Tags);
    const santags = tgs?.Tags;
    // eslint-disable-next-line no-use-before-define
    sanitizedtags = tagsToObj(santags);
    delete sanitizedtags.Title;
    delete sanitizedtags.Description;
    // debugger;
  }
  // debugger;

  const divheader = document.createElement('div');
  divheader.innerHTML = htmlForm.replaceAll('$$CampaignName$$', campaignid);
  // eslint-disable-next-line no-use-before-define
  await populateForm(divheader);

  // eslint-disable-next-line no-unused-vars
  function modalMessageOpen(msg) {}

  async function populateForm(divh) {
    // eslint-disable-next-line no-unused-vars
    const s3pullcron = extendedSchedules.find(sc =>
      sc.Arn.includes('-S3-'),
    ).ScheduleExpression;
    // debugger;
    let numbers = s3pullcron.match(/\d+/g);
    if (numbers.length >= 2 && s3pullcron.includes('cron(')) {
      const campaignpulltime = divh.querySelector('#campaign-pulltime');
      campaignpulltime.value = `${numbers[1]}:${numbers[0]}`;
    }
    const sendcron = extendedSchedules.find(sc =>
      sc.Arn.includes('Send-'),
    ).ScheduleExpression;
    // debugger;
    numbers = sendcron.match(/\d+/g);
    if (numbers.length >= 2 && sendcron.includes('cron(')) {
      const campaignsendtime = divh.querySelector('#campaign-sendtime');
      campaignsendtime.value = `${numbers[1]}:${numbers[0]}`;
    }
    // campaign name
    const campaignName = divh.querySelector('#campaign-name');
    // campaignGroupName = campaignName;
    // debugger;
    campaignName.value = tags.Title;
    // list tags comma separated
    const campaignTags = divh.querySelector('#campaign-tags');
    // eslint-disable-next-line no-use-before-define
    campaignTags.value = objToString(sanitizedtags);

    // description
    const campaignCDescription = divh.querySelector('#campaign-description');
    campaignCDescription.value = tags.Description;

    const campaignEnddate = divh.querySelector('#campaign-enddate');
    campaignEnddate.value = endDate;

    const campaignStartDate = divh.querySelector('#campaign-startdate');
    campaignStartDate.value = startDate;
  }

  function formatDate(date) {
    if (date === null || date === '') return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  function formToObject(divh) {
    const object = {};
    const formElement = divh.querySelector('.rendered-form');
    const formData = new FormData(formElement);
    // eslint-disable-next-line no-return-assign
    formData.forEach((value, key) => (object[key] = value));
    return object;
  }

  function validateForm(divh) {
    // eslint-disable-next-line no-unused-vars
    function containsAmOrPm(text) {
      return (
        text.toLowerCase().includes('am') || text.toLowerCase().includes('pm')
      );
    }

    // eslint-disable-next-line no-unused-vars
    function convertTimeFormat(timeString) {
      const [time, modifier] = timeString.split(' ');
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time.split(':');

      if (hours === '12') {
        hours = '00';
      }

      if (modifier.toUpperCase() === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }

      return `${hours}:${minutes}`;
    }
    async function updateScheduleStatus(newstate) {
      const modalwindow = document.querySelector('#enableModal');
      modalwindow.style.display = 'none';

      const ob = formToObject(divheader);
      const titleAndDescriptionTags = [
        { Key: 'Title', Value: ob.name },
        { Key: 'Description', Value: ob.description },
      ];

      // eslint-disable-next-line no-use-before-define
      tags = [
        ...titleAndDescriptionTags,
        // eslint-disable-next-line no-use-before-define
        ...stringToTags(ob.tagstring),
      ];
      await tagResource(scheduleGroup.Arn, tags);
      for (let i = 0; i < schedules.length; i++) {
        const sch = schedules[i];
        // eslint-disable-next-line no-await-in-loop
        const sched = await getSchedule({
          groupName: sch.GroupName,
          scheduleName: sch.Name,
        });
        delete sched.Arn;
        delete sched.CreationDate;
        delete sched.LastModificationDate;
        const startdate = ob.startdate === '' ? null : new Date(ob.startdate);
        const enddate =
          ob.enddate === ''
            ? null
            : new Date(new Date(ob.enddate).setHours(23, 59, 59, 999));
        if (sched.Name.includes('-S3-')) {
          const pullHH = ob.pulltime.split(':')[0] || '*';
          const pullMM = ob.pulltime.split(':')[1] || '*';
          sched.EndDate = enddate;
          sched.StartDate = startdate;
          const now = new Date();
          if (sched.StartDate < now) {
            sched.StartDate = now;
          }
          sched.State = 'ENABLED';
          sched.ScheduleExpression = `cron(${pullMM} ${pullHH} * * ? *)`;
          sched.ScheduleExpressionTimezone = `America/New_York`;
          // eslint-disable-next-line no-await-in-loop
          await updateSchedule(sched);
        } else if (sched.Name.includes('Send-')) {
          const sendHH = ob.sendtime.split(':')[0] || '*';
          const sendMM = ob.sendtime.split(':')[1] || '*';
          sched.EndDate = enddate;
          sched.StartDate = startdate;
          const now = new Date();
          if (sched.StartDate < now) {
            sched.StartDate = now;
          }
          sched.State = 'ENABLED';
          sched.ScheduleExpression = `cron(${sendMM} ${sendHH} * * ? *)`;
          sched.ScheduleExpressionTimezone = `America/New_York`;
          // eslint-disable-next-line no-await-in-loop
          await updateSchedule(sched);
        } else if (sched.Name.includes('Status-')) {
          let statusHH = ob.sendtime.split(':')[0] || '*';
          const statusMM = ob.sendtime.split(':')[1] || '*';
          if (parseInt(statusHH, 10) !== 'NaN') {
            statusHH = `${parseInt(statusHH, 10) + 1}`;
          }
          sched.EndDate = enddate;
          sched.StartDate = startdate;
          const now = new Date();
          if (sched.StartDate < now) {
            sched.StartDate = now;
          }
          sched.State = newstate;
          sched.ScheduleExpression = `cron(${statusMM} ${statusHH} * * ? *)`;
          sched.ScheduleExpressionTimezone = `America/New_York`;
          // eslint-disable-next-line no-await-in-loop
          await updateSchedule(sched);
        }
      }
    }

    const btnCancel = divh.querySelector('#btn-cancel');
    btnCancel.addEventListener('click', ev => {
      ev.preventDefault();
      window.location.href = '/marketing-triggers';
    });

    const btnDraft = divh.querySelector('#btn-save-draft');
    btnDraft.addEventListener('click', async ev => {
      console.log('DRAFT');
      ev.preventDefault();
      const modal = divh.querySelector('#disableModal');
      modal.style.display = 'block';
      const span = divh.querySelector('#disableModal .close');
      const submitBtn = divh.querySelector('#disableModal #submitBtn');
      const cancelBtn = divh.querySelector('#disableModal #cancelBtn');

      // eslint-disable-next-line no-unused-vars
      span.addEventListener('click', e => {
        const modalwindow = document.querySelector('#disableModal');
        modalwindow.style.display = 'none';
      });
      // eslint-disable-next-line no-unused-vars
      cancelBtn.addEventListener('click', e2 => {
        const modalwindow = document.querySelector('#disableModal');
        modalwindow.style.display = 'none';
      });
      // eslint-disable-next-line no-unused-vars
      submitBtn.addEventListener('click', async e3 => {
        e3.preventDefault();
        try {
          await updateScheduleStatus('DISABLED');
          window.location = `/marketing-triggers`;
        } catch (error) {
          alert(error.message);
        }
      });
    });

    const btnEnable = divh.querySelector('#btn-enable');
    btnEnable.addEventListener('click', async ev => {
      // eslint-disable-next-line prettier/prettier
      console.log('ENABLE');
      // showSpinner();
      ev.preventDefault();
      // divheader.innerHTML = divheader.innerHTML.replace(
      //   '$$CampaignName$$',
      //   campaignid,
      // );
      // let ob = formToObject(divheader);
      const modal = divh.querySelector('#enableModal');
      modal.style.display = 'block';
      const span = divh.querySelector('#enableModal .close');
      const submitBtn = divh.querySelector('#enableModal #submitBtn');
      const cancelBtn = divh.querySelector('#enableModal #cancelBtn');

      // eslint-disable-next-line no-unused-vars
      span.addEventListener('click', e => {
        const modalwindow = document.querySelector('#enableModal');
        modalwindow.style.display = 'none';
      });
      // eslint-disable-next-line no-unused-vars
      cancelBtn.addEventListener('click', e2 => {
        const modalwindow = document.querySelector('#enableModal');
        modalwindow.style.display = 'none';
      });

      // eslint-disable-next-line no-unused-vars
      submitBtn.addEventListener('click', async e3 => {
        e3.preventDefault();
        try {
          await updateScheduleStatus('ENABLED');
          window.location = `/marketing-triggers`;
        } catch (error) {
          alert(error.message);
        }
      });
    });

    return false; // Form is valid
  }

  function stringToTags(str) {
    const pairs = str.split(',');
    const result = [];
    if (str === '') return [];
    // eslint-disable-next-line no-restricted-syntax
    for (const pair of pairs) {
      const [Key, Value] = pair.split('=');
      result.push({ Key, Value });
    }
    return result;
  }

  function tagsToObj(tgs) {
    const obj = {};
    for (let i = 0; i < tgs.length; i++) {
      const kv = tgs[i];
      obj[kv.Key] = kv.Value;
    }
    return obj;
  }

  function objToString(obj) {
    let result = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        result += `${key}=${obj[key]}, `;
      }
    }
    // Remove the trailing comma if the object is not empty
    return result.length > 0 ? result.slice(0, -2) : result;
  }

  validateForm(divheader);

  block.append(divheader);
}
