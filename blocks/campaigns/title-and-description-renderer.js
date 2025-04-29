export default class titleAndDescriptionRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `<div class="cellicon">
        <div class="cellheader">${
          params.data?.Title || params.data?.Name
        }</div><div class="cellsubheader">${params.data.Description || ''}</div>
        <div class="cellbuttons"><button class="cellbutton" type="button">Edit Campaign</button></div>
        </div>`;
  }

  getGui() {
    return this.eGui;
  }
}
