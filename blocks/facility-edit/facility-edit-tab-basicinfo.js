const htmlString = `<div class="tab-panel visible">
<div class="formbuilder-text form-group field-text-facility-usta-number">
   <label for="text-facility-usta-number" class="formbuilder-text-label">FACILITY USTA NUMBER<span class="formbuilder-required">*</span></label>
   <input type="number" class="form-control" name="ustaFacilityId" access="false" id="text-facility-usta-number" required="required" aria-required="true" disabled>
   <span class="field-error" id="facility-usta-number-error"></span>
</div>
<div class="formbuilder-text form-group field-text-zendesk-internal-id">
   <label for="text-zendesk-internal-id" class="formbuilder-text-label">ZENDESK TICKET NUMBER</label>
   <input type="text" class="form-control" name="externalFacilityId" access="false" id="text-zendesk-internal-id">
   <span class="field-error" id="zendesk-internal-id-error"></span>
</div>
<div class="formbuilder-text form-group field-text-name">
   <label for="text-name" class="formbuilder-text-label">NAME<span class="formbuilder-required">*</span></label>
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
   <label for="text-zip" class="formbuilder-text-label">ZIP/POSTAL CODE<span class="formbuilder-required">*</span></label>
   <input type="text" class="form-control" name="address.zip" access="false" id="text-zip">
   <span class="field-error" id="zip-error"></span>
</div>
<div class="formbuilder-select form-group field-select-facilitytype">
   <label for="select-facilitytype" class="formbuilder-select-label">FACILITY TYPE<span class="formbuilder-required">*</span></label>
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
   <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY TYPE DETAIL<span class="formbuilder-required">*</span></label>
   <select class="form-control" name="facilityTypeDetail" id="select-facilitytype-detail">
      <option value="Apartments/Condominiums" selected="true" id="select-facilitytype-detail-0">Apartments/Condominiums</option>
      <option value="Athletic/Commercial Club" id="select-facilitytype-detail-1">Athletic/Commercial Club</option>
      <option value="College/University" id="select-facilitytype-detail-2">College/University</option>
      <option value="Community/Recreation Center" id="select-facilitytype-detail-3">Community/Recreation Center</option>
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
   <label for="select-facilitytype-detail" class="formbuilder-select-label">FACILITY STATUS<span class="formbuilder-required">*</span></label>
   <select class="form-control" name="facilityStatus" id="select-facility-status">
      <option value="Active" selected="true" id="select-facility-status-0">Active</option>
      <option value="Closed" id="select-facility-status-1">Closed</option>
      <option value="ConvertedPickleBall" id="select-facility-status-2">Converted/PickleBall</option>
      <option value="Duplicate" id="select-facility-status-3">Duplicate</option>
      <option value="Nonexistent" id="select-facility-status-4">Nonexistent</option>
   </select>
</div>
<div class="formbuilder-text form-group field-text-survivor-facility-id hidden">
   <label for="text-zip" class="formbuilder-text-label">SURVIVOR FACILITY ID</label>
   <input type="number" class="form-control" name="survivorFacilityId" access="false" id="text-survivor-facility-id">
   <span class="field-error" id="survivor-facility-id-error"></span>
</div>
<div class="formbuttons">
   <button class="formbutton" id="btn-cancel">CANCEL</button>
   <button class="formbutton" id="btn-next">NEXT</button>
</div>`;
function showError(id, msg) {

}
const tempElement = document.createElement('div');
tempElement.innerHTML = htmlString;
tempElement.addEventListener() {
    
}
export const basicInfo = tempElement.firstChild;
