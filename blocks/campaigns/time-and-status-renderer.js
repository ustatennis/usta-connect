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
          <div class="cellstatus">DELIVERY TIME ${
            params.data.State === 'ENABLED'
              ? '<span class="campaignrunning">&#x25CF; RUNNING</span>'
              : ''
          }${
      params.data.State === 'PAUSED'
        ? '<span class="campaignpaused">&#x25CF; Paused</span>'
        : ''
    }${
      params.data.State === 'INACTIVE'
        ? '<span class="campaigninactive">&#x25CF; Inactive</span>'
        : ''
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
