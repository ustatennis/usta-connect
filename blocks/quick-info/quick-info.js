export default function decorate(block) {
  const div = document.createElement('div');
  div.className = 'quick-info-widget';
  div.innerHTML = `
  
  `;

  block.append(div);
}
