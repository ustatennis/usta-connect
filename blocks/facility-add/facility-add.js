import { usstates } from '../../constants/usstates.js';

export default async function decorate(block) {
  const divheader = document.createElement('div');
  divheader.innerHTML = `
<form class="rendered-form">
    <div class="formbuilder-text form-group field-text-facility-usta-number">
        <label for="text-facility-usta-number" class="formbuilder-text-label">FACILITY USTA NUMBER<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="text-facility-usta-number" access="false" id="text-facility-usta-number" required="required" aria-required="true">
    </div>
    <div class="formbuilder-text form-group field-text-zendesk-internal-id">
        <label for="text-zendesk-internal-id" class="formbuilder-text-label">ZENDESK INTERNAL ID</label>
        <input type="text" class="form-control" name="text-zendesk-internal-id" access="false" id="text-zendesk-internal-id">
    </div>
    <div class="formbuilder-text form-group field-text-name">
        <label for="text-name" class="formbuilder-text-label">NAME</label>
        <input type="text" class="form-control" name="text-name" access="false" id="text-name">
    </div>
    <div class="formbuilder-text form-group field-text-adddress">
        <label for="text-adddress" class="formbuilder-text-label">ADDRESS<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="text-adddress" access="false" id="text-adddress" required="required" aria-required="true">
    </div>
    <div class="formbuilder-text form-group field-text-city">
        <label for="text-city" class="formbuilder-text-label">CITY<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="text-city" access="false" id="text-city" required="required" aria-required="true">
    </div>
    <div class="formbuilder-text form-group field-text-country">
        <label for="text-country" class="formbuilder-text-label">COUNTRY<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="text-country" access="false" id="text-country" required="required" aria-required="true">
    </div>
    <div class="formbuilder-select form-group field-text-state">
        <label for="text-state" class="formbuilder-select-label">STATE/PROVINCE<span class="formbuilder-required">*</span></label>
        <select class="form-control" name="text-state" access="false" id="text-state" required="required" aria-required="true"></select>
        <span class="field-error" id="state-error"></span>
    </div>
    <div class="formbuilder-text form-group field-text-zip">
        <label for="text-zip" class="formbuilder-text-label">ZIP/POSTAL CODE</label>
        <input type="text" class="form-control" name="text-zip" access="false" id="text-zip">
        <span class="field-error" id="zip-error"></span>
    </div>
    <div class="formbuilder-select form-group field-select-facilitytype">
        <label for="select-facilitytype" class="formbuilder-select-label">FACILITY TYPE</label>
        <select class="form-control" name="select-facilitytype" id="select-facilitytype">
            <option value="club" selected="true" id="select-facilitytype-0">Club</option>
            <option value="corporation" id="select-facilitytype-1">Corporation</option>
            <option value="parks-and-recreation" id="select-facilitytype-2">Parks &amp; Recreation</option>
            <option value="private-homeowner" id="select-facilitytype-3">Private Homeowner</option>
            <option value="school" id="select-facilitytype-4">School</option>
            <option value="service-facility" id="select-facilitytype-5">Service Facility</option>
        </select>
    </div>
    <div class="formbuilder-select form-group field-select-facilitytype-detail">
        <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY TYPE DETAIL</label>
        <select class="form-control" name="select-facilitytype-detail" id="select-facilitytype-detail">
            <option value="apartments-condominiums" selected="true" id="select-facilitytype-detail-0">Apartments/Condominiums</option>
            <option value="athletic-commercial-club" id="select-facilitytype-detail-1">Athletic/Commercial Club</option>
            <option value="college-university" id="select-facilitytype-detail-2">College/University</option>
            <option value="community-recreation" id="select-facilitytype-detail-3">Community/Recreation</option>
            <option value="center" id="select-facilitytype-detail-4">Center</option>
            <option value="corporation" id="select-facilitytype-detail-5">Corporation</option>
            <option value="country-club" id="select-facilitytype-detail-6">Country Club</option>
            <option value="homeowner-association" id="select-facilitytype-detail-7">Homeowner Association</option>
            <option value="hotel-resort" id="select-facilitytype-detail-8">Hotel/Resort</option>
            <option value="military-base" id="select-facilitytype-detail-9">Military Base</option>
            <option value="public-park" id="select-facilitytype-detail-10">Public Park</option>
            <option value="private-residence" id="select-facilitytype-detail-11">Private Residence</option>
            <option value="school" id="select-facilitytype-detail-12">School</option>
        </select>
    </div>
    <div class="formbuilder-radio">
        IS PRIVATE<span class="formbuilder-required">*</span>
        <div class="formbuilder-select form-group radio-isprivate">
            <input type="radio" id="html" name="fav_language" value="Yes">
            <label for="html">Yes</label><br>
            <input type="radio" id="css" name="fav_language" value="No">
            <label for="css">No</label><br>
        </div>
    </div>
    <div class="formbuilder-select form-group field-select-facility-status">
        <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY STATUS</label>
        <select class="form-control" name="select-facility-status" id="select-facility-status">
            <option value="active" selected="true" id="select-facility-status-0">Active</option>
            <option value="closed" id="select-facility-status-1">Closed</option>
            <option value="converted/pickeball" id="select-facility-status-2">Converted/PickleBall</option>
            <option value="duplicate" id="select-facility-status-3">Duplicate</option>
            <option value="nonexistent" id="select-facility-status-4">Nonexistent</option>
        </select>
    </div>
    <div class="formbuilder-text form-group field-text-total-indoor-tennis-courts">
        <label for="text-name" class="formbuilder-text-label">TOTAL INDOOR TENNIS COURTS<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="text-total-indoor-tennis-courts" access="false" id="text-total-indoor-tennis-courts">
    </div>
    <div class="formbuilder-text form-group field-text-total-outdoor-tennis-courts">
        <label for="text-adddress" class="formbuilder-text-label">TOTAL OUTDOOR TENNIS COURTS<span class="formbuilder-required">*</span></label>
        <input type="text" class="form-control" name="text-total-indoor-tennis-courts" access="false" id="text-total-outdoor-tennis-courts" required="required" aria-required="true">
    </div>
    <div class="formbuttons">
        <button class="formbutton" id="btn-cancel">CANCEL</button>
        <button class="formbutton" id="btn-next">NEXT</button>
    </div>
</form>`;

  const statebox = divheader.querySelector('#text-state');
  //   statebox.id = 'filter-state-box';
  //   statebox.placeholder = 'SEARCH BY STATE';
  //   statebox.addEventListener('input', () => {
  //     const inp = document.getElementById('filter-text-box');
  //     inp.disabled = false;
  //     // gridOptions.api.setQuickFilter(
  //     //   document.getElementById('filter-state-box').value,
  //     // );
  //   });
  //   const selectstate = document.createElement('option');
  //   selectstate.text = 'SEARCH BY STATE';
  //   selectstate.disabled = true;
  //   selectstate.selected = true;
  //   selectstate.hidden = true;
  //   statebox.appendChild(selectstate);
  usstates.data.forEach(state => {
    const option = document.createElement('option');
    option.value = state.id;
    option.text = state.value;
    statebox.appendChild(option);
  });

  function validateForm(divh) {
    // Get form elements
    const fieldFacilityUSTANumber = divh.querySelector('#text-zip');
    fieldFacilityUSTANumber.addEventListener('blur', ev => {
      // eslint-disable-next-line prettier/prettier
      console.log(ev.target.value);
    });

    const btnSubmit = divh.querySelector('#btn-next');
    btnSubmit.addEventListener('click', () => {
      // eslint-disable-next-line prettier/prettier
      console.log('SUBMIT');
    });
    return true; // Form is valid
  }
  validateForm(divheader);

  block.append(divheader);
}
