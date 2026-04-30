export default class titleAndDescriptionRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `<div class="cellicon">
        <div class="cellheader">${
          params.data?.Title || params.data?.Name
        }</div><div class="marketing-trigger-number">${params.data.Name || ''}</div>
        <div class="cellsubheader">${params.data.Description || ''}</div>
        </div>`;
  }

  getGui() {
    return this.eGui;
  }
}
