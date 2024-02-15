import { getObject } from '../../scripts/s3script.js';

class ScoreBtnCellRenderer {
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

  async btnClickedHandler(event, arg) {
    if (arg === 'view') {
      window.open(this.params.data.viewLink, '_blank');
    } else {
      // window.location.assign(this.params.data.downloadLink);
      event.preventDefault();
      const data = await getObject(this.params.data);
      // const result = await Storage.get(fileKey, { bucket: props.bucket, level: appConfig.buckets.accessLevel });
      // s3upload-ui-bucket-stage
      // Create a Blob from the data received
      const blob = new Blob([data.Body], { type: data.ContentType });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = this.params.data.Key.split('/').pop(); // Specify the filename
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return false;
    }

    // this.params.clicked(this.params.value);
  }

  destroy() {
    this.eGui.removeEventListener('click', this.btnClickedHandler);
  }
}
export default ScoreBtnCellRenderer;
