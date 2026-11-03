/* PawTech background music - one file for every page.
   Needs background_music.mp3 in the same folder. The song continues
   from where it stopped when you move to another page. */
(function () {
  var KEY_STATE = 'pt_music_state', KEY_TIME = 'pt_music_time';

  var audio = document.getElementById('bgm');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'bgm';
    audio.src = 'background_music.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    document.body.appendChild(audio);
  }

  var btn = document.getElementById('musicBtn');
  if (btn) {                       // take over the existing button (index/about)
    var copy = btn.cloneNode(true);
    btn.replaceWith(copy);
    btn = copy;
  } else {                         // create one (start page)
    var css = document.createElement('style');
    css.textContent =
      '.music{position:fixed;right:18px;bottom:18px;width:46px;height:46px;border-radius:50%;border:0;color:#fff;' +
      'font-size:1.2rem;cursor:pointer;z-index:50;background:linear-gradient(135deg,#ec4899,#14b8a6);' +
      'box-shadow:0 6px 20px rgba(0,0,0,.4)}.music.playing{animation:ptspin 4s linear infinite}' +
      '@keyframes ptspin{to{transform:rotate(360deg)}}';
    document.head.appendChild(css);
    btn = document.createElement('button');
    btn.id = 'musicBtn';
    btn.className = 'music';
    btn.textContent = '\u266B';
    btn.title = 'Music';
    btn.setAttribute('aria-label', 'Toggle music');
    document.body.appendChild(btn);
  }

  function ui() { btn.classList.toggle('playing', !audio.paused); }
  function save() {
    try { sessionStorage.setItem(KEY_TIME, audio.currentTime); } catch (e) {}
  }
  function play() {
    var p = audio.play();
    if (p && p.then) p.then(function () { ui(); }).catch(function () { waitForTouch(); });
  }
  function waitForTouch() {        // browsers block autoplay until the first click
    var go = function () {
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.removeEventListener(ev, go); });
      if (audio.paused && sessionStorage.getItem(KEY_STATE) !== 'off') play();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, go); });
  }

  var t = parseFloat(sessionStorage.getItem(KEY_TIME)) || 0;
  audio.addEventListener('loadedmetadata', function () {
    if (t && t < audio.duration) audio.currentTime = t;
  });
  if (audio.readyState >= 1 && t && t < audio.duration) audio.currentTime = t;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (audio.paused) { sessionStorage.setItem(KEY_STATE, 'on'); play(); }
    else { sessionStorage.setItem(KEY_STATE, 'off'); audio.pause(); ui(); }
  });

  audio.addEventListener('play', ui);
  audio.addEventListener('pause', ui);
  setInterval(save, 1000);
  window.addEventListener('pagehide', save);

  if (sessionStorage.getItem(KEY_STATE) !== 'off') play();
})();