export default class timeAndStatusRenderer {
  init(params) {
    function convertIsoToDateAmPm(isoString) {
      const date = new Date(isoString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours %= 12;
      hours = hours || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${month}/${day}/${year}, ${hours}:${formattedMinutes} ${ampm}`;
    }
    this.eGui = document.createElement('div');
    this.eGui.className = 'rightblock';
    this.eGui.innerHTML = `<div class="statusandtime">
          <div class="cellstatus">DELIVERY TIME ${params.data.DeliveryTime} 
          ${
            params.data.Status === 'RUNNING'
              ? '<span class="campaignrunning">&#x25CF; Running</span>'
              : ''
          }${
      params.data.Status === 'ACTIVE'
        ? '<span class="campaignactive">&#x25CF; Active</span>'
        : ''
    }${
      params.data.Status === 'SCHEDULED'
        ? '<span class="campaignscheduled">&#x25CF; Scheduled</span>'
        : ''
    }${
      params.data.Status === 'PAUSED'
        ? '<span class="campaignpaused">&#x25CF; Paused</span>'
        : ''
    }${
      params.data.Status === 'INACTIVE'
        ? '<span class="campaigninactive">&#x25CF; Inactive</span>'
        : ''
    }${
      params.data.EnabledStatus === 'Enabled'
        ? '<span class="campaignenabled">&#x25CF; Enabled</span>'
        : '<span class="campaigndisabled">&#x25CF; Disabled</span>'
    }</div>
          <div class="celllastrun">LAST RUN: ${
            convertIsoToDateAmPm(params.data.LastRun) || ''
          }${
      params.data.overlaps
        ? '<span class="campaignoverlaps">&#x25CF; OVERLAPS</span>'
        : ''
    }</div>
          </div>`;
  }

  getGui() {
    return this.eGui;
  }
}
