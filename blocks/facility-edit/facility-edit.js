/* eslint-disable no-debugger */
import {
  fetchFacilityById,
  createOrUpdateFacility,
} from '../../scripts/s3script.js';
import { usstates } from '../../constants/usstates.js';
import { countrystate } from '../../constants/countrystate.js';
import { getUser } from '../../store/userStore.js';

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
  const ustafacilityid = Number(urlParams.get('ustafacilityid'));

  const createFacilityOperation = window.location.pathname.includes('create');

  let facility = {
    ustaFacilityId: null,
    facilityStatus: 'Active',
    externalFacilityId: '',
    name: '',
    address: {
      streetAddressLine1: '',
      streetAddressLine2: '',
      city: '',
      state: '',
      zip: '00000',
      postalCode: '00000-000',
      country: 'US',
      latitude: '40.270742',
      longitude: '-75.143615',
    },
    courts: {
      totalIndoorTennisCourts: '',
      totalOutdoorTennisCourts: '',
    },
    verifiedBy: 'Test User',
    phoneNumber: '555-555-5555',
    website: 'www.usta.com',
    sourceData: 'USTA',
    lastUpdatedBy: 'Logged in user',
  };
  // eslint-disable-next-line no-unused-vars
  if (ustafacilityid) {
    facility = await fetchFacilityById(ustafacilityid);
  }

  const divheader = document.createElement('div');
  divheader.innerHTML = `
<form class="rendered-form">
    <div class="formbuilder-text form-group field-text-facility-usta-number">
        <label for="text-facility-usta-number" class="formbuilder-text-label">FACILITY USTA NUMBER<span class="formbuilder-required">*</span></label>
        <input type="number" class="form-control" name="ustaFacilityId" access="false" id="text-facility-usta-number" required="required" aria-required="true" disabled>
        <span class="field-error" id="facility-usta-number-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-zendesk-internal-id">
        <label for="text-zendesk-internal-id" class="formbuilder-text-label">ZENDESK INTERNAL ID</label>
        <input type="text" class="form-control" name="externalFacilityId" access="false" id="text-zendesk-internal-id">
        <span class="field-error" id="zendesk-internal-id-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-name">
        <label for="text-name" class="formbuilder-text-label">NAME</label>
        <input type="text" class="form-control" name="name" access="false" id="text-name">
        <span class="field-error" id="name-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-address">
        <label for="text-address" class="formbuilder-text-label">ADDRESS<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="address.streetAddressLine1" access="false" id="text-address" required="required" aria-required="true">
        <span class="field-error" id="address-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-city">
        <label for="text-city" class="formbuilder-text-label">CITY<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="address.city" access="false" id="text-city" required="required" aria-required="true">
        <span class="field-error" id="city-error"></span>
    </div>
    <div class="formbuilder-select form-group field-text-country">
        <label for="text-country" class="formbuilder-select-label">COUNTRY<span class="formbuilder-required">*</span></label>
        <select class="form-control" name="address.country" access="false" id="text-country" required="required" aria-required="true"></select>
        <span class="field-error" id="country-error"></span>
    </div>
    <div class="formbuilder-select form-group field-text-state">
        <label for="text-state" class="formbuilder-select-label">STATE/PROVINCE<span class="formbuilder-required">*</span></label>
        <select class="form-control" name="address.state" access="false" id="text-state" required="required" aria-required="true"></select>
        <span class="field-error" id="state-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-zip">
        <label for="text-zip" class="formbuilder-text-label">ZIP/POSTAL CODE</label>
        <input type="text" class="form-control" name="address.zip" access="false" id="text-zip">
        <span class="field-error" id="zip-error"></span>
    </div>
    <div class="formbuilder-select form-group field-select-facilitytype">
        <label for="select-facilitytype" class="formbuilder-select-label">FACILITY TYPE</label>
        <select class="form-control" name="facilityType" id="select-facilitytype">
            <option value="Club" selected="true" id="select-facilitytype-0">Club</option>
            <option value="Corporation" id="select-facilitytype-1">Corporation</option>
            <option value="Parks & Recreation" id="select-facilitytype-2">Parks &amp; Recreation</option>
            <option value="Private Homeowner" id="select-facilitytype-3">Private Homeowner</option>
            <option value="School" id="select-facilitytype-4">School</option>
            <option value="Service Facility" id="select-facilitytype-5">Service Facility</option>
        </select>
    </div>
    <div class="formbuilder-select form-group field-select-facilitytype-detail">
        <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY TYPE DETAIL</label>
        <select class="form-control" name="facilityTypeDetail" id="select-facilitytype-detail">
            <option value="Apartments/Condominiums" selected="true" id="select-facilitytype-detail-0">Apartments/Condominiums</option>
            <option value="Athletic/Commercial club" id="select-facilitytype-detail-1">Athletic/Commercial Club</option>
            <option value="College/University" id="select-facilitytype-detail-2">College/University</option>
            <option value="Community/Recreation" id="select-facilitytype-detail-3">Community/Recreation</option>
            <option value="Center" id="select-facilitytype-detail-4">Center</option>
            <option value="Corporation" id="select-facilitytype-detail-5">Corporation</option>
            <option value="Country Club" id="select-facilitytype-detail-6">Country Club</option>
            <option value="Homeowner Association" id="select-facilitytype-detail-7">Homeowner Association</option>
            <option value="Hotel/Resort" id="select-facilitytype-detail-8">Hotel/Resort</option>
            <option value="Military Base" id="select-facilitytype-detail-9">Military Base</option>
            <option value="Public Park" id="select-facilitytype-detail-10">Public Park</option>
            <option value="Private Residence" id="select-facilitytype-detail-11">Private Residence</option>
            <option value="School" id="select-facilitytype-detail-12">School</option>
        </select>
    </div>
    <div class="formbuilder-radio">
        IS PRIVATE<span class="formbuilder-required">*</span>
        <div class="formbuilder-select form-group radio-isprivate">
            <input type="radio" id="radio-isprivate-yes" name="isPrivate" value="Yes">
            <label for="html">Yes</label><br>
            <input type="radio" id="radio-isprivate-no" name="isPrivate" value="No">
            <label for="css">No</label><br>
        </div>
    </div>
    <div class="formbuilder-select form-group field-select-facility-status">
        <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY STATUS</label>
        <select class="form-control" name="facilityStatus" id="select-facility-status">
            <option value="Active" selected="true" id="select-facility-status-0">Active</option>
            <option value="Closed" id="select-facility-status-1">Closed</option>
            <option value="Converted/PickleBall" id="select-facility-status-2">Converted/PickleBall</option>
            <option value="Duplicate" id="select-facility-status-3">Duplicate</option>
            <option value="Nonexistent" id="select-facility-status-4">Nonexistent</option>
        </select>
    </div>
    <div class="formbuilder-text form-group field-text-survivor-facility-id hidden">
        <label for="text-zip" class="formbuilder-text-label">SURVIVOR FACILITY ID</label>
        <input type="text" class="form-control" name="survivorFacilityId" access="false" id="text-survivor-facility-id">
        <span class="field-error" id="survivor-facility-id-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-total-indoor-tennis-courts">
        <label for="text-name" class="formbuilder-text-label">TOTAL INDOOR TENNIS COURTS<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="courts.totalIndoorTennisCourts" access="false" id="text-total-indoor-tennis-courts">
        <span class="field-error" id="total-indoor-tennis-courts-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-total-outdoor-tennis-courts">
        <label for="text-address" class="formbuilder-text-label">TOTAL OUTDOOR TENNIS COURTS<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="courts.totalOutdoorTennisCourts" access="false" id="text-total-outdoor-tennis-courts" required="required" aria-required="true">
        <span class="field-error" id="total-outdoor-tennis-courts-error"></span>
        </div>
    <div class="formbuttons">
        <button class="formbutton" id="btn-cancel">CANCEL</button>
        <button class="formbutton" id="btn-next">SUBMIT</button>
    </div>
</form>`;

  const statebox = divheader.querySelector('#text-state');
  usstates.data.forEach(state => {
    const option = document.createElement('option');
    option.value = state.id;
    option.text = state.value;
    statebox.appendChild(option);
  });

  const countrybox = divheader.querySelector('#text-country');
  countrystate.country.forEach(country => {
    const option = document.createElement('option');
    option.value = country.value;
    option.text = country.label;
    countrybox.appendChild(option);
  });

  // eslint-disable-next-line no-use-before-define
  populateForm(divheader);

  async function populateForm(divh) {
    // eslint-disable-next-line no-unused-vars

    // facility USTA Number
    const fieldFacilityUSTANumber = divh.querySelector(
      '#text-facility-usta-number',
    );
    fieldFacilityUSTANumber.value = Number(facility.ustaFacilityId);
    // externalFacilityId
    const fieldExternalFacilityId = divh.querySelector(
      '#text-zendesk-internal-id',
    );
    fieldExternalFacilityId.value = facility.externalFacilityId;
    // Name
    const facilityName = divh.querySelector('#text-name');
    facilityName.value = facility.name;
    // Address
    const fieldAddress = divh.querySelector('#text-address');
    fieldAddress.value = facility.address.streetAddressLine1;
    // City
    const fieldCity = divh.querySelector('#text-city');
    fieldCity.value = facility.address.city;
    // Country
    const fieldCountry = divh.querySelector('#text-country');
    fieldCountry.value = facility.address.country;
    // State
    const fieldState = divh.querySelector('#text-state');
    fieldState.value = facility.address.state;
    // Zip
    const fieldZip = divh.querySelector('#text-zip');
    fieldZip.value = facility.address.zip;
    // FacilityType
    const fieldFacilityType = divh.querySelector('#select-facilitytype');
    fieldFacilityType.value = facility.facilityType;
    // FacilityTypeDetail
    const fieldFacilityTypeDetail = divh.querySelector(
      '#select-facilitytype-detail',
    );
    fieldFacilityTypeDetail.value = facility.facilityTypeDetail;
    // Private?
    const fieldIsPrivateYes = divh.querySelector('#radio-isprivate-yes');
    const fieldIsPrivateNo = divh.querySelector('#radio-isprivate-no');
    fieldIsPrivateYes.checked = facility.isPrivateFlag;
    fieldIsPrivateNo.checked = !facility.isPrivateFlag;
    // FacilityStatus
    const fieldFacilityStatus = divh.querySelector('#select-facility-status');
    fieldFacilityStatus.value = facility.facilityStatus;
    // FacilityStatus
    const survivorFacilityId = divh.querySelector('#text-survivor-facility-id');
    survivorFacilityId.value = facility.survivorFacilityId;
    // Total indoor tennis courts
    const fieldTotalIndoorTennisCourts = divh.querySelector(
      '#text-total-indoor-tennis-courts',
    );
    fieldTotalIndoorTennisCourts.value =
      facility.courts.totalIndoorTennisCourts;
    // Total outdoor tennis courts
    const fieldTotalOutdoorTennisCourts = divh.querySelector(
      '#text-total-outdoor-tennis-courts',
    );
    fieldTotalOutdoorTennisCourts.value =
      facility.courts.totalOutdoorTennisCourts;
  }

  //   function updateForm(divh) {
  //     const date = new Date();
  //     const formattedDate = date.toISOString().slice(0, 16).replace(':', '.');
  //     const dummy = {
  //         "facilityStatus": "Active",
  //         "externalFacilityId" : "b89eeafa-218e-11ee-be56-0242ac120002",
  //         "name": "Facility (with phone and website after update)",
  //         "address": {
  //           "streetAddressLine1": "",
  //           "streetAddressLine2": "",
  //           "city": "",
  //           "state": "",
  //           "zip": "00000",
  //           "postalCode": "00000-2650",
  //           "country": "US",
  //           "latitude": "40.270742",
  //           "longitude": "-75.143615"
  //          },
  //         "verifiedBy": "Test User",
  //         "phoneNumber": "555-555-5555",
  //         "website": "www.usta.com",
  //         "sourceData": "USTA",
  //         "lastUpdatedBy": "Logged in user"
  //       }
  //   }

  //   function createForm(divh) {
  //     const date = new Date();
  //     const formattedDate = date.toISOString().slice(0, 19);
  //   }

  function formToObject(divh) {
    const object = {};
    const formElement = divh.querySelector('.rendered-form');
    const formData = new FormData(formElement);
    // eslint-disable-next-line no-return-assign
    formData.forEach((value, key) => (object[key] = value));
    return object;
  }

  function validateForm(divh) {
    // validate zendesk-internal-id
    const fieldZendesk = divh.querySelector('#text-zendesk-internal-id');
    fieldZendesk.addEventListener('blur', ev => {
      // eslint-disable-next-line no-use-before-define
      if (!isDigitsOnly(fieldZendesk.value)) {
        ev.target.parentNode.classList.add('field-input-error');
        const zendeskInternalIdError = divh.querySelector(
          '#zendesk-internal-id-error',
        );
        zendeskInternalIdError.innerHTML = 'Please enter only numbers.';
      }
    });
    fieldZendesk.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const zendeskInternalIdError = divh.querySelector(
        '#zendesk-internal-id-error',
      );
      zendeskInternalIdError.innerHTML = '';
    });
    // validate zip
    const fieldFacilityZip = divh.querySelector('#text-zip');
    fieldFacilityZip.addEventListener('blur', ev => {
      // eslint-disable-next-line no-use-before-define
      if (
        // eslint-disable-next-line no-use-before-define
        !isDigitsOnly(fieldFacilityZip.value) ||
        fieldFacilityZip.value.length !== 5
      ) {
        ev.target.parentNode.classList.add('field-input-error');
        const zipError = divh.querySelector('#zip-error');
        zipError.innerHTML = 'Please enter only a 5-digit numeric zip code.';
      }
    });
    fieldFacilityZip.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const zipError = divh.querySelector('#zip-error');
      zipError.innerHTML = '';
    });
    // validate name
    const fieldZendeskInternalId = divh.querySelector(
      '#text-zendesk-internal-id',
    );
    fieldZendeskInternalId.addEventListener('blur', ev => {
      if (fieldZendeskInternalId.value.length > 100) {
        ev.target.parentNode.classList.add('zendesk-internal-id-error');
        const nameError = divh.querySelector('#zendesk-internal-id-error');
        nameError.innerHTML = 'Please do not enter more than 100 characters.';
      }
    });
    fieldZendeskInternalId.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('zendesk-internal-id-error');
      const nameError = divh.querySelector('#zendesk-internal-id-error');
      nameError.innerHTML = '';
    });
    // validate name
    const fieldFacilityName = divh.querySelector('#text-name');
    fieldFacilityName.addEventListener('blur', ev => {
      if (fieldFacilityName.value.length > 100) {
        ev.target.parentNode.classList.add('field-input-error');
        const nameError = divh.querySelector('#name-error');
        nameError.innerHTML = 'Please do not enter more than 100 characters.';
      }
    });
    fieldFacilityName.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const nameError = divh.querySelector('#name-error');
      nameError.innerHTML = '';
    });
    // validate address
    const fieldFacilityAddr = divh.querySelector('#text-address');
    fieldFacilityAddr.addEventListener('blur', ev => {
      if (fieldFacilityAddr.value.length > 200) {
        ev.target.parentNode.classList.add('field-input-error');
        const addressError = divh.querySelector('#address-error');
        addressError.innerHTML =
          'Please do not enter more than 200 characters.';
      }

      if (fieldFacilityAddr.value.toLowerCase().includes('po box')) {
        ev.target.parentNode.classList.add('field-input-error');
        const addressError = divh.querySelector('#address-error');
        addressError.innerHTML = 'P.O. Boxes are not permitted.';
      }
    });
    fieldFacilityAddr.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const addressError = divh.querySelector('#address-error');
      addressError.innerHTML = '';
    });

    // validate city
    const fieldFacilityCity = divh.querySelector('#text-city');
    fieldFacilityCity.addEventListener('blur', ev => {
      if (fieldFacilityCity.value.length > 50) {
        ev.target.parentNode.classList.add('field-input-error');
        const cityError = divh.querySelector('#city-error');
        cityError.innerHTML = 'Please do not enter more than 50 characters';
      }
    });
    fieldFacilityCity.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const cityError = divh.querySelector('#city-error');
      cityError.innerHTML = '';
    });

    // validate facility status and set up event listener
    const fieldFacilityStatus = divh.querySelector('#select-facility-status');
    if (fieldFacilityStatus.value === 'Duplicate') {
      const fieldSurvivor = divh.querySelector(
        '.field-text-survivor-facility-id',
      );
      fieldSurvivor.classList.remove('hidden');
    }
    fieldFacilityStatus.addEventListener('change', () => {
      if (fieldFacilityStatus.value === 'Duplicate') {
        const fieldSurvivor = divh.querySelector(
          '.field-text-survivor-facility-id',
        );
        fieldSurvivor.classList.remove('hidden');
      } else {
        const fieldSurvivor = divh.querySelector(
          '.field-text-survivor-facility-id',
        );
        fieldSurvivor.classList.add('hidden');
      }
    });

    // validate Total Indoor Courts
    const fieldTotalIndoorTennisCourts = divh.querySelector(
      '#text-total-indoor-tennis-courts',
    );
    fieldTotalIndoorTennisCourts.addEventListener('blur', ev => {
      // eslint-disable-next-line no-use-before-define
      if (!isDigitsOnly(fieldTotalIndoorTennisCourts.value)) {
        ev.target.parentNode.classList.add('field-input-error');
        const totalIndoorTennisCourtsError = divh.querySelector(
          '#total-indoor-tennis-courts-error',
        );
        totalIndoorTennisCourtsError.innerHTML =
          'Please enter only positive numbers.';
      }
    });
    fieldTotalIndoorTennisCourts.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const totalIndoorTennisCourtsError = divh.querySelector(
        '#total-indoor-tennis-courts-error',
      );
      totalIndoorTennisCourtsError.innerHTML = '';
    });

    // validate Total Outdoor Courts
    const fieldTotalOutdoorTennisCourts = divh.querySelector(
      '#text-total-outdoor-tennis-courts',
    );
    fieldTotalOutdoorTennisCourts.addEventListener('blur', ev => {
      // eslint-disable-next-line no-use-before-define
      if (!isDigitsOnly(fieldTotalOutdoorTennisCourts.value)) {
        ev.target.parentNode.classList.add('field-input-error');
        const totalOutdoorTennisCourtsError = divh.querySelector(
          '#total-outdoor-tennis-courts-error',
        );
        totalOutdoorTennisCourtsError.innerHTML =
          'Please enter only positive numbers.';
      }
    });
    fieldTotalOutdoorTennisCourts.addEventListener('focus', ev => {
      ev.target.parentNode.classList.remove('field-input-error');
      const totalOutdoorTennisCourtsError = divh.querySelector(
        '#total-outdoor-tennis-courts-error',
      );
      totalOutdoorTennisCourtsError.innerHTML = '';
    });

    const btnCancel = divh.querySelector('#btn-cancel');
    btnCancel.addEventListener('click', ev => {
      ev.preventDefault();
      window.location.href = '/facility-search';
    });

    const btnSubmit = divh.querySelector('#btn-next');
    btnSubmit.addEventListener('click', async ev => {
      // eslint-disable-next-line prettier/prettier
      console.log('SUBMIT');
      ev.preventDefault();
      const ob = formToObject(divheader);
      ob.ustaFacilityId = Number(ob.ustaFacilityId);
      const addr = {
        streetAddressLine1: ob['address.streetAddressLine1'],
        city: ob['address.city'],
        state: ob['address.state'],
        zip: ob['address.zip'],
        country: ob['address.country'],
      };
      const courts = {
        totalIndoorTennisCourts: Number(ob['courts.totalIndoorTennisCourts']),
        totalOutdoorTennisCourts: Number(ob['courts.totalOutdoorTennisCourts']),
      };
      ob.isPrivateFlag = ob.isPrivate === 'Yes';
      delete ob['address.streetAddressLine1'];
      delete ob['address.city'];
      delete ob['address.state'];
      delete ob['address.zip'];
      delete ob['address.country'];

      delete ob['courts.totalIndoorTennisCourts'];
      delete ob['courts.totalOutdoorTennisCourts'];
      delete ob.isPrivate;
      facility.address = { ...facility.address, ...addr };
      facility.courts = { ...facility.courts, ...courts };
      const updatedfacility = { ...facility, ...ob };
      //   const date = new Date();
      //   updatedfacility.lastUpdatedDateTime = date.toISOString().slice(0, 19);
      delete updatedfacility.address.district_id;
      delete updatedfacility.address.section_id;
      delete updatedfacility.address.latitude;
      delete updatedfacility.address.longitude;
      delete updatedfacility.lastUpdatedDateTime;
      delete updatedfacility.createdDateTime;
      // delete all derived fields
      delete updatedfacility.courts.hasGrassCourts;
      delete updatedfacility.courts.hasHardCourts;
      delete updatedfacility.courts.hasClayCourts;
      delete updatedfacility.courts.hasOtherCourtSurface;
      delete updatedfacility.courts.hasOutdoorLightedCourts;
      delete updatedfacility.courts.has36ftCourts;
      delete updatedfacility.courts.hasBlended36ftCourts;
      delete updatedfacility.courts.hasStandalone36ftCourts;
      delete updatedfacility.courts.has60ftCourts;
      delete updatedfacility.courts.hasBlended60ftCourts;
      delete updatedfacility.courts.hasStandalone60ftCourts;
      delete updatedfacility.courts.has78ftCourts;
      delete updatedfacility.courts.hasPickleballCourts;
      updatedfacility.lastUpdatedBy = userNameCpitalized;
      if (updatedfacility.facilityStatus !== 'Duplicate') {
        delete updatedfacility.survivorFacilityId;
      }
      updatedfacility.sourceData = 'Customer Care';
      console.log(addr);
      console.log(facility);
      console.log(ob);
      console.log(updatedfacility);
      if (createFacilityOperation) delete updatedfacility.ustaFacilityId;
      const response = await createOrUpdateFacility(updatedfacility);
      console.log(response);
      if (response.message) {
        alert(response.message);
      } else {
        window.location = `/facility-confirm?ustafacilityid=${response.ustaFacilityId}`;
      }
    });
    return false; // Form is valid
  }

  function isDigitsOnly(str) {
    return /^\d+$/.test(str);
  }

  validateForm(divheader);

  block.append(divheader);
}
