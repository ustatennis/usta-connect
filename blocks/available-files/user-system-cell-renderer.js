class userSystemCellRenderer {
  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.id =
      this.params.data.owner === 'SYSTEM' ? 'btn-system' : 'btn-user';
  }

  getGui() {
    return this.eGui;
  }
}

export default userSystemCellRenderer;
