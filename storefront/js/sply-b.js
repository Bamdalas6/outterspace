/**
 * OUTTERSPACE "SECTION B" - EDITORIAL MIX-AND-MATCH & PARALLAX RUNWAY ENGINE
 * 60-Second Master Runway Sequence with Full-Outfit Match Zoom In/Out
 * and Automatic Bottom Variant Remixing for All 15 Models.
 * Order reversed so that Rangers - White culminates as the grand finale look.
 */
(function () {
  'use strict';

  var PRODUCTS = [
    {
      index: 1,
      title: "Western Romance Shirt",
      price: "\u20A6325,000 / $250",
      handle: "western-romance",
      topImg: "/cowboy seriess/bview/top-15-western-romance.jpg",
      botImg: "/cowboy seriess/bview/bot-15-western-romance.jpg",
      parImg: "/cowboy seriess/bview/par-15-western-romance.jpg"
    },
    {
      index: 2,
      title: "Black Embellish Cowboy Shirt",
      price: "\u20A6383,500 / $295",
      handle: "black-embellish-cowboy-shirt",
      topImg: "/cowboy seriess/bview/top-14-black-embellish-cowboy-shirt.jpg",
      botImg: "/cowboy seriess/bview/bot-14-black-embellish-cowboy-shirt.jpg",
      parImg: "/cowboy seriess/bview/par-14-black-embellish-cowboy-shirt.jpg"
    },
    {
      index: 3,
      title: "Starwave Cap",
      price: "\u20A6130,000 / $100",
      handle: "starwave-hat",
      topImg: "/cowboy seriess/bview/top-13-starwave-hat.jpg",
      botImg: "/cowboy seriess/bview/bot-13-starwave-hat.jpg",
      parImg: "/cowboy seriess/bview/par-13-starwave-hat.jpg"
    },
    {
      index: 4,
      title: "The Entourage Pants",
      price: "\u20A6383,500 / $295",
      handle: "the-entourage",
      topImg: "/cowboy seriess/bview/top-12-the-entourage.jpg",
      botImg: "/cowboy seriess/bview/bot-12-the-entourage.jpg",
      parImg: "/cowboy seriess/bview/par-12-the-entourage.jpg"
    },
    {
      index: 5,
      title: "Outfield Mirage",
      price: "\u20A6338,000 / $260",
      handle: "outfield-mirage",
      topImg: "/cowboy seriess/bview/top-11-outfield-mirage.jpg",
      botImg: "/cowboy seriess/bview/bot-11-outfield-mirage.jpg",
      parImg: "/cowboy seriess/bview/par-11-outfield-mirage.jpg"
    },
    {
      index: 6,
      title: "Admiral",
      price: "\u20A6338,000 / $260",
      handle: "admiral",
      topImg: "/cowboy seriess/bview/top-10-admiral.jpg",
      botImg: "/cowboy seriess/bview/bot-10-admiral.jpg",
      parImg: "/cowboy seriess/bview/par-10-admiral.jpg"
    },
    {
      index: 7,
      title: "Equis Rodeo Shirt",
      price: "\u20A6377,000 / $290",
      handle: "equis-rodeo",
      topImg: "/cowboy seriess/bview/top-09-equis-rodeo.jpg",
      botImg: "/cowboy seriess/bview/bot-09-equis-rodeo.jpg",
      parImg: "/cowboy seriess/bview/par-09-equis-rodeo.jpg"
    },
    {
      index: 8,
      title: "Noctra Flare Pant",
      price: "\u20A6448,500 / $345",
      handle: "nocta-flare-pant",
      topImg: "/cowboy seriess/bview/top-08-nocta-flare-pant.jpg",
      botImg: "/cowboy seriess/bview/bot-08-nocta-flare-pant.jpg",
      parImg: "/cowboy seriess/bview/par-08-nocta-flare-pant.jpg"
    },
    {
      index: 9,
      title: "Rangers - Black",
      price: "\u20A6299,000 / $230",
      handle: "rangers",
      topImg: "/cowboy seriess/bview/top-07-rangers.jpg",
      botImg: "/cowboy seriess/bview/bot-07-rangers.jpg",
      parImg: "/cowboy seriess/bview/par-07-rangers.jpg"
    },
    {
      index: 10,
      title: "Pearl Reglan",
      price: "\u20A6286,000 / $220",
      handle: "pearl-reglan",
      topImg: "/cowboy seriess/bview/top-06-pearl-reglan.jpg",
      botImg: "/cowboy seriess/bview/bot-06-pearl-reglan.jpg",
      parImg: "/cowboy seriess/bview/par-06-pearl-reglan.jpg"
    },
    {
      index: 11,
      title: "Outterspace Symbol Shirt",
      price: "\u20A6292,500 / $225",
      handle: "outterspace-symbol-shirt",
      topImg: "/cowboy seriess/bview/top-05-outterspace-symbol-shirt.jpg",
      botImg: "/cowboy seriess/bview/bot-05-outterspace-symbol-shirt.jpg",
      parImg: "/cowboy seriess/bview/par-05-outterspace-symbol-shirt.jpg"
    },
    {
      index: 12,
      title: "Cowboy Patch",
      price: "\u20A6305,500 / $235",
      handle: "cowboy-patch",
      topImg: "/cowboy seriess/bview/top-04-cowboy-patch.jpg",
      botImg: "/cowboy seriess/bview/bot-04-cowboy-patch.jpg",
      parImg: "/cowboy seriess/bview/par-04-cowboy-patch.jpg"
    },
    {
      index: 13,
      title: "Lago di Como",
      price: "\u20A6279,500 / $215",
      handle: "lago-di-como",
      topImg: "/cowboy seriess/bview/top-03-lago-di-como.jpg",
      botImg: "/cowboy seriess/bview/bot-03-lago-di-como.jpg",
      parImg: "/cowboy seriess/bview/par-03-lago-di-como.jpg"
    },
    {
      index: 14,
      title: "Frontier",
      price: "\u20A6325,000 / $250",
      handle: "frontier",
      topImg: "/cowboy seriess/bview/top-02-frontier.jpg",
      botImg: "/cowboy seriess/bview/bot-02-frontier.jpg",
      parImg: "/cowboy seriess/bview/par-02-frontier.jpg"
    },
    {
      index: 15,
      title: "Rangers - White",
      price: "\u20A6286,000 / $220",
      handle: "rangers-white",
      topImg: "/cowboy seriess/bview/top-01-rangers-white.jpg",
      botImg: "/cowboy seriess/bview/bot-01-rangers-white.jpg",
      parImg: "/cowboy seriess/bview/par-01-rangers-white.jpg"
    }
  ];

  // Distinct alternative bottom pants variant for each look in the reversed sequence
  var BOTTOM_VARIANTS = [
    8,  // 0 Western Romance Top -> 8 Rangers Black Bottom
    3,  // 1 Black Embellish Top -> 3 The Entourage Bottom
    7,  // 2 Starwave Cap Top -> 7 Noctra Flare Bottom
    8,  // 3 The Entourage Top -> 8 Rangers Black Bottom
    14, // 4 Outfield Mirage Top -> 14 Rangers White Bottom
    3,  // 5 Admiral Top -> 3 The Entourage Bottom
    7,  // 6 Equis Rodeo Top -> 7 Noctra Flare Bottom
    12, // 7 Noctra Flare Top -> 12 Lago di Como Bottom
    3,  // 8 Rangers Black Top -> 3 The Entourage Bottom
    8,  // 9 Pearl Reglan Top -> 8 Rangers Black Bottom
    7,  // 10 Outterspace Symbol Top -> 7 Noctra Flare Bottom
    3,  // 11 Cowboy Patch Top -> 3 The Entourage Bottom
    14, // 12 Lago di Como Top -> 14 Rangers White Bottom
    3,  // 13 Frontier Top -> 3 The Entourage Bottom
    7   // 14 Rangers White Top (Finale) -> 7 Noctra Flare Bottom
  ];

  // Preload all assets
  PRODUCTS.forEach(function (p) {
    new Image().src = p.topImg;
    new Image().src = p.botImg;
    new Image().src = p.parImg;
  });

  var TOTAL_DURATION_MS = 60000; // Exactly 60 seconds (1 minute)
  var CHAPTER_COUNT = PRODUCTS.length; // 15 models
  var CHAPTER_MS = TOTAL_DURATION_MS / CHAPTER_COUNT; // 4000ms per model

  function initSectionB() {
    var root = document.querySelector('[data-sply-b]');
    if (!root) return;

    var stageContainer = root.querySelector('[data-b-stage]');
    var matchBadge = root.querySelector('[data-b-match-badge]');
    var topTrack = root.querySelector('[data-b-top-track]');
    var botTrack = root.querySelector('[data-b-bot-track]');
    var dividerEl = root.querySelector('[data-b-divider]');
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
    var isZooming = false;
    var elapsedMs = 0;
    var isPlaying = true;
    var lastTick = Date.now();
    var manualZoomTimer = null;
    var manualVariantTimer = null;

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

    function slideTo(reelType, targetIdx) {
      var track = reelType === 'top' ? topTrack : botTrack;
      var slides = track.querySelectorAll('.sply-b__slide');
      var oldIdx = reelType === 'top' ? currentTopIdx : currentBotIdx;

      if (targetIdx === oldIdx && slides[targetIdx] && slides[targetIdx].classList.contains('is-current')) return;

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

    function setZoomState(zoomActive) {
      if (isZooming === zoomActive) return;
      isZooming = zoomActive;
      if (stageContainer) {
        if (zoomActive) stageContainer.classList.add('is-matched-zoom');
        else stageContainer.classList.remove('is-matched-zoom');
      }
      if (matchBadge) {
        if (zoomActive) matchBadge.classList.add('is-visible');
        else matchBadge.classList.remove('is-visible');
      }
      if (dividerEl) {
        if (zoomActive) dividerEl.classList.add('is-matched');
        else dividerEl.classList.remove('is-matched');
      }
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

      // Determine active model chapter (0 to 14)
      var modelIdx = Math.floor(elapsedMs / CHAPTER_MS);
      if (modelIdx >= CHAPTER_COUNT) modelIdx = CHAPTER_COUNT - 1;
      var localMs = elapsedMs % CHAPTER_MS;

      // Segment 1 (0ms to 1800ms): Top & Bottom MATCH!
      if (localMs < 1800) {
        if (currentTopIdx !== modelIdx) slideTo('top', modelIdx);
        if (currentBotIdx !== modelIdx) slideTo('bot', modelIdx);

        // Zoom In from 300ms to 1150ms, Zoom Out from 1150ms onwards
        var shouldZoom = (localMs >= 300 && localMs < 1150);
        setZoomState(shouldZoom);

        if (phasePill) {
          phasePill.textContent = 'MATCHED LOOK ' + String(modelIdx + 1).padStart(2, '0');
        }
      } 
      // Segment 2 (1800ms to 4000ms): Bottom slides to another variant!
      else {
        setZoomState(false); // Finished zoom out

        if (currentTopIdx !== modelIdx) slideTo('top', modelIdx);
        var variantBot = BOTTOM_VARIANTS[modelIdx];
        if (currentBotIdx !== variantBot) slideTo('bot', variantBot);

        if (phasePill) {
          phasePill.textContent = 'REMIX VARIANT ' + String(modelIdx + 1).padStart(2, '0');
        }
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
          elapsedMs = 0; // Seamless 1-minute continuous loop
        }
        applyTime(elapsedMs);
      }

      requestAnimationFrame(tick);
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

    // Trigger match zoom & bottom variant sequence on demand
    function triggerInteractiveMatchSequence(matchIdx) {
      clearTimeout(manualZoomTimer);
      clearTimeout(manualVariantTimer);

      slideTo('top', matchIdx);
      slideTo('bot', matchIdx);

      // Zoom in after 150ms
      manualZoomTimer = setTimeout(function () {
        setZoomState(true);
        // Zoom out after 850ms
        setTimeout(function () {
          setZoomState(false);
          // Slide in alternative variant bottom after another 600ms
          manualVariantTimer = setTimeout(function () {
            slideTo('bot', BOTTOM_VARIANTS[matchIdx]);
          }, 600);
        }, 850);
      }, 150);
    }

    if (remixBtn) {
      remixBtn.addEventListener('click', function () {
        // Step to next model complete match sequence
        var nextModel = (currentTopIdx + 1) % PRODUCTS.length;
        elapsedMs = nextModel * CHAPTER_MS;
        triggerInteractiveMatchSequence(nextModel);
      });
    }

    // Manual tap on Top or Bottom Reel
    var topReel = root.querySelector('.sply-b__reel--top');
    if (topReel) {
      topReel.addEventListener('click', function (e) {
        e.stopPropagation();
        var nextTop = (currentTopIdx + 1) % PRODUCTS.length;
        slideTo('top', nextTop);
        if (nextTop === currentBotIdx) {
          triggerInteractiveMatchSequence(nextTop);
        }
      });
    }

    var botReel = root.querySelector('.sply-b__reel--bottom');
    if (botReel) {
      botReel.addEventListener('click', function (e) {
        e.stopPropagation();
        var nextBot = (currentBotIdx + 1) % PRODUCTS.length;
        slideTo('bot', nextBot);
        if (nextBot === currentTopIdx) {
          triggerInteractiveMatchSequence(nextBot);
        }
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

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (e.key === ' ') {
        e.preventDefault();
        setPlayState(!isPlaying);
      } else if (e.key === 'ArrowRight') {
        applyTime((elapsedMs + 4000) % TOTAL_DURATION_MS);
      } else if (e.key === 'ArrowLeft') {
        applyTime((elapsedMs - 4000 + TOTAL_DURATION_MS) % TOTAL_DURATION_MS);
      }
    });

    // Initialize reels & state
    buildReels();
    updateTopHUD(PRODUCTS[0]);
    updateBotHUD(PRODUCTS[0]);
    applyTime(0);
    lastTick = Date.now();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionB);
  } else {
    initSectionB();
  }
})();
