// function reorderAlertbar(div, alertBar) {
//   div.removeChild(div.children[1]);
//   const header = document.getElementsByTagName('header')[0];
//   header.appendChild(alertBar);
// }
// function showAlertBar(block) {
//   const url = document.location.href;
//   if (url.endsWith('/main')) {
//     block.removeChild(block.children[1]);
//   } else {
//     block.removeChild(block.children[0]);
//   }
// }

// function createButton(block) {
//   const button = document.createElement('button');
//   button.textContent = 'X';
//   block.children[0].children[0].appendChild(button);
//   button.addEventListener('click', function clickListener() {
//     block.parentNode.removeChild(block);
//     button.remove();
//     const header = document.getElementsByTagName('header')[0];
//     header.style.height = '116px';
//   });
//   button.classList.add('alert-bar-btn');
// }

// function addClasses(block) {
//   block.children[0].children[0].className = 'main-alert-bar';
//   block.children[0].className = 'alert-bar-div';
// }

// function decorateAlertbar(block) {
//   block.children[0].children[0].className = 'main-alert-bar';
//   block.children[0].className = 'alert-bar-div';

//   showAlertBar(block);
//   addClasses(block);
//   createButton(block);
// }

export default async function decorate(block) {
  // fetch nav content
  const headerPath = '/header';
  const resp = await fetch(
    `${headerPath}.plain.html`,
    window.location.pathname.endsWith('/header') ? { cache: 'reload' } : {},
  );

  if (resp.ok) {
    const html = await resp.text();

    const div = document.createElement('div');
    div.innerHTML = html;

    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'header-wrapper';
    headerWrapper.append(div);
    block.append(headerWrapper);
    // decorateAlertbar(div.children[1].children[0]);
    // reorderAlertbar(div, div.children[1].children[0]);
  }
}
