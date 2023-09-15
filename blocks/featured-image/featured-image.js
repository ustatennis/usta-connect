export default function decorate(block) {
  const downloadURL = block.getElementsByTagName('div')[2].innerText.trim();
  block.getElementsByTagName('div')[2].remove();
  const divheader = document.createElement('div');

  divheader.innerHTML = `<div class='featured-image-header'>
        <div class='featured-image-header-left'>FEATURED IMAGE</div>
        <div class='featured-image-header-denter'>&nbsp;</div>
        <a href='' download="download.png" class='featured-image-header-right button primary' id='downloadimage'>DOWNLOAD IMAGE</a>
        </div>`;
  divheader.className = 'featured-image-widget';

  block.prepend(divheader);
  const downloadButton = document.getElementById('downloadimage');
  // const img = block.querySelector(`[type="image/png"]`).srcset.split('?')[0];
  // console.log(img);
  downloadButton.href = downloadURL;

  // this.btnClickHandler.bind(this);
  // downloadButton.addEventListener('click', function clickListener() {
  //   function downloadImage(url, name) {
  //     fetch(url)
  //       .then(resp => resp.blob())
  //       .then(blob => {
  //         window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.style.display = 'none';
  //         a.href = url;
  //         // the filename you want
  //         a.download = name;
  //         document.body.appendChild(a);
  //         a.click();
  //         // window.URL.revokeObjectURL(url);
  //       })
  //       .catch((e) => alert('Error:' + e));
  //   }

  //   const img = block.querySelector(`[type="image/png"]`).srcset.split('?')[0];
  //   console.log(img);
  //   downloadImage(img, 'test2.png');
  // });
}
