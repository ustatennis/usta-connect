export default function decorate(block) {
  const videoUrl = block.innerText.split('\n')[2].trim();
  const downloadUrl = block.innerText.split('\n')[5].trim();
  const div = document.createElement('div');
  new URL(videoUrl).pathname.split('/').pop();
  div.innerHTML = `
    <div class="player">
    <video class="player__video viewer">
    <source class="mp4_src" type="video/mp4">
    </video>
    <div class="player__controls player__controls--visible">
     <div class="progress">
      <div class="progress__filled"></div>
     </div>
     <div class="player__controls-holder">
      <button class="player__button togglePlayback" title="Toggle Play">
      ►
      </button>
      <input type="range" name="volume" class="player__slider playerVolume" min="0" max="1" step="0.05" value="1">
     </div>
     <div class="player__controls-holder">
      <select name="playbackRate" class="player__select playerSpeed">
          <option value="0.5">0.5</option>
          <option value="0.75">0.75</option>
          <option value="1" selected>Normal</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
      </select>
      <button class="player__button toggleFullscreen" title="Toggle Play">⛶</button>
     </div>
    </div>

    `;
  block.textContent = '';
  const videotag = div.getElementsByClassName('mp4_src');
  videotag[0].src = videoUrl;

  const divheader = document.createElement('div');
  divheader.innerHTML = `<div class='video-header'>
  <div class='video-header-left'>FEATURED VIDEO</div>
  <div class='video-header-center'>&nbsp;</div>
  <a href='${downloadUrl}' download='video.mp4' class='video-header-right button primary'>DOWNLOAD VIDEO</a>
  </div>`;

  block.append(divheader, div);

  /* Get Elements */
  const player = document.querySelector('.player');
  const video = player.querySelector('.viewer');

  const controls = player.querySelector('.player__controls');
  const progress = player.querySelector('.progress');
  const progressBar = player.querySelector('.progress__filled');
  const toggleButton = player.querySelector('.togglePlayback');
  const volume = player.querySelector('.playerVolume');
  const speed = player.querySelector('.playerSpeed');
  const fullscreen = player.querySelector('.toggleFullscreen');

  setTimeout(() => {
    video.load();
  }, 1000);

  /* Functions */

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play();
      toggleButton.innerHTML = '❚❚';
    } else {
      video.pause();
      toggleButton.innerHTML = '►';
    }
  }

  function handleRangeUpdate() {
    video[this.name] = this.value;
  }

  function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
  }

  function handleSeek(e) {
    const seekTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = seekTime;
  }

  // Create fullscreen video button
  function toggleFullscreen() {
    if (!document.webkitFullscreenElement) {
      if (video.requestFullScreen) {
        player.requestFullScreen();
      } else if (video.webkitRequestFullScreen) {
        player.webkitRequestFullScreen();
      } else if (video.mozRequestFullScreen) {
        player.mozRequestFullScreen();
      }
    } else {
      document.webkitExitFullscreen();
    }
  }

  let countrolsHideTimeout;
  function toggleControls() {
    if (!video.paused) {
      clearTimeout(countrolsHideTimeout);
      controls.classList.add('player__controls--visible');
      countrolsHideTimeout = setTimeout(() => {
        controls.classList.remove('player__controls--visible');
      }, 3000);
    }
  }

  /* Hook up the event listeners */

  video.addEventListener('click', togglePlay);
  video.addEventListener('timeupdate', handleProgress);

  toggleButton.addEventListener('click', togglePlay);
  volume.addEventListener('change', handleRangeUpdate);
  volume.addEventListener('mousemove', handleRangeUpdate);
  speed.addEventListener('change', handleRangeUpdate);

  let mousedown = false;
  progress.addEventListener('click', handleSeek);
  progress.addEventListener('mousemove', e => mousedown && handleSeek(e));
  progress.addEventListener('mousedown', () => {
    mousedown = true;
  });
  progress.addEventListener('mouseup', () => {
    mousedown = false;
  });

  fullscreen.addEventListener('click', toggleFullscreen);
  video.addEventListener('dblclick', toggleFullscreen);

  video.addEventListener('mousemove', toggleControls);
  controls.addEventListener('mouseover', () => {
    clearTimeout(countrolsHideTimeout);
  });
}
