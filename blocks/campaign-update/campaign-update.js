/* eslint-disable no-debugger */
import {
  fetchFacilityById,
  createOrUpdateFacility,
  addressValidation,
  listSchedule,
  getScheduleGroup,
  listTagsForResource,
  getSchedule,
  tagResource,
  updateSchedule,
} from '../../scripts/s3script.js';
import { htmlForm } from './campaign-update-html.js';
import { getUser } from '../../store/userStore.js';

const incompleteMessage = 'Address is too incomplete to be saved';

// let modalSelect;
const updatedfacility = {};
const matchedAddress = {};
let schedule = {};
let scheduleGroup = {};
let schedules = [];
let tags = [];
let sanitizedtags = [];
let campaignGroupName = '';
const campaignForm = {};
// eslint-disable-next-line no-unused-vars
let modalSelect = '';
const user = getUser();
const userName = user.UserAttributes.find(o => o.Name === 'name')?.Value;
const userNameCpitalized =
  // eslint-disable-next-line no-unsafe-optional-chaining
  userName?.charAt(0).toUpperCase() + userName.slice(1);

export default async function decorate(block) {
  // Get the query string from the URL
  const queryString = window.location.search;

  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Get the value of a specific parameter
  const campaignid = urlParams.get('campaignid');
  const createFacilityOperation = window.location.pathname.includes('create');

  // eslint-disable-next-line no-unused-vars
  if (campaignid) {
    // to-do
    schedule = await listSchedule(campaignid);
    schedules = schedule?.Schedules;
    if (schedules.length > 0) {
      const oneschedule = await getSchedule({
        groupName: campaignid,
        scheduleName: schedules[0]?.Name,
      });
    }
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
  divheader.innerHTML = htmlForm.replace('$$CampaignName$$', campaignid);
  debugger;
  // eslint-disable-next-line no-use-before-define
  await populateForm(divheader);

  // eslint-disable-next-line no-unused-vars
  function modalMessageOpen(msg) {}

  // eslint-disable-next-line no-unused-vars
  function modalAddressConfirm() {
    const bdy = document.createElement('div');
    bdy.innerHTML = `
      <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-header">No Address Found</div>
    <div class="modal-body">
      <div class="modal-sub-header">Would you like to continue with this address?</div>

    <form id="modal-form">
      <button type="button" id="submitBtn">CONTINUE</button>
      <button type="button" id="cancelBtn">CANCEL</button>
    </form>
    </div>
  </div>
    `;
    const showDiv = divheader.querySelector('#myModal');
    showDiv.style.display = 'block';
    showDiv.innerHTML = '';
    showDiv.appendChild(bdy);
    // const modal = showDiv.querySelector('#myModal');
    const span = showDiv.querySelector('.close');
    const submitBtn = showDiv.querySelector('#submitBtn');
    const cancelBtn = showDiv.querySelector('#cancelBtn');
    span.onclick = function () {
      const modalwindow = document.querySelector('#myModal');
      modalwindow.style.display = 'none';
    };
    window.onclick = function (event) {
      const modal = document.querySelector('#myModal');
      if (event.target === modal) {
        const modalwindow = document.querySelector('#myModal');
        modalwindow.style.display = 'none';
      }
    };
    submitBtn.onclick = async function () {
      // eslint-disable-next-line no-use-before-define
      if (incompleteAddress(updatedfacility.address)) {
        alert(incompleteMessage);
      } else {
        const response = await createOrUpdateFacility(updatedfacility);
        // hideSpinner();
        console.log(response);
        if (response.message) {
          alert(response.message);
        } else {
          window.location = `/facility-confirm?ustafacilityid=${response.ustaFacilityId}`;
        }
      }

      // const response = await createOrUpdateFacility(updatedfacility);
      // // hideSpinner();
      // console.log(response);
      // if (response.message) {
      //   alert(response.message);
      // } else {
      //   window.location = `/facility-confirm?ustafacilityid=${response.ustaFacilityId}`;
      // }
      const modalwindow = document.querySelector('#myModal');
      modalwindow.style.display = 'none';
    };
    cancelBtn.onclick = function () {
      const modalwindow = document.querySelector('#myModal');
      modalwindow.style.display = 'none';
    };
  }
  // eslint-disable-next-line no-unused-vars
  function modalAddressSelect(addr1, addr2) {
    const bdy = document.createElement('div');
    bdy.innerHTML = `
      <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-header">We found a similar address</div>
    <div class="modal-body">
      <div class="modal-sub-header">Please verify your address below</div>

    <div class="row">
  <div class="column">
We found:
    <div>
    ${addr1.address1}<br/>
    ${addr1?.city}, ${addr1?.state} ${addr1?.zip}<br/>
    ${addr1.country}<br/><br/>
    <input type="radio" id="radio1" name="addressoption" value="selectFound" checked>
    <label for="radio1">Use this address</label>
    </div>
  </div>

  <div class="column">
You entered:
    <div>
    ${addr2.address1}<br/>
    ${addr2?.city}, ${addr2?.state} ${addr2?.zip}<br/>
    ${addr2.country}<br/><br/>
    <input type="radio" id="radio2" name="addressoption" value="selectEntered">
    <label for="radio2">Use the address you entered</label>
    </div>
  </div>
</div>

    <form id="modal-form">
      <button type="button" id="submitBtn">CONTINUE</button>
      <button type="button" id="cancelBtn">CANCEL</button>
    </form>
    </div>
  </div>
    `;
    const showDiv = divheader.querySelector('#myModal');
    showDiv.style.display = 'block';
    showDiv.innerHTML = '';
    showDiv.appendChild(bdy);
    const modal = showDiv.querySelector('#myModal');
    const span = showDiv.querySelector('.close');
    const submitBtn = showDiv.querySelector('#submitBtn');
    const cancelBtn = showDiv.querySelector('#cancelBtn');
    span.onclick = function () {
      const modalwindow = document.querySelector('#myModal');
      modalwindow.style.display = 'none';
    };

    window.onclick = function (event) {
      if (event.target === modal) {
        // const modal = document.querySelector('#myModal');
        const modalwindow = document.querySelector('#myModal');
        modalwindow.style.display = 'none';
      }
    };

    submitBtn.onclick = async function () {
      modalSelect = '';
      // Get all radio buttons with the specified name
      const radioButtons = document.querySelectorAll(
        'input[name="addressoption"]',
      );

      // Find the selected radio button
      radioButtons.forEach(radioButton => {
        if (radioButton.checked) {
          modalSelect = radioButton.value;
        }
      });
      if (modalSelect === 'selectFound') {
        updatedfacility.address.streetAddressLine1 = addr1.address1;
        updatedfacility.address.city = addr1.city;
        updatedfacility.address.postalCode = addr1.zip;
        updatedfacility.address.zip = addr2.zip;
        updatedfacility.address.state = addr1.state;
      } else {
        updatedfacility.address.postalCode = updatedfacility.address.zip;
      }

      // eslint-disable-next-line no-use-before-define
      if (incompleteAddress(updatedfacility.address)) {
        // eslint-disable-next-line no-alert
        alert(incompleteMessage);
      } else {
        const response = await createOrUpdateFacility(updatedfacility);
        // hideSpinner();
        console.log(response);
        if (response.message) {
          alert(response.message);
        } else {
          window.location = `/facility-confirm?ustafacilityid=${response.ustaFacilityId}`;
        }
      }

      // const response = await createOrUpdateFacility(updatedfacility);
      // // hideSpinner();
      // console.log(response);
      // if (response.message) {
      //   alert(response.message);
      // } else {
      //   window.location = `/facility-confirm?ustafacilityid=${response.ustaFacilityId}`;
      // }
      const modalwindow = document.querySelector('#myModal');
      modalwindow.style.display = 'none';
    };

    cancelBtn.onclick = function () {
      const modalwindow = document.querySelector('#myModal');
      modalwindow.style.display = 'none';
    };
  }

  async function populateForm(divh) {
    // eslint-disable-next-line no-unused-vars

    // campaign name
    const campaignName = divh.querySelector('#campaign-name');
    campaignGroupName = campaignName;
    // debugger;
    campaignName.value = tags.Title;
    // list tags comma separated
    const campaignTags = divh.querySelector('#campaign-tags');
    // eslint-disable-next-line no-use-before-define
    campaignTags.value = objToString(sanitizedtags);

    // description
    const campaignCDescription = divh.querySelector('#campaign-description');
    campaignCDescription.value = tags.Description;
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
    const btnCancel = divh.querySelector('#btn-cancel');
    btnCancel.addEventListener('click', ev => {
      ev.preventDefault();
      window.location.href = '/marketing-triggers';
    });

    const btnEnable = divh.querySelector('#btn-enable');
    btnEnable.addEventListener('click', async ev => {
      // eslint-disable-next-line prettier/prettier
      console.log('ENABLE');
      // showSpinner();
      ev.preventDefault();
      debugger;
      // divheader.innerHTML = divheader.innerHTML.replace(
      //   '$$CampaignName$$',
      //   campaignid,
      // );
      let ob = formToObject(divheader);
      const modal = divh.querySelector('#enableModal');
      modal.style.display = 'block';
      const span = divh.querySelector('.close');
      const submitBtn = divh.querySelector('#submitBtn');
      const cancelBtn = divh.querySelector('#cancelBtn');
      const modalValue = null;

      span.addEventListener('click', ev => {
        const modalwindow = document.querySelector('#enableModal');
        modalwindow.style.display = 'none';
      });
      cancelBtn.addEventListener('click', ev => {
        const modalwindow = document.querySelector('#enableModal');
        modalwindow.style.display = 'none';
      });

      submitBtn.addEventListener('click', async ev => {
        const modalwindow = document.querySelector('#enableModal');
        modalwindow.style.display = 'none';
        ev.preventDefault();
        let ob = formToObject(divheader);
        const titleAndDescriptionTags = [
          { Key: 'Title', Value: ob.name },
          { Key: 'Description', Value: ob.description },
        ];

        // eslint-disable-next-line no-use-before-define
        const tags = [
          ...titleAndDescriptionTags,
          // eslint-disable-next-line no-use-before-define
          ...stringToTags(ob.tagstring),
        ];
        // debugger;
        // await tagResource(scheduleGroup.Arn, tags);
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
          const enddate = ob.enddate === '' ? null : new Date(ob.enddate);
          if (sched.Name.includes('-S3-001TEST')) {
            sched.EndDate = enddate;
            sched.StartDate = startdate;
            debugger;
            // eslint-disable-next-line no-await-in-loop
            await updateSchedule(sched);
          } else if (sched.Name.includes('Send-')) {
            debugger;
          } else if (sched.Name.includes('Status-')) {
            debugger;
          }
          debugger;
        }
      });
    });

    return false; // Form is valid
  }

  function stringToTags(str) {
    const pairs = str.split(',');
    const result = [];
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

  function stringToObj(str) {
    const obj = {};
    const pairs = str.split(',');
    // eslint-disable-next-line no-restricted-syntax
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key && value) {
        obj[key.trim()] = value.trim();
      }
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

  function incompleteAddress(address) {
    return (
      address.streetAddressLine1 === '' ||
      address.city === '' ||
      address.state === '' ||
      address.country === '' ||
      address.zip === ''
    );
  }
  function isDigitsOnly(str) {
    return /^\d+$/.test(str);
  }

  validateForm(divheader);

  block.append(divheader);
}
