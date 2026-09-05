/**
 * OUTTERSPACE — SECTION C (EDITORIAL TEASER & PRE-ORDER SHOWCASE)
 * Handles sequential loading animation, radial capsule unblurring,
 * scrubber playback control, and pre-order drawer / cart integration.
 */

(function () {
  'use strict';

  // Product Data for the 6 Radial Capsules
  var CAPSULE_ITEMS = [
    {
      id: 1,
      pos: 1,
      handle: 'nocta-flare-pant',
      title: 'Noctra Flare Pant',
      subtitle: 'Front Flat Silhouette',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/nocta-flare-pant-1-nobg.png',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Luxury heavyweight French terry flared trousers featuring crystal stud Outterspace lettering, tailored relaxed flare drape, and deep jet black finish.'
    },
    {
      id: 2,
      pos: 2,
      handle: 'the-entourage',
      title: 'The Entourage Pants',
      subtitle: 'Front Flat Twill & Denim',
      price_ngn: '₦383,500',
      price_usd: '$295',
      image: '/cowboy seriess/the-entourage-1-nobg.png',
      variants: [
        { id: 58037098938699, size: 'S' },
        { id: 58037098971467, size: 'M' },
        { id: 58037099004235, size: 'L' },
        { id: 58037099037003, size: 'XL' },
        { id: 58037099069771, size: '2XL' },
        { id: 58037099102539, size: '3XL' }
      ],
      desc: 'Sand heavyweight cotton denim twill flared pants / jorts featuring authentic cowboy frontier illustrated graphics and hand-finished distressing.'
    },
    {
      id: 3,
      pos: 3,
      handle: 'the-entourage',
      title: 'The Entourage Pants',
      subtitle: 'Back Flap Graphic Detail',
      price_ngn: '₦383,500',
      price_usd: '$295',
      image: '/cowboy seriess/the-entourage-2-nobg.png',
      variants: [
        { id: 58037098938699, size: 'S' },
        { id: 58037098971467, size: 'M' },
        { id: 58037099004235, size: 'L' },
        { id: 58037099037003, size: 'XL' },
        { id: 58037099069771, size: '2XL' },
        { id: 58037099102539, size: '3XL' }
      ],
      desc: 'Detailed back flap cowboy artwork with reinforced dual rear patch pockets and authentic Western Americana character illustrations.'
    },
    {
      id: 4,
      pos: 4,
      handle: 'nocta-flare-pant',
      title: 'Noctra Flare Pant',
      subtitle: 'Side Stud Drape & Profile',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/nocta-flare-pant-2-nobg.png',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Side profile silhouette highlighting the elongated stacked flare drape and signature crystal stud lettering down the outer leg.'
    },
    {
      id: 5,
      pos: 5,
      handle: 'the-entourage',
      title: 'The Entourage Pants',
      subtitle: 'Editorial Model Fit Look',
      price_ngn: '₦383,500',
      price_usd: '$295',
      image: '/cowboy seriess/the-entourage-3-nobg.png',
      variants: [
        { id: 58037098938699, size: 'S' },
        { id: 58037098971467, size: 'M' },
        { id: 58037099004235, size: 'L' },
        { id: 58037099037003, size: 'XL' },
        { id: 58037099069771, size: '2XL' },
        { id: 58037099102539, size: '3XL' }
      ],
      desc: 'Full runway silhouette showcasing true-to-size drape, relaxed leg opening, and high-impact street-frontier styling.'
    },
    {
      id: 6,
      pos: 6,
      handle: 'nocta-flare-pant',
      title: 'Noctra Flare Pant',
      subtitle: 'Editorial Model Fit Look',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/nocta-flare-pant-3-nobg.png',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Editorial fit presentation demonstrating structured heavyweight drape, fluid movement, and luxury proportions.'
    }
  ];

  // DOM References
  var capsules = document.querySelectorAll('.sply-c-capsule');
  var playBtn = document.querySelector('[data-c-playbtn]');
  var scrubTrack = document.querySelector('[data-c-scrub-track]');
  var scrubFill = document.querySelector('[data-c-scrub-fill]');
  var revealAllBtn = document.querySelector('[data-c-reveal-all]');
  var teaserModeBtn = document.querySelector('[data-c-teaser-mode]');
  var headerStatusText = document.querySelector('[data-c-status-text]');

  // Drawer References
  var drawer = document.querySelector('[data-c-drawer]');
  var drawerScrim = document.querySelector('[data-c-drawer-scrim]');
  var drawerClose = document.querySelector('[data-c-drawer-close]');
  var drawerImg = document.querySelector('[data-c-drawer-img]');
  var drawerTitle = document.querySelector('[data-c-drawer-title]');
  var drawerNgn = document.querySelector('[data-c-drawer-ngn]');
  var drawerUsd = document.querySelector('[data-c-drawer-usd]');
  var drawerDesc = document.querySelector('[data-c-drawer-desc]');
  var drawerSizesGrid = document.querySelector('[data-c-sizes-grid]');
  var drawerCta = document.querySelector('[data-c-drawer-cta]');

  // Animation & Timeline State
  var TOTAL_DURATION = 18000; // 18 seconds full cycle
  var isPlaying = true;
  var isForcedReveal = false;
  var currentTime = 0;
  var lastTimestamp = null;
  var animFrameId = null;

  // Active Pre-Order selection
  var activeItem = CAPSULE_ITEMS[0];
  var activeVariantId = activeItem.variants[0].id;

  // Preload Images
  function preloadImages() {
    CAPSULE_ITEMS.forEach(function (it) {
      var img = new Image();
      img.src = it.image;
    });
  }
  preloadImages();

  // Update Capsules based on Timeline Progress (0 to 1)
  function renderTimeline(progress) {
    if (scrubFill) {
      scrubFill.style.width = (progress * 100).toFixed(2) + '%';
    }

    if (isForcedReveal) return;

    var numItems = CAPSULE_ITEMS.length;
    // Each item has a phase slot across 0.85 of timeline, remaining 0.15 is full showcase
    var stepSize = 0.85 / numItems;

    capsules.forEach(function (cap, idx) {
      var revealThreshold = idx * stepSize;
      if (progress >= revealThreshold) {
        cap.classList.add('is-revealed');
      } else {
        cap.classList.remove('is-revealed');
      }
    });

    if (headerStatusText) {
      if (progress >= 0.85) {
        headerStatusText.textContent = '6/6 LOADED • READY FOR PRE-ORDER';
      } else {
        var loadedCount = Math.min(numItems, Math.floor(progress / stepSize) + 1);
        headerStatusText.textContent = 'LOADING ' + loadedCount + '/' + numItems + ' • TEASER DROP';
      }
    }
  }

  // Animation Loop
  function tick(timestamp) {
    if (!isPlaying) {
      lastTimestamp = null;
      return;
    }

    if (!lastTimestamp) lastTimestamp = timestamp;
    var delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    currentTime = (currentTime + delta) % TOTAL_DURATION;
    var progress = currentTime / TOTAL_DURATION;

    renderTimeline(progress);
    animFrameId = requestAnimationFrame(tick);
  }

  function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    isForcedReveal = false;
    if (playBtn) playBtn.classList.add('is-playing');
    if (revealAllBtn) revealAllBtn.classList.remove('is-active');
    if (teaserModeBtn) teaserModeBtn.classList.remove('is-active');
    lastTimestamp = null;
    animFrameId = requestAnimationFrame(tick);
  }

  function pausePlayback() {
    isPlaying = false;
    if (playBtn) playBtn.classList.remove('is-playing');
    if (animFrameId) cancelAnimationFrame(animFrameId);
    lastTimestamp = null;
  }

  function togglePlayback() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePlayback();
    });
  }

  // Scrubber Track Click / Seek
  if (scrubTrack) {
    scrubTrack.addEventListener('click', function (e) {
      var rect = scrubTrack.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var ratio = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = ratio * TOTAL_DURATION;
      renderTimeline(ratio);
    });
  }

  // Reveal All / Teaser Toggle Actions
  if (revealAllBtn) {
    revealAllBtn.addEventListener('click', function () {
      pausePlayback();
      isForcedReveal = true;
      capsules.forEach(function (c) { c.classList.add('is-revealed'); });
      if (scrubFill) scrubFill.style.width = '100%';
      revealAllBtn.classList.add('is-active');
      if (teaserModeBtn) teaserModeBtn.classList.remove('is-active');
      if (headerStatusText) headerStatusText.textContent = 'ALL REVEALED • SELECT TO PRE-ORDER';
    });
  }

  if (teaserModeBtn) {
    teaserModeBtn.addEventListener('click', function () {
      pausePlayback();
      isForcedReveal = false;
      currentTime = 0;
      capsules.forEach(function (c) { c.classList.remove('is-revealed'); });
      if (scrubFill) scrubFill.style.width = '0%';
      teaserModeBtn.classList.add('is-active');
      if (revealAllBtn) revealAllBtn.classList.remove('is-active');
      if (headerStatusText) headerStatusText.textContent = 'TEASER MODE • 12-TICK SPINNER ACTIVE';
    });
  }

  // Open Pre-Order Drawer for an Item
  function openPreOrderDrawer(item) {
    activeItem = item;
    activeVariantId = item.variants[0].id;

    if (drawerImg) {
      drawerImg.src = item.image;
      drawerImg.alt = item.title;
    }
    if (drawerTitle) drawerTitle.textContent = item.title;
    if (drawerNgn) drawerNgn.textContent = item.price_ngn;
    if (drawerUsd) drawerUsd.textContent = '(' + item.price_usd + ')';
    if (drawerDesc) drawerDesc.textContent = item.desc;

    // Build Size Selector Buttons
    if (drawerSizesGrid) {
      drawerSizesGrid.innerHTML = '';
      item.variants.forEach(function (v, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sply-c-drawer__size-btn' + (idx === 0 ? ' is-selected' : '');
        btn.textContent = v.size;
        btn.setAttribute('data-variant-id', v.id);

        btn.addEventListener('click', function () {
          var allBtns = drawerSizesGrid.querySelectorAll('.sply-c-drawer__size-btn');
          allBtns.forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
          activeVariantId = v.id;
        });

        drawerSizesGrid.appendChild(btn);
      });
    }

    if (drawerCta) {
      drawerCta.disabled = false;
      drawerCta.textContent = 'PRE-ORDER NOW — ' + item.price_ngn;
    }

    if (drawer) drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePreOrderDrawer() {
    if (drawer) drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (drawerScrim) drawerScrim.addEventListener('click', closePreOrderDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closePreOrderDrawer);

  // Keyboard escape key closes drawer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closePreOrderDrawer();
    }
  });

  // Capsule Click Handlers
  capsules.forEach(function (cap) {
    cap.addEventListener('click', function (e) {
      e.stopPropagation();
      var pos = parseInt(cap.getAttribute('data-pos'), 10);
      var item = CAPSULE_ITEMS.find(function (it) { return it.pos === pos; });
      if (item) {
        cap.classList.add('is-revealed');
        openPreOrderDrawer(item);
      }
    });
  });

  // Pre-Order CTA Add to Cart Action
  if (drawerCta) {
    drawerCta.addEventListener('click', function () {
      if (!activeVariantId) return;

      drawerCta.disabled = true;
      drawerCta.textContent = 'ADDING TO BAG...';

      var payload = {
        id: activeVariantId,
        quantity: 1
      };

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Cart network error');
          return res.json();
        })
        .then(function (cartData) {
          drawerCta.textContent = 'ADDED TO BAG ✓';
          setTimeout(function () {
            closePreOrderDrawer();

            // Open the global native Outterspace Cart Drawer
            var cartDrawer = document.querySelector('[data-sply-cart]');
            if (cartDrawer) {
              cartDrawer.removeAttribute('hidden');
              cartDrawer.classList.add('is-open');
            }

            // Sync cart count badge
            var countEl = document.querySelector('[data-cart-count]');
            if (countEl && cartData.item_count !== undefined) {
              countEl.textContent = cartData.item_count;
              countEl.removeAttribute('hidden');
            }

            // Dispatch global event for sply-cart.js if listening
            document.dispatchEvent(new CustomEvent('sply:cart:updated', { detail: cartData }));
            document.dispatchEvent(new CustomEvent('cart:refresh', { detail: cartData }));
          }, 350);
        })
        .catch(function (err) {
          console.error('Pre-order add failed:', err);
          drawerCta.textContent = 'ERROR — TRY AGAIN';
          setTimeout(function () {
            drawerCta.disabled = false;
            drawerCta.textContent = 'PRE-ORDER NOW — ' + activeItem.price_ngn;
          }, 1500);
        });
    });
  }

  // Start Animation Loop on Page Load
  startPlayback();

})();
