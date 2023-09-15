function removeChildButtons(block, childButtons) {
  block.children[0].children[3].removeChild(childButtons[0]);
  block.children[0].children[3].removeChild(childButtons[1]);
  block.children[0].children[3].removeChild(childButtons[2]);
}
function setButtons(block) {
  const buttonReg = document.createElement('button');
  const buttonLogin = document.createElement('button');

  const childButtons = [...block.children[0].children[3].childNodes];

  removeChildButtons(block, childButtons);
  buttonReg.appendChild(childButtons[0]);
  buttonLogin.appendChild(childButtons[2]);

  block.children[0].children[3].appendChild(buttonReg);
  block.children[0].children[3].appendChild(buttonLogin);
}
export default async function decorate(block) {
  block.children[0].classList.add('banner-left');
  block.children[0].children[0].className = 'banner-title';
  block.children[0].children[1].className = 'banner-info';
  block.children[0].children[2].className = 'banner-button-info';
  block.children[0].children[2].children[0].className = 'new-users';
  block.children[0].children[2].children[1].className = 'reg-users';
  block.children[0].children[3].className = 'banner-buttons';
  setButtons(block);
  block.children[0].children[4].className = 'banner-logo';
  block.children[1].className = 'banner-right';
  block.children[0].children[3].children[0].remove();
  block.children[0].children[2].children[0].remove();
}
