import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach(row => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    let link;
    [...li.children].forEach(div => {
      if (div.children[0]?.hasAttribute('href')) {
        link = div.children[0].href;
      }
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        if (div.children.length === 0) div.parentNode.style.opacity = 0;
        div.className = 'cards-card-body';
      }
    });
    if (link) {
      li.addEventListener('click', () => {
        window.location.href = link;
      });
    }
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach(img =>
    img
      .closest('picture')
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]),
      ),
  );
  block.textContent = '';
  block.append(ul);
}
