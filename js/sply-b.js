/**
 * OUTTERSPACE "SECTION B" - EDITORIAL MIX-AND-MATCH & PARALLAX RUNWAY ENGINE
 * Timed to exactly 60 seconds (1 minute) with seamless looping.
 */
(function () {
  'use strict';

  var PRODUCTS = [
    {
      index: 1,
      title: "Rangers - White",
      price: "?286,000 / $220",
      handle: "rangers-white",
      topImg: "/cowboy seriess/bview/top-01-rangers-white.jpg",
      botImg: "/cowboy seriess/bview/bot-01-rangers-white.jpg",
      parImg: "/cowboy seriess/bview/par-01-rangers-white.jpg"
    },
    {
      index: 2,
      title: "Frontier",
      price: "?325,000 / $250",
      handle: "frontier",
      topImg: "/cowboy seriess/bview/top-02-frontier.jpg",
      botImg: "/cowboy seriess/bview/bot-02-frontier.jpg",
      parImg: "/cowboy seriess/bview/par-02-frontier.jpg"
    },
    {
      index: 3,
      title: "Lago di Como",
      price: "?279,500 / $215",
      handle: "lago-di-como",
      topImg: "/cowboy seriess/bview/top-03-lago-di-como.jpg",
      botImg: "/cowboy seriess/bview/bot-03-lago-di-como.jpg",
      parImg: "/cowboy seriess/bview/par-03-lago-di-como.jpg"
    },
    {
      index: 4,
      title: "Cowboy Patch",
      price: "?305,500 / $235",
      handle: "cowboy-patch",
      topImg: "/cowboy seriess/bview/top-04-cowboy-patch.jpg",
      botImg: "/cowboy seriess/bview/bot-04-cowboy-patch.jpg",
      parImg: "/cowboy seriess/bview/par-04-cowboy-patch.jpg"
    },
    {
      index: 5,
      title: "Outterspace Symbol Shirt",
      price: "?292,500 / $225",
      handle: "outterspace-symbol-shirt",
      topImg: "/cowboy seriess/bview/top-05-outterspace-symbol-shirt.jpg",
      botImg: "/cowboy seriess/bview/bot-05-outterspace-symbol-shirt.jpg",
      parImg: "/cowboy seriess/bview/par-05-outterspace-symbol-shirt.jpg"
    },
    {
      index: 6,
      title: "Pearl Reglan",
      price: "?286,000 / $220",
      handle: "pearl-reglan",
      topImg: "/cowboy seriess/bview/top-06-pearl-reglan.jpg",
      botImg: "/cowboy seriess/bview/bot-06-pearl-reglan.jpg",
      parImg: "/cowboy seriess/bview/par-06-pearl-reglan.jpg"
    },
    {
      index: 7,
      title: "Rangers - Black",
      price: "?299,000 / $230",
      handle: "rangers",
      topImg: "/cowboy seriess/bview/top-07-rangers.jpg",
      botImg: "/cowboy seriess/bview/bot-07-rangers.jpg",
      parImg: "/cowboy seriess/bview/par-07-rangers.jpg"
    },
    {
      index: 8,
      title: "Noctra Flare Pant",
      price: "?448,500 / $345",
      handle: "nocta-flare-pant",
      topImg: "/cowboy seriess/bview/top-08-nocta-flare-pant.jpg",
      botImg: "/cowboy seriess/bview/bot-08-nocta-flare-pant.jpg",
      parImg: "/cowboy seriess/bview/par-08-nocta-flare-pant.jpg"
    },
    {
      index: 9,
      title: "Equis Rodeo Shirt",
      price: "?377,000 / $290",
      handle: "equis-rodeo",
      topImg: "/cowboy seriess/bview/top-09-equis-rodeo.jpg",
      botImg: "/cowboy seriess/bview/bot-09-equis-rodeo.jpg",
      parImg: "/cowboy seriess/bview/par-09-equis-rodeo.jpg"
    },
    {
      index: 10,
      title: "Admiral",
      price: "?338,000 / $260",
      handle: "admiral",
      topImg: "/cowboy seriess/bview/top-10-admiral.jpg",
      botImg: "/cowboy seriess/bview/bot-10-admiral.jpg",
      parImg: "/cowboy seriess/bview/par-10-admiral.jpg"
    },
    {
      index: 11,
      title: "Outfield Mirage",
      price: "?338,000 / $260",
      handle: "outfield-mirage",
      topImg: "/cowboy seriess/bview/top-11-outfield-mirage.jpg",
      botImg: "/cowboy seriess/bview/bot-11-outfield-mirage.jpg",
      parImg: "/cowboy seriess/bview/par-11-outfield-mirage.jpg"
    },
    {
      index: 12,
      title: "The Entourage Pants",
      price: "?383,500 / $295",
      handle: "the-entourage",
      topImg: "/cowboy seriess/bview/top-12-the-entourage.jpg",
      botImg: "/cowboy seriess/bview/bot-12-the-entourage.jpg",
      parImg: "/cowboy seriess/bview/par-12-the-entourage.jpg"
    },
    {
      index: 13,
      title: "Starwave Cap",
      price: "?130,000 / $100",
      handle: "starwave-hat",
      topImg: "/cowboy seriess/bview/top-13-starwave-hat.jpg",
      botImg: "/cowboy seriess/bview/bot-13-starwave-hat.jpg",
      parImg: "/cowboy seriess/bview/par-13-starwave-hat.jpg"
    },
    {
      index: 14,
      title: "Black Embellish Cowboy Shirt",
      price: "?383,500 / $295",
      handle: "black-embellish-cowboy-shirt",
      topImg: "/cowboy seriess/bview/top-14-black-embellish-cowboy-shirt.jpg",
      botImg: "/cowboy seriess/bview/bot-14-black-embellish-cowboy-shirt.jpg",
      parImg: "/cowboy seriess/bview/par-14-black-embellish-cowboy-shirt.jpg"
    },
    {
      index: 15,
      title: "Western Romance Shirt",
      price: "?325,000 / $250",
      handle: "western-romance",
      topImg: "/cowboy seriess/bview/top-15-western-romance.jpg",
      botImg: "/cowboy seriess/bview/bot-15-western-romance.jpg",
      parImg: "/cowboy seriess/bview/par-15-western-romance.jpg"
    }
  ];

  // Preload all assets
  PRODUCTS.forEach(function (p) {
    new Image().src = p.topImg;
    new Image().src = p.botImg;
    new Image().src = p.parImg;
  });

  var TOTAL_DURATION_MS = 60000; // Exactly 60 seconds (1 minute)
  var PARADE_START_MS = 38000;  // Parallax phase starts at 38s
  var OUTRO_START_MS = 54000;   // Outro phase starts at 54s

  // Keyframe schedule for the Split Mix-and-Match phase (0s to 38s)
  var SCHEDULE = [
    { time: 0,     top: 0,  bot: 0  },
    { time: 3500,  top: 3,  bot: 0  }, // Cowboy Patch top
    { time: 7000,  top: 3,  bot: 11 }, // The Entourage bottom
    { time: 10500, top: 1,  bot: 11 }, // Frontier top
    { time: 14000, top: 1,  bot: 7  }, // Nocta flare bottom
    { time: 17500, top: 8,  bot: 7  }, // Equis rodeo top
    { time: 21000, top: 8,  bot: 6  }, // Rangers black bottom
    { time: 24500, top: 13, bot: 6  }, // Black embellish top
    { time: 28000, top: 13, bot: 2  }, // Lago di Como bottom
    { time: 31500, top: 14, bot: 2  }, // Western romance top
    { time: 35000, top: 14, bot: 10 }  // Outfield mirage bottom
  ];

  function initSectionB() {
    var root = document.querySelector('[data-sply-b]');
    if (!root) return;

    var topTrack = root.querySelector('[data-b-top-track]');
    var botTrack = root.querySelector('[data-b-bot-track]');
    var dividerEl = root.querySelector('[data-b-divider]');
    var paradeEl = root.querySelector('[data-b-parade]');
    var planeBack = root.querySelector('[data-b-plane-back]');
    var planeMid = root.querySelector('[data-b-plane-mid]');
    var planeFront = root.querySelector('[data-b-plane-front]');
    var outroEl = root.querySelector('[data-b-outro]');
    var scrubberFill = root.querySelector('[data-b-scrub-fill]');
    var scrubberTrack = root.querySelector('[data-b-scrub-track]');
    var timeEl = root.querySelector('[data-b-time]');
    var playBtn = root.querySelector('[data-b-play]');
    var phasePill = root.querySelector('[data-b-phase]');
    var remixBtn = root.querySelector('[data-b-remix]');
    var soundBtn = root.querySelector('[data-b-sound]');

    // HUD Elements
    var topTitle = root.querySelector('[data-b-top-title]');
    var topPrice = root.querySelector('[data-b-top-price]');
    var topLink = root.querySelector('[data-b-top-link]');
    var botTitle = root.querySelector('[data-b-bot-title]');
    var botPrice = root.querySelector('[data-b-bot-price]');
    var botLink = root.querySelector('[data-b-bot-link]');

    var currentTopIdx = 0;
    var currentBotIdx = 0;
    var elapsedMs = 0;
    var isPlaying = true;
    var lastTick = Date.now();
    var rafId = null;

    // Build slides for top and bottom reels
    function buildReels() {
      topTrack.innerHTML = '';
      botTrack.innerHTML = '';

      PRODUCTS.forEach(function (p, i) {
        var topSlide = document.createElement('div');
        topSlide.className = 'sply-b__slide ' + (i === 0 ? 'is-current' : 'is-next');
        topSlide.setAttribute('data-index', i);
        topSlide.innerHTML = '<img class="sply-b__slide-img" src="' + p.topImg + '" alt="' + p.title + '">';
        topTrack.appendChild(topSlide);

        var botSlide = document.createElement('div');
        botSlide.className = 'sply-b__slide ' + (i === 0 ? 'is-current' : 'is-next');
        botSlide.setAttribute('data-index', i);
        botSlide.innerHTML = '<img class="sply-b__slide-img" src="' + p.botImg + '" alt="' + p.title + '">';
        botTrack.appendChild(botSlide);
      });
    }

    // Build parallax planes
    function buildParallaxPlanes() {
      // Back plane: 6 items
      var backItems = [0, 2, 4, 6, 8, 10];
      planeBack.innerHTML = '';
      backItems.forEach(function (idx) {
        var p = PRODUCTS[idx];
        var item = document.createElement('div');
        item.className = 'sply-b__plane-item';
        item.innerHTML = '<img class="sply-b__plane-img" src="' + p.parImg + '" alt="' + p.title + '">';
        planeBack.appendChild(item);
      });

      // Mid plane: 6 items
      var midItems = [1, 3, 5, 7, 9, 11];
      planeMid.innerHTML = '';
      midItems.forEach(function (idx) {
        var p = PRODUCTS[idx];
        var item = document.createElement('div');
        item.className = 'sply-b__plane-item';
        item.innerHTML = '<img class="sply-b__plane-img" src="' + p.parImg + '" alt="' + p.title + '">';
        planeMid.appendChild(item);
      });

      // Front plane: 4 items (larger close-up crops)
      var frontItems = [13, 14, 0, 3];
      planeFront.innerHTML = '';
      frontItems.forEach(function (idx) {
        var p = PRODUCTS[idx];
        var item = document.createElement('div');
        item.className = 'sply-b__plane-item';
        item.innerHTML = '<img class="sply-b__plane-img" src="' + p.topImg + '" alt="' + p.title + '">';
        planeFront.appendChild(item);
      });
    }

    function slideTo(reelType, targetIdx) {
      var track = reelType === 'top' ? topTrack : botTrack;
      var slides = track.querySelectorAll('.sply-b__slide');
      var oldIdx = reelType === 'top' ? currentTopIdx : currentBotIdx;

      if (targetIdx === oldIdx) return;

      slides.forEach(function (slide, i) {
        slide.classList.remove('is-prev', 'is-current', 'is-next');
        if (i === targetIdx) {
          slide.classList.add('is-current');
        } else if (i === oldIdx) {
          slide.classList.add('is-prev');
        } else {
          slide.classList.add('is-next');
        }
      });

      if (reelType === 'top') {
        currentTopIdx = targetIdx;
        updateTopHUD(PRODUCTS[currentTopIdx]);
      } else {
        currentBotIdx = targetIdx;
        updateBotHUD(PRODUCTS[currentBotIdx]);
      }
    }

    function updateTopHUD(p) {
      if (topTitle) {
        topTitle.textContent = p.title;
        topTitle.href = '/products/' + p.handle;
      }
      if (topPrice) topPrice.textContent = p.price;
      if (topLink) topLink.href = '/products/' + p.handle;
    }

    function updateBotHUD(p) {
      if (botTitle) {
        botTitle.textContent = p.title;
        botTitle.href = '/products/' + p.handle;
      }
      if (botPrice) botPrice.textContent = p.price;
      if (botLink) botLink.href = '/products/' + p.handle;
    }

    function formatTime(ms) {
      var sec = Math.floor(ms / 1000);
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function applyTime(t) {
      elapsedMs = Math.max(0, Math.min(TOTAL_DURATION_MS, t));
      var pct = (elapsedMs / TOTAL_DURATION_MS) * 100;
      if (scrubberFill) scrubberFill.style.width = pct + '%';
      if (timeEl) timeEl.textContent = formatTime(elapsedMs) + ' / 1:00';

      // Stage State Routing:
      if (elapsedMs < PARADE_START_MS) {
        // Phase 1: Split Screen Mix & Match
        dividerEl.classList.remove('is-hidden');
        paradeEl.classList.remove('is-active');
        outroEl.classList.remove('is-active');
        if (phasePill) phasePill.textContent = 'MIX & MATCH';

        // Check active schedule step
        var currentStep = SCHEDULE[0];
        for (var i = 0; i < SCHEDULE.length; i++) {
          if (elapsedMs >= SCHEDULE[i].time) {
            currentStep = SCHEDULE[i];
          } else {
            break;
          }
        }
        if (currentTopIdx !== currentStep.top) slideTo('top', currentStep.top);
        if (currentBotIdx !== currentStep.bot) slideTo('bot', currentStep.bot);

      } else if (elapsedMs < OUTRO_START_MS) {
        // Phase 2: Parallax Runway Parade
        dividerEl.classList.add('is-hidden');
        paradeEl.classList.add('is-active');
        outroEl.classList.remove('is-active');
        if (phasePill) phasePill.textContent = 'RUNWAY PARADE';

        var paradeProgress = (elapsedMs - PARADE_START_MS) / (OUTRO_START_MS - PARADE_START_MS);
        var backX = -paradeProgress * 48;
        var midX = -paradeProgress * 75;
        var frontX = -paradeProgress * 115;

        planeBack.style.transform = 'translateX(' + backX + '%)';
        planeMid.style.transform = 'translateX(' + midX + '%)';
        planeFront.style.transform = 'translateX(' + frontX + '%)';

      } else {
        // Phase 3: Outro
        dividerEl.classList.add('is-hidden');
        paradeEl.classList.remove('is-active');
        outroEl.classList.add('is-active');
        if (phasePill) phasePill.textContent = 'FINALE';
      }
    }

    // Animation Ticker
    function tick() {
      var now = Date.now();
      var delta = now - lastTick;
      lastTick = now;

      if (isPlaying) {
        elapsedMs += delta;
        if (elapsedMs >= TOTAL_DURATION_MS) {
          elapsedMs = 0; // Seamless continuous loop
        }
        applyTime(elapsedMs);
      }

      rafId = requestAnimationFrame(tick);
    }

    // Controls
    function setPlayState(play) {
      isPlaying = play;
      if (playBtn) {
        playBtn.innerHTML = isPlaying
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg><span>PAUSE</span>'
          : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg><span>PLAY</span>';
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        setPlayState(!isPlaying);
      });
    }

    if (remixBtn) {
      remixBtn.addEventListener('click', function () {
        // Randomize top and bottom
        var nextTop = (currentTopIdx + Math.floor(Math.random() * 5) + 1) % PRODUCTS.length;
        var nextBot = (currentBotIdx + Math.floor(Math.random() * 5) + 1) % PRODUCTS.length;
        slideTo('top', nextTop);
        slideTo('bot', nextBot);
      });
    }

    // Manual tap on Top or Bottom Reel
    var topReel = root.querySelector('.sply-b__reel--top');
    if (topReel) {
      topReel.addEventListener('click', function (e) {
        e.stopPropagation();
        var nextTop = (currentTopIdx + 1) % PRODUCTS.length;
        slideTo('top', nextTop);
      });
    }

    var botReel = root.querySelector('.sply-b__reel--bottom');
    if (botReel) {
      botReel.addEventListener('click', function (e) {
        e.stopPropagation();
        var nextBot = (currentBotIdx + 1) % PRODUCTS.length;
        slideTo('bot', nextBot);
      });
    }

    // Scrubber seeking
    if (scrubberTrack) {
      function seek(e) {
        var rect = scrubberTrack.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        applyTime(pos * TOTAL_DURATION_MS);
      }

      scrubberTrack.addEventListener('mousedown', function (e) {
        seek(e);
        function onMove(ev) { seek(ev); }
        function onUp() {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });

      scrubberTrack.addEventListener('touchstart', function (e) {
        seek(e);
      }, { passive: true });
    }

    // Sound Toggle Button
    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        var musicToggle = document.querySelector('[data-music-toggle]');
        if (musicToggle) {
          musicToggle.click();
        } else if (window.__splyMusicAudio) {
          if (window.__splyMusicAudio.paused) window.__splyMusicAudio.play();
          else window.__splyMusicAudio.pause();
        }
      });
    }

    // Keyboard support
    window.addEventListener('keydown', function (e) {
      if (e.key === ' ') {
        e.preventDefault();
        setPlayState(!isPlaying);
      } else if (e.key === 'ArrowRight') {
        applyTime(elapsedMs + 5000);
      } else if (e.key === 'ArrowLeft') {
        applyTime(elapsedMs - 5000);
      }
    });

    // Initialize DOM and start ticker
    buildReels();
    buildParallaxPlanes();
    updateTopHUD(PRODUCTS[0]);
    updateBotHUD(PRODUCTS[0]);
    applyTime(0);
    lastTick = Date.now();
    rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionB);
  } else {
    initSectionB();
  }
})();
