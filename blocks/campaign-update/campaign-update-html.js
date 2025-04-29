export const htmlForm = `
<div id="spinner" style="display: none;">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>

<div id="enableModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-header">Enable campaign</div>
    <div class="modal-body">
      This will launch the campaign $$CampaignName$$ to Scheduled status. 
Are you sure of the action? 

</div>

    <form id="modal-form">
      <button type="button" id="submitBtn">YES</button>
      <button type="button" id="cancelBtn">NO</button>
    </form>
    </div>
  </div>
</div>

<div id="disableModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-header">Disable campaign</div>
    <div class="modal-body">
      This will launch the campaign $$CampaignName$$ to Paused status. 
Are you sure of the action? 

</div>

    <form id="modal-form">
      <button type="button" id="submitBtn">YES</button>
      <button type="button" id="cancelBtn">NO</button>
    </form>
    </div>
  </div>
</div>


<form method="POST" class="rendered-form">
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>Campaign Name</label>
          <input name="name" type="text" class="form-control" id="campaign-name">
        </div>
        <div class="form-group">
          <label>Tags To identify the Campaign (multiple tags should be comma separated)</label>
          <textarea name="tagstring" id="campaign-tags" type="textarea" class="form-control"></textarea>
        </div>
        <div class="columns">
        <div class="column orm-group" style="">
            <label>Start:</label>
            <input name="startdate" type="date" class="form-control" id="campaign-startdate">
          </div>
        <div class="column form-group" style="">
          <label>End:</label>
          <input name="enddate" type="date" class="form-control" id="campaign-enddate">
        </div>
        </div>
        <div class="columns">
        <div class="column form-group" style="">
          <label>S3 Pull Time (HH:MM):</label>
          <input name="pulltime" class="form-control" id="campaign-pulltime">
        </div>
        <div class="column form-group" style="">
          <label>Adobe Send Time (HH:MM):</label>
          <input name="sendtime" class="form-control" id="campaign-sendtime">
        </div>
        </div>
        <div class="form-group" style="">
          <label contenteditable="true" spellcheckker="false">Add a short description of the campaign:</label>
          <textarea name="description" id="campaign-description" class="form-control"></textarea>
        </div>
        <div class="formbuttons">
            <button type="submit" class="formbutton btn btn-secondary btn-cancel" id="btn-cancel">CANCEL</button>
            <button type="submit" class="formbutton btn btn-primary btn-draft" id="btn-save-draft">DISABLE</button>
            <button type="submit" class="formbutton btn btn-primary btn-enable" id="btn-enable">ENABLE CAMPAIGN</button>
        </div>

      </div>
    </div>
  </div>
</form>
`;
