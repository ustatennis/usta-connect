import { fetchFacilityById } from '../../scripts/s3script.js';
// import { usstates } from '../../constants/usstates.js';
// import { countrystate } from '../../constants/countrystate.js';
// import { getUser } from '../../store/userStore.js';

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
  const ustafacilityid = Number(urlParams.get('ustafacilityid'));

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
    },
    courts: {
      totalIndoorTennisCourts: 0,
      totalOutdoorTennisCourts: 0,
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
    <div class="table">
    <div class="row">
      <div class="cell cell-title">FACILITY USTA NUMBER</div>
      <div class="cell">${facility.ustaFacilityId}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">ZENDESK INTERNAL ID</div>
      <div class="cell">Item 2</div>
    </div>
    <div class="row">
     <div class="cell cell-title">NAME</div>
      <div class="cell">${facility.name}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">ADDRESS</div>
      <div class="cell">${facility.address.streetAddressLine1}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">CITY</div>
      <div class="cell">${facility.address.city}</div>
    </div>
    <div class="row">
     <div class="cell cell-title">COUNTRY</div>
      <div class="cell">${facility.address.country}</div>
    </div>
        <div class="row">
      <div class="cell cell-title">STATE/PROVINCE</div>
      <div class="cell">${facility.address.state}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">ZIP/POSTAL CODE</div>
      <div class="cell">${facility.address.zip}</div>
    </div>
    <div class="row">
     <div class="cell cell-title">FACILITY TYPE</div>
      <div class="cell">${facility.facilityType}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">FACILITY TYPE DETAIL</div>
      <div class="cell">${facility.facilityTypeDetail}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">FACILITY STATUS</div>
      <div class="cell">${facility.facilityStatus}</div>
    </div>
    <div class="row">
     <div class="cell cell-title">TOTAL INDOOR TENNIS COURTS</div>
      <div class="cell">${facility.courts.totalIndoorTennisCourts}</div>
    </div>
    <div class="row">
      <div class="cell cell-title">TOTAL OUTDOOR TENNIS COURTS</div>
      <div class="cell">${facility.courts.totalOutdoorTennisCourts}</div>
    </div>
  </div>
  `;

  //   `
  // <form class="rendered-form">
  //     <div class="formbuilder-text form-group field-text-facility-usta-number">
  //         <label for="text-facility-usta-number" class="formbuilder-text-label">FACILITY USTA NUMBER<span class="formbuilder-required">*</span></label>
  //         <input type="number" class="form-control" name="ustaFacilityId" access="false" id="text-facility-usta-number" required="required" aria-required="true">
  //     </div>
  //     <div class="formbuilder-text form-group field-text-zendesk-internal-id">
  //         <label for="text-zendesk-internal-id" class="formbuilder-text-label">ZENDESK INTERNAL ID</label>
  //         <input type="text" class="form-control" name="externalFacilityId" access="false" id="text-zendesk-internal-id">
  //     </div>
  //     <div class="formbuilder-text form-group field-text-name">
  //         <label for="text-name" class="formbuilder-text-label">NAME</label>
  //         <input type="text" class="form-control" name="name" access="false" id="text-name">
  //     </div>
  //     <div class="formbuilder-text form-group field-text-adddress">
  //         <label for="text-adddress" class="formbuilder-text-label">ADDRESS<span class="formbuilder-required">*</span></label>
  //         <input type="text" class="form-control" name="address.streetAddressLine1" access="false" id="text-adddress" required="required" aria-required="true">
  //     </div>
  //     <div class="formbuilder-text form-group field-text-city">
  //         <label for="text-city" class="formbuilder-text-label">CITY<span class="formbuilder-required">*</span></label>
  //         <input type="text" class="form-control" name="address.city" access="false" id="text-city" required="required" aria-required="true">
  //     </div>
  //     <div class="formbuilder-select form-group field-text-country">
  //         <label for="text-country" class="formbuilder-select-label">COUNTRY<span class="formbuilder-required">*</span></label>
  //         <select class="form-control" name="address.country" access="false" id="text-country" required="required" aria-required="true"></select>
  //         <span class="field-error" id="country-error"></span>
  //     </div>
  //     <div class="formbuilder-select form-group field-text-state">
  //         <label for="text-state" class="formbuilder-select-label">STATE/PROVINCE<span class="formbuilder-required">*</span></label>
  //         <select class="form-control" name="address.state" access="false" id="text-state" required="required" aria-required="true"></select>
  //         <span class="field-error" id="state-error"></span>
  //     </div>
  //     <div class="formbuilder-text form-group field-text-zip">
  //         <label for="text-zip" class="formbuilder-text-label">ZIP/POSTAL CODE</label>
  //         <input type="text" class="form-control" name="address.zip" access="false" id="text-zip">
  //         <span class="field-error" id="zip-error"></span>
  //     </div>
  //     <div class="formbuilder-select form-group field-select-facilitytype">
  //         <label for="select-facilitytype" class="formbuilder-select-label">FACILITY TYPE</label>
  //         <select class="form-control" name="facilityType" id="select-facilitytype">
  //             <option value="Club" selected="true" id="select-facilitytype-0">Club</option>
  //             <option value="Corporation" id="select-facilitytype-1">Corporation</option>
  //             <option value="Carks & Recreation" id="select-facilitytype-2">Parks &amp; Recreation</option>
  //             <option value="Crivate Homeowner" id="select-facilitytype-3">Private Homeowner</option>
  //             <option value="School" id="select-facilitytype-4">School</option>
  //             <option value="Service Facility" id="select-facilitytype-5">Service Facility</option>
  //         </select>
  //     </div>
  //     <div class="formbuilder-select form-group field-select-facilitytype-detail">
  //         <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY TYPE DETAIL</label>
  //         <select class="form-control" name="facilityTypeDetail" id="select-facilitytype-detail">
  //             <option value="Apartments/Condominiums" selected="true" id="select-facilitytype-detail-0">Apartments/Condominiums</option>
  //             <option value="Athletic/Commercial club" id="select-facilitytype-detail-1">Athletic/Commercial Club</option>
  //             <option value="College/University" id="select-facilitytype-detail-2">College/University</option>
  //             <option value="Community/Recreation" id="select-facilitytype-detail-3">Community/Recreation</option>
  //             <option value="Center" id="select-facilitytype-detail-4">Center</option>
  //             <option value="Corporation" id="select-facilitytype-detail-5">Corporation</option>
  //             <option value="Country Club" id="select-facilitytype-detail-6">Country Club</option>
  //             <option value="Homeowner Association" id="select-facilitytype-detail-7">Homeowner Association</option>
  //             <option value="Hotel/Resort" id="select-facilitytype-detail-8">Hotel/Resort</option>
  //             <option value="Military Base" id="select-facilitytype-detail-9">Military Base</option>
  //             <option value="Public Park" id="select-facilitytype-detail-10">Public Park</option>
  //             <option value="Private Residence" id="select-facilitytype-detail-11">Private Residence</option>
  //             <option value="School" id="select-facilitytype-detail-12">School</option>
  //         </select>
  //     </div>
  //     <div class="formbuilder-radio">
  //         IS PRIVATE<span class="formbuilder-required">*</span>
  //         <div class="formbuilder-select form-group radio-isprivate">
  //             <input type="radio" id="radio-isprivate-yes" name="isPrivate" value="Yes">
  //             <label for="html">Yes</label><br>
  //             <input type="radio" id="radio-isprivate-no" name="isPrivate" value="No">
  //             <label for="css">No</label><br>
  //         </div>
  //     </div>
  //     <div class="formbuilder-select form-group field-select-facility-status">
  //         <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY STATUS</label>
  //         <select class="form-control" name="facilityStatus" id="select-facility-status">
  //             <option value="Active" selected="true" id="select-facility-status-0">Active</option>
  //             <option value="Closed" id="select-facility-status-1">Closed</option>
  //             <option value="Converted/PickleBall" id="select-facility-status-2">Converted/PickleBall</option>
  //             <option value="Duplicate" id="select-facility-status-3">Duplicate</option>
  //             <option value="Nonexistent" id="select-facility-status-4">Nonexistent</option>
  //         </select>
  //     </div>
  //     <div class="formbuilder-text form-group field-text-total-indoor-tennis-courts">
  //         <label for="text-name" class="formbuilder-text-label">TOTAL INDOOR TENNIS COURTS<span class="formbuilder-required">*</span></label>
  //         <input type="text" class="form-control" name="courts.totalIndoorTennisCourts" access="false" id="text-total-indoor-tennis-courts">
  //     </div>
  //     <div class="formbuilder-text form-group field-text-total-outdoor-tennis-courts">
  //         <label for="text-adddress" class="formbuilder-text-label">TOTAL OUTDOOR TENNIS COURTS<span class="formbuilder-required">*</span></label>
  //         <input type="text" class="form-control" name="courts.totalOutdoorTennisCourts" access="false" id="text-total-outdoor-tennis-courts" required="required" aria-required="true">
  //     </div>
  //     <div class="formbuttons">
  //         <button class="formbutton" id="btn-cancel">CANCEL</button>
  //         <button class="formbutton" id="btn-next">SUBMIT</button>
  //     </div>
  // </form>`;

  // const statebox = divheader.querySelector('#text-state');
  // usstates.data.forEach(state => {
  //   const option = document.createElement('option');
  //   option.value = state.id;
  //   option.text = state.value;
  //   statebox.appendChild(option);
  // });

  // const countrybox = divheader.querySelector('#text-country');
  // countrystate.country.forEach(country => {
  //   const option = document.createElement('option');
  //   option.value = country.value;
  //   option.text = country.label;
  //   countrybox.appendChild(option);
  // });

  // // eslint-disable-next-line no-use-before-define
  // populateForm(divheader);

  // async function populateForm(divh) {
  //   // eslint-disable-next-line no-unused-vars

  //   // facility USTA Number
  //   const fieldFacilityUSTANumber = divh.querySelector(
  //     '#text-facility-usta-number',
  //   );
  //   fieldFacilityUSTANumber.value = Number(facility.ustaFacilityId);
  //   // externalFacilityId
  //   const fieldExternalFacilityId = divh.querySelector(
  //     '#text-zendesk-internal-id',
  //   );
  //   fieldExternalFacilityId.value = facility.externalFacilityId;
  //   // Name
  //   const facilityName = divh.querySelector('#text-name');
  //   facilityName.value = facility.name;
  //   // Address
  //   const fieldAddress = divh.querySelector('#text-adddress');
  //   fieldAddress.value = facility.address.streetAddressLine1;
  //   // City
  //   const fieldCity = divh.querySelector('#text-city');
  //   fieldCity.value = facility.address.city;
  //   // Country
  //   const fieldCountry = divh.querySelector('#text-country');
  //   fieldCountry.value = facility.address.country;
  //   // State
  //   const fieldState = divh.querySelector('#text-state');
  //   fieldState.value = facility.address.state;
  //   // Zip
  //   const fieldZip = divh.querySelector('#text-zip');
  //   fieldZip.value = facility.address.zip;
  //   // FacilityType
  //   const fieldFacilityType = divh.querySelector('#select-facilitytype');
  //   fieldFacilityType.value = facility.facilityType;
  //   // FacilityTypeDetail
  //   const fieldFacilityTypeDetail = divh.querySelector(
  //     '#select-facilitytype-detail',
  //   );
  //   fieldFacilityTypeDetail.value = facility.facilityTypeDetail;
  //   // Private?
  //   const fieldIsPrivateYes = divh.querySelector('#radio-isprivate-yes');
  //   const fieldIsPrivateNo = divh.querySelector('#radio-isprivate-no');
  //   fieldIsPrivateYes.checked = facility.isPrivateFlag;
  //   fieldIsPrivateNo.checked = !facility.isPrivateFlag;
  //   // FacilityStatus
  //   const fieldFacilityStatus = divh.querySelector('#select-facility-status');
  //   fieldFacilityStatus.value = facility.facilityStatus;
  //   // Total indoor tennis courts
  //   const fieldTotalIndoorTennisCourts = divh.querySelector(
  //     '#text-total-indoor-tennis-courts',
  //   );
  //   fieldTotalIndoorTennisCourts.value =
  //     facility.courts.totalIndoorTennisCourts;
  //   // Total outdoor tennis courts
  //   const fieldTotalOutdoorTennisCourts = divh.querySelector(
  //     '#text-total-outdoor-tennis-courts',
  //   );
  //   fieldTotalOutdoorTennisCourts.value =
  //     facility.courts.totalOutdoorTennisCourts;
  // }

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

  // function formToObject(divh) {
  //   const object = {};
  //   const formElement = divh.querySelector('.rendered-form');
  //   const formData = new FormData(formElement);
  //   // eslint-disable-next-line no-return-assign
  //   formData.forEach((value, key) => (object[key] = value));
  //   return object;
  // }

  // function validateForm(divh) {
  //   // Get form elements
  //   const fieldFacilityUSTANumber = divh.querySelector('#text-zip');
  //   fieldFacilityUSTANumber.addEventListener('blur', ev => {
  //     // eslint-disable-next-line prettier/prettier
  //     console.log(ev.target.value);
  //   });

  //   const btnCancel = divh.querySelector('#btn-cancel');
  //   btnCancel.addEventListener('click', ev => {
  //     ev.preventDefault();
  //     window.location.href = '/facility-search';
  //   });

  //   const btnSubmit = divh.querySelector('#btn-next');
  //   btnSubmit.addEventListener('click', async ev => {
  //     // eslint-disable-next-line prettier/prettier
  //     console.log('SUBMIT');
  //     ev.preventDefault();
  //     const ob = formToObject(divheader);
  //     ob.ustaFacilityId = Number(ob.ustaFacilityId);
  //     const addr = {
  //       streetAddressLine1: ob['address.streetAddressLine1'],
  //       city: ob['address.city'],
  //       state: ob['address.state'],
  //       zip: ob['address.zip'],
  //       country: ob['address.country'],
  //     };
  //     const courts = {
  //       totalIndoorTennisCourts: Number(ob['courts.totalIndoorTennisCourts']),
  //       totalOutdoorTennisCourts: Number(ob['courts.totalOutdoorTennisCourts']),
  //     };
  //     ob.isPrivateFlag = ob.isPrivate === 'Yes';
  //     delete ob['address.streetAddressLine1'];
  //     delete ob['address.city'];
  //     delete ob['address.state'];
  //     delete ob['address.zip'];
  //     delete ob['address.country'];

  //     delete ob['courts.totalIndoorTennisCourts'];
  //     delete ob['courts.totalOutdoorTennisCourts'];
  //     delete ob.isPrivate;
  //     facility.address = { ...facility.address, ...addr };
  //     facility.courts = { ...facility.courts, ...courts };
  //     const updatedfacility = { ...facility, ...ob };
  //     //   const date = new Date();
  //     //   updatedfacility.lastUpdatedDateTime = date.toISOString().slice(0, 19);
  //     delete updatedfacility.address.district_id;
  //     delete updatedfacility.address.section_id;
  //     delete updatedfacility.address.latitude;
  //     delete updatedfacility.address.longitude;
  //     delete updatedfacility.lastUpdatedDateTime;
  //     delete updatedfacility.createdDateTime;
  //     updatedfacility.lastUpdatedBy = userNameCpitalized;
  //     updatedfacility.sourceData = 'tennismaps';
  //     console.log(addr);
  //     console.log(facility);
  //     console.log(ob);
  //     console.log(updatedfacility);
  //     const response = await createOrUpdateFacility(updatedfacility);
  //     console.log(response);
  //   });
  //   return false; // Form is valid
  // }

  // validateForm(divheader);

  block.append(divheader);
}
