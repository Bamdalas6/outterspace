(function() {
  'use strict';

  // Prevent duplicate initialization
  if (window.__outterspaceMusicLoaded) return;
  window.__outterspaceMusicLoaded = true;

  var PLAYLIST = [
    { title: 'RUNWAY AMBIENT', src: '/audio/ambient-runway.mp3' },
    { title: 'COWBOY SERIES', src: '/audio/cowboy-ambient.mp3' }
  ];

  var STORAGE_KEY_STATE = 'outterspace_music_state';
  var STORAGE_KEY_TRACK = 'outterspace_music_track';
  var STORAGE_KEY_POS = 'outterspace_music_pos';

  var currentIdx = parseInt(sessionStorage.getItem(STORAGE_KEY_TRACK) || '0', 10);
  if (isNaN(currentIdx) || currentIdx >= PLAYLIST.length || currentIdx < 0) currentIdx = 0;

  var audio = new Audio();
  audio.preload = 'auto';
  audio.volume = 0.35;
  audio.loop = true;

  function loadTrack(idx) {
    currentIdx = idx;
    sessionStorage.setItem(STORAGE_KEY_TRACK, String(currentIdx));
    audio.src = PLAYLIST[currentIdx].src;
  }

  loadTrack(currentIdx);

  // Restore playback position if available in this session
  var savedPos = parseFloat(sessionStorage.getItem(STORAGE_KEY_POS) || '0');
  if (!isNaN(savedPos) && savedPos > 0) {
    audio.currentTime = savedPos;
  }

  // Periodic position save
  setInterval(function() {
    if (!audio.paused && audio.currentTime > 0) {
      sessionStorage.setItem(STORAGE_KEY_POS, String(audio.currentTime));
    }
  }, 1000);

  window.addEventListener('beforeunload', function() {
    if (!audio.paused && audio.currentTime > 0) {
      sessionStorage.setItem(STORAGE_KEY_POS, String(audio.currentTime));
    }
  });

  // Build UI widget
  function createWidget() {
    if (document.querySelector('.outterspace-player')) return;

    if (!document.querySelector('link[href*="outterspace-music.css"]')) {
      var cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = '/css/outterspace-music.css';
      document.head.appendChild(cssLink);
    }

    var widget = document.createElement('div');
    widget.className = 'outterspace-player';
    widget.setAttribute('role', 'button');
    widget.setAttribute('aria-label', 'Toggle background sound');
    widget.setAttribute('title', 'Click to play/pause background music');

    widget.innerHTML = [
      '<div class="outterspace-eq" aria-hidden="true">',
      '  <span class="outterspace-eq-bar"></span>',
      '  <span class="outterspace-eq-bar"></span>',
      '  <span class="outterspace-eq-bar"></span>',
      '  <span class="outterspace-eq-bar"></span>',
      '</div>',
      '<div class="outterspace-player-text">',
      '  <span class="outterspace-player-status">SOUND: OFF</span>',
      '  <span class="outterspace-player-track">' + PLAYLIST[currentIdx].title + '</span>',
      '</div>',
      '<button type="button" class="outterspace-player-next" title="Next track" aria-label="Next track">',
      '  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',
      '</button>'
    ].join('');

    document.body.appendChild(widget);

    var statusEl = widget.querySelector('.outterspace-player-status');
    var trackEl = widget.querySelector('.outterspace-player-track');
    var nextBtn = widget.querySelector('.outterspace-player-next');

    function updateUI(isPlaying) {
      widget.classList.toggle('is-playing', isPlaying);
      if (statusEl) statusEl.textContent = isPlaying ? 'SOUND: ON' : 'SOUND: OFF';
      if (trackEl) trackEl.textContent = PLAYLIST[currentIdx].title;
    }

    function playAudio() {
      audio.play().then(function() {
        localStorage.setItem(STORAGE_KEY_STATE, 'on');
        updateUI(true);
      }).catch(function(err) {
        console.log('[Outterspace Music] Autoplay blocked, waiting for user click:', err);
        updateUI(false);
      });
    }

    function pauseAudio() {
      audio.pause();
      localStorage.setItem(STORAGE_KEY_STATE, 'off');
      updateUI(false);
    }

    function toggleAudio(e) {
      if (e.target && e.target.closest('.outterspace-player-next')) return;
      if (audio.paused) {
        playAudio();
      } else {
        pauseAudio();
      }
    }

    function nextTrack(e) {
      e.stopPropagation();
      var nextIdx = (currentIdx + 1) % PLAYLIST.length;
      var wasPlaying = !audio.paused;
      loadTrack(nextIdx);
      sessionStorage.setItem(STORAGE_KEY_POS, '0');
      audio.currentTime = 0;
      if (trackEl) trackEl.textContent = PLAYLIST[currentIdx].title;
      if (wasPlaying) {
        playAudio();
      }
    }

    widget.addEventListener('click', toggleAudio);
    nextBtn.addEventListener('click', nextTrack);

    // If user previously turned music on, attempt to resume
    var userPref = localStorage.getItem(STORAGE_KEY_STATE);
    if (userPref === 'on') {
      // Browser may allow if user has engaged with this domain
      playAudio();
      // Also attach a one-time document click listener in case browser blocks unprompted autoplay
      var handleFirstInteraction = function() {
        if (localStorage.getItem(STORAGE_KEY_STATE) === 'on' && audio.paused) {
          playAudio();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
      document.addEventListener('click', handleFirstInteraction, { passive: true });
      document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    } else {
      updateUI(false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
