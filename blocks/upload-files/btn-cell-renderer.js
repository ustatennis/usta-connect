class BtnCellRenderer {
  init(params) {
    this.params = params;

    const btnDownload = document.createElement('button');
    btnDownload.innerHTML = '';
    btnDownload.id = 'btn-download';
    this.btnClickedHandler = this.btnClickedHandler.bind(this);
    btnDownload.addEventListener('click', event =>
      this.btnClickedHandler(event, 'download'),
    );

    // const btnView = document.createElement('button');
    // btnView.innerHTML = '';
    // btnView.id = 'btn-view';
    // this.btnClickedHandler = this.btnClickedHandler.bind(this);
    // btnView.addEventListener('click', event =>
    //   this.btnClickedHandler(event, 'view'),
    // );

    this.eGui = document.createElement('div');
    this.eGui.append(btnDownload);

    // this.btnClickedHandler = this.btnClickedHandler.bind(this);
    // this.eGui.addEventListener('click', event =>
    //   this.btnClickedHandler(event, 'download'),
    // );
  }

  getGui() {
    return this.eGui;
  }

  btnClickedHandler(event, arg) {
    if (arg === 'view') {
      window.open(this.params.data.viewLink, '_blank');
    } else {
      window.location.assign(this.params.data.downloadLink);
    }

    // this.params.clicked(this.params.value);
  }

  destroy() {
    this.eGui.removeEventListener('click', this.btnClickedHandler);
  }
}
export default BtnCellRenderer;
