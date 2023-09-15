import { adminDeleteUser } from '../../middleware/admin.js';

class DeleteBtnCellRenderer {
  init(params) {
    this.params = params;

    this.eGui = document.createElement('button');
    this.eGui.className = 'btn-delete-user';
    this.eGui.innerHTML = 'DELETE USER';

    this.btnClickedHandler = this.btnClickedHandler.bind(this);
    this.eGui.addEventListener('click', this.btnClickedHandler);
  }

  getGui() {
    return this.eGui;
  }

  async btnClickedHandler() {
    if (
      // eslint-disable-next-line no-alert, no-restricted-globals
      confirm(`Do you really want to delete ${this.params.data.name}`) === true
    ) {
      await adminDeleteUser(this.params.data.sub);
      window.location.reload();
    } else {
      console.log('delete canceled');
    }
  }

  destroy() {
    this.eGui.removeEventListener('click', this.btnClickedHandler);
  }
}

export default DeleteBtnCellRenderer;
