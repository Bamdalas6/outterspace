/**
 * OUTTERSPACE "A VIEW" - EDITORIAL RUNWAY LOOKBOOK ENGINE
 * Replicates the Pinterest editorial fashion video presentation
 */
(function () {
  'use strict';

  var LOOKS = [
    {
      title: "Rangers - White",
      price: "₦286,000 / $220",
      handle: "rangers-white",
      img: "/cowboy seriess/aview/look-01-rangers-white.jpg"
    },
    {
      title: "Frontier",
      price: "₦325,000 / $250",
      handle: "frontier",
      img: "/cowboy seriess/aview/look-02-frontier.jpg"
    },
    {
      title: "Lago di Como",
      price: "₦279,500 / $215",
      handle: "lago-di-como",
      img: "/cowboy seriess/aview/look-03-lago-di-como.jpg"
    },
    {
      title: "Cowboy Patch",
      price: "₦305,500 / $235",
      handle: "cowboy-patch",
      img: "/cowboy seriess/aview/look-04-cowboy-patch.jpg"
    },
    {
      title: "Outterspace Symbol Shirt",
      price: "₦292,500 / $225",
      handle: "outterspace-symbol-shirt",
      img: "/cowboy seriess/aview/look-05-symbol-shirt.jpg"
    },
    {
      title: "Pearl Reglan",
      price: "₦286,000 / $220",
      handle: "pearl-reglan",
      img: "/cowboy seriess/aview/look-06-pearl-reglan.jpg"
    },
    {
      title: "Rangers - Black",
      price: "₦299,000 / $230",
      handle: "rangers",
      img: "/cowboy seriess/aview/look-07-rangers-black.jpg"
    },
    {
      title: "Noctra Flare Pant",
      price: "₦448,500 / $345",
      handle: "nocta-flare-pant",
      img: "/cowboy seriess/aview/look-08-nocta-flare-pant.jpg"
    },
    {
      title: "Equis Rodeo Shirt",
      price: "₦377,000 / $290",
      handle: "equis-rodeo",
      img: "/cowboy seriess/aview/look-09-equis-rodeo.jpg"
    },
    {
      title: "Admiral",
      price: "₦338,000 / $260",
      handle: "admiral",
      img: "/cowboy seriess/aview/look-10-admiral.jpg"
    },
    {
      title: "Outfield Mirage",
      price: "₦338,000 / $260",
      handle: "outfield-mirage",
      img: "/cowboy seriess/aview/look-11-outfield-mirage.jpg"
    },
    {
      title: "The Entourage Pants",
      price: "₦383,500 / $295",
      handle: "the-entourage",
      img: "/cowboy seriess/aview/look-12-the-entourage.jpg"
    },
    {
      title: "Starwave Cap",
      price: "₦130,000 / $100",
      handle: "starwave-hat",
      img: "/cowboy seriess/aview/look-13-starwave-hat.jpg"
    },
    {
      title: "Black Embellish Cowboy Shirt",
      price: "₦383,500 / $295",
      handle: "black-embellish-cowboy-shirt",
      img: "/cowboy seriess/aview/look-14-black-embellish.jpg"
    },
    {
      title: "Western Romance Shirt",
      price: "₦325,000 / $250",
      handle: "western-romance",
      img: "/cowboy seriess/aview/look-15-western-romance.jpg"
    }
  ];

  // Preload all model images into cache immediately
  LOOKS.forEach(function (look) {
    var im = new Image();
    im.src = look.img;
  });

  var TOTAL_CYCLE_MS = 20000; // Exactly 20s runway loop across all 15 looks
  var durationPerLook = TOTAL_CYCLE_MS / LOOKS.length; // ~1333.33ms per look
  var currentIndex = 0;
  var isPlaying = true;
  var progressElapsed = 0;
  var progressTimer = null;
  var lastTick = Date.now();

  function initAView() {
    var wrapper = document.querySelector('[data-sply-aview]');
    if (!wrapper) return;

    var progressContainer = wrapper.querySelector('[data-aview-progress]');
    var modelImg = wrapper.querySelector('[data-aview-img]');
    var modelLink = wrapper.querySelector('[data-aview-link]');
    var titleEl = wrapper.querySelector('[data-aview-title]');
    var priceEl = wrapper.querySelector('[data-aview-price]');
    var ctaEl = wrapper.querySelector('[data-aview-cta]');
    var counterEl = wrapper.querySelector('[data-aview-counter]');
    var playBtn = wrapper.querySelector('[data-aview-play]');
    var tapLeft = wrapper.querySelector('[data-aview-prev]');
    var tapRight = wrapper.querySelector('[data-aview-next]');

    // Build progress bars
    progressContainer.innerHTML = '';
    var bars = [];
    LOOKS.forEach(function (_, idx) {
      var bar = document.createElement('div');
      bar.className = 'sply-aview__bar';
      bar.innerHTML = '<div class="sply-aview__bar-fill"></div>';
      bar.addEventListener('click', function (e) {
        e.stopPropagation();
        goToLook(idx);
      });
      progressContainer.appendChild(bar);
      bars.push(bar);
    });

    function updateProgressBars() {
      bars.forEach(function (bar, idx) {
        var fill = bar.querySelector('.sply-aview__bar-fill');
        if (idx < currentIndex) {
          bar.classList.add('is-passed');
          fill.style.width = '100%';
        } else if (idx === currentIndex) {
          bar.classList.remove('is-passed');
          var pct = Math.min(100, (progressElapsed / durationPerLook) * 100);
          fill.style.width = pct + '%';
        } else {
          bar.classList.remove('is-passed');
          fill.style.width = '0%';
        }
      });
    }

    function renderLook(index) {
      var look = LOOKS[index];
      var prodUrl = '/products/' + look.handle;

      // Smooth editorial transition
      modelImg.classList.add('is-entering');
      modelImg.src = look.img;
      modelImg.alt = look.title;
      setTimeout(function () {
        modelImg.classList.remove('is-entering');
      }, 70);

      if (modelLink) modelLink.href = prodUrl;
      if (titleEl) {
        titleEl.textContent = look.title.toUpperCase();
        titleEl.href = prodUrl;
      }
      if (priceEl) priceEl.textContent = look.price;
      if (ctaEl) ctaEl.href = prodUrl;
      if (counterEl) {
        counterEl.textContent = 'LOOK ' + String(index + 1).padStart(2, '0') + ' / ' + String(LOOKS.length).padStart(2, '0');
      }

      progressElapsed = 0;
      updateProgressBars();
    }

    function goToLook(idx) {
      currentIndex = (idx + LOOKS.length) % LOOKS.length;
      progressElapsed = 0;
      renderLook(currentIndex);
    }

    function nextLook() {
      goToLook(currentIndex + 1);
    }

    function prevLook() {
      goToLook(currentIndex - 1);
    }

    function setPlayState(play) {
      isPlaying = play;
      if (playBtn) {
        playBtn.innerHTML = isPlaying
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
          : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>';
        playBtn.setAttribute('title', isPlaying ? 'Pause Runway' : 'Play Runway');
      }
    }

    // Animation ticker - continuous runway playback across all looks
    function tick() {
      var now = Date.now();
      var delta = now - lastTick;
      lastTick = now;

      if (isPlaying) {
        progressElapsed += delta;
        if (progressElapsed >= durationPerLook) {
          nextLook();
        } else {
          updateProgressBars();
        }
      }

      progressTimer = requestAnimationFrame(tick);
    }

    lastTick = Date.now();
    progressTimer = requestAnimationFrame(tick);

    // Controls listeners
    if (tapLeft) {
      tapLeft.addEventListener('click', function (e) {
        e.preventDefault();
        prevLook();
      });
    }

    if (tapRight) {
      tapRight.addEventListener('click', function (e) {
        e.preventDefault();
        nextLook();
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setPlayState(!isPlaying);
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') nextLook();
      else if (e.key === 'ArrowLeft') prevLook();
      else if (e.key === ' ') {
        e.preventDefault();
        setPlayState(!isPlaying);
      }
    });

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchStartY = 0;
    wrapper.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) nextLook();
          else prevLook();
        }
      }
    }, { passive: true });

    // Initial render
    renderLook(0);
    setPlayState(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAView);
  } else {
    initAView();
  }
})();
