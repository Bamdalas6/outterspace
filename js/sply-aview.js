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
      img: "/cowboy seriess/rangers-white-2-nobg.png"
    },
    {
      title: "Frontier",
      price: "₦325,000 / $250",
      handle: "frontier",
      img: "/cowboy seriess/frontier-2-nobg.png"
    },
    {
      title: "Lago di Como",
      price: "₦279,500 / $215",
      handle: "lago-di-como",
      img: "/cowboy seriess/lago-di-como-2-nobg.png"
    },
    {
      title: "Cowboy Patch",
      price: "₦305,500 / $235",
      handle: "cowboy-patch",
      img: "/cowboy seriess/cowboy-patch-3-nobg.png"
    },
    {
      title: "Outterspace Symbol Shirt",
      price: "₦292,500 / $225",
      handle: "outterspace-symbol-shirt",
      img: "/cowboy seriess/outterspace-symbol-shirt-2-nobg.png"
    },
    {
      title: "Pearl Reglan",
      price: "₦286,000 / $220",
      handle: "pearl-reglan",
      img: "/cowboy seriess/pearl-reglan-2-nobg.png"
    },
    {
      title: "Rangers - Black",
      price: "₦299,000 / $230",
      handle: "rangers",
      img: "/cowboy seriess/rangers-3-nobg.png"
    },
    {
      title: "Noctra Flare Pant",
      price: "₦448,500 / $345",
      handle: "nocta-flare-pant",
      img: "/cowboy seriess/nocta-flare-pant-2-nobg.png"
    },
    {
      title: "Equis Rodeo Shirt",
      price: "₦377,000 / $290",
      handle: "equis-rodeo",
      img: "/cowboy seriess/equis-rodeo-3-nobg.png"
    },
    {
      title: "Admiral",
      price: "₦338,000 / $260",
      handle: "admiral",
      img: "/cowboy seriess/admiral-5-nobg.png"
    },
    {
      title: "Outfield Mirage",
      price: "₦338,000 / $260",
      handle: "outfield-mirage",
      img: "/cowboy seriess/outfield-mirage-3-nobg.png"
    },
    {
      title: "The Entourage Pants",
      price: "₦383,500 / $295",
      handle: "the-entourage",
      img: "/cowboy seriess/the-entourage-3-nobg.png"
    },
    {
      title: "Starwave Cap",
      price: "₦130,000 / $100",
      handle: "starwave-hat",
      img: "/cowboy seriess/starwave-hat-2-nobg.png"
    },
    {
      title: "Black Embellish Cowboy Shirt",
      price: "₦383,500 / $295",
      handle: "black-embellish-cowboy-shirt",
      img: "/cowboy seriess/black-embellish-cowboy-shirt-3-nobg.png"
    },
    {
      title: "Western Romance Shirt",
      price: "₦325,000 / $250",
      handle: "western-romance",
      img: "/cowboy seriess/western-romance-5-nobg.png"
    }
  ];

  // Preload all model images for instant transitions
  LOOKS.forEach(function (look) {
    var im = new Image();
    im.src = look.img;
  });

  var currentIndex = 0;
  var isPlaying = true;
  var isHovered = false;
  var durationPerLook = 3000; // 3 seconds per look
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

      // Animate transition
      modelImg.classList.add('is-entering');
      setTimeout(function () {
        modelImg.src = look.img;
        modelImg.alt = look.title;
        modelImg.classList.remove('is-entering');
      }, 120);

      modelLink.href = prodUrl;
      titleEl.textContent = look.title;
      titleEl.href = prodUrl;
      priceEl.textContent = look.price;
      ctaEl.href = prodUrl;
      counterEl.textContent = 'LOOK ' + String(index + 1).padStart(2, '0') + ' / ' + String(LOOKS.length).padStart(2, '0');

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

    // Animation ticker
    function tick() {
      var now = Date.now();
      var delta = now - lastTick;
      lastTick = now;

      if (isPlaying && !isHovered) {
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

    // Pause on hover over model stage so user can inspect
    var stageEl = wrapper.querySelector('.sply-aview__stage');
    if (stageEl) {
      stageEl.addEventListener('mouseenter', function () { isHovered = true; });
      stageEl.addEventListener('mouseleave', function () { isHovered = false; });
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
