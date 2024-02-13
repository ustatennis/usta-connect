class userSystemCellRenderer {
  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.id = Math.round(Math.random()) === 1 ? 'btn-system' : 'btn-user';
  }

  getGui() {
    return this.eGui;
  }
}

export default userSystemCellRenderer;
