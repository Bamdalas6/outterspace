/**
 * OUTTERSPACE — SECTION C (CLOCKWISE REVEAL & PRE-ORDER SHOWCASE)
 * Loads products clockwise (12 -> 2 -> 4 -> 6 -> 8 -> 10 o'clock).
 * Once a product is loaded and revealed, it remains revealed and never loads again.
 */

(function () {
  'use strict';

  // Product Data for the 6 Radial Capsules (Altoro Black Pant & Caballo)
  var CAPSULE_ITEMS = [
    {
      id: 1,
      pos: 1,
      handle: 'altoro-black-pant',
      title: 'Altoro Black Pant',
      subtitle: 'Front Flare Silhouette',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/altoro-front.jpg',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Milled from luxury heavyweight black denim with dramatic flared leg opening. Featuring tactile Outterspace Cowboy Series rope embroidery, running mustang horses with golden lasso artwork, and branded rear leather patch with cap-wearing stallion back pocket illustration.'
    },
    {
      id: 2,
      pos: 2,
      handle: 'caballo',
      title: 'Caballo Jort',
      subtitle: 'Pearl Flap & Cargo Jort',
      price_ngn: '₦383,500',
      price_usd: '$295',
      image: '/cowboy seriess/caballo-front.jpg',
      variants: [
        { id: 58037098938699, size: 'S' },
        { id: 58037098971467, size: 'M' },
        { id: 58037099004235, size: 'L' },
        { id: 58037099037003, size: 'XL' },
        { id: 58037099069771, size: '2XL' },
        { id: 58037099102539, size: '3XL' }
      ],
      desc: 'Crafted from light indigo vintage wash heavyweight denim. Accented with handcrafted pearl flower studs across dual cargo pocket flaps, grazing stallion embroidery, Outterspace Cowboy Series script, and dual-grommet utility belt with polished hardware buckle.'
    },
    {
      id: 3,
      pos: 3,
      handle: 'altoro-black-pant',
      title: 'Altoro Black Pant',
      subtitle: 'Back Silhouette & Pocket Patch',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/altoro-back.jpg',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Rear perspective of the Altoro flared silhouette, featuring Outterspace genuine leather waistband patch, welt pocket construction, and cap-wearing horse back pocket embroidery.'
    },
    {
      id: 4,
      pos: 4,
      handle: 'caballo',
      title: 'Caballo Jort',
      subtitle: 'Horse & Pearl Pocket Detail',
      price_ngn: '₦383,500',
      price_usd: '$295',
      image: '/cowboy seriess/caballo-detail.jpg',
      variants: [
        { id: 58037098938699, size: 'S' },
        { id: 58037098971467, size: 'M' },
        { id: 58037099004235, size: 'L' },
        { id: 58037099037003, size: 'XL' },
        { id: 58037099069771, size: '2XL' },
        { id: 58037099102539, size: '3XL' }
      ],
      desc: 'Macro focus on the handcrafted pearl cluster studs along the pocket flaps and pastoral stallion grazing illustration with field wildflower embroidery.'
    },
    {
      id: 5,
      pos: 5,
      handle: 'altoro-black-pant',
      title: 'Altoro Black Pant',
      subtitle: 'Mustang Horses & Lasso Detail',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/altoro-detail.jpg',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Detailed view of the multi-horse stampede embroidery and golden lasso swirling around the flare hem with Cowboy Series 2026 lettering.'
    },
    {
      id: 6,
      pos: 6,
      handle: 'altoro-black-pant',
      title: 'Altoro Black Pant',
      subtitle: 'Stallion Cap Back Pocket Patch',
      price_ngn: '₦448,500',
      price_usd: '$345',
      image: '/cowboy seriess/altoro-back-detail.jpg',
      variants: [
        { id: 58051664642379, size: 'S' },
        { id: 58051664675147, size: 'M' },
        { id: 58051664707915, size: 'L' },
        { id: 58051664740683, size: 'XL' },
        { id: 58051664773451, size: '2XL' },
        { id: 58051664806219, size: '3XL' }
      ],
      desc: 'Close-up of the signature yellow cap horse character back patch, tonal stitching, and bespoke leather label.'
    }
  ];

  // DOM References
  var capsules = document.querySelectorAll('.sply-c-capsule');
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

  // Active Pre-Order State
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

  /**
   * Clockwise Reveal Sequence:
   * Positions are ordered 1 (12 o'clock) -> 2 (2 o'clock) -> 3 (4 o'clock)
   * -> 4 (6 o'clock) -> 5 (8 o'clock) -> 6 (10 o'clock).
   * Each capsule spins and loads, then reveals and REMAINS revealed.
   * Once all 6 are revealed, they never load again.
   */
  var STEP_DELAY = 1200; // 1.2s per capsule reveal
  var revealedCount = 0;

  function revealCapsule(index) {
    if (index >= capsules.length) return;
    var cap = capsules[index];
    if (cap && !cap.classList.contains('is-revealed')) {
      cap.classList.add('is-revealed');
      revealedCount++;
      if (headerStatusText) {
        if (revealedCount >= capsules.length) {
          headerStatusText.textContent = 'ALL REVEALED • SELECT TO PRE-ORDER';
        } else {
          headerStatusText.textContent = 'REVEALED ' + revealedCount + '/6 • CLOCKWISE LOADING';
        }
      }
    }
  }

  function startClockwiseReveal() {
    // Reveal position 1 (index 0) after initial spinner presentation (800ms)
    setTimeout(function () {
      revealCapsule(0);
    }, 900);

    // Reveal positions 2 through 6 in clockwise succession
    for (var i = 1; i < capsules.length; i++) {
      (function (idx) {
        setTimeout(function () {
          revealCapsule(idx);
        }, 900 + (idx * STEP_DELAY));
      })(i);
    }
  }

  // Capsule Click Handler: opens Pre-Order Drawer
  capsules.forEach(function (cap, idx) {
    cap.addEventListener('click', function (e) {
      e.stopPropagation();
      // Ensure it is revealed if clicked early
      revealCapsule(idx);
      openPreOrderDrawer(CAPSULE_ITEMS[idx]);
    });
  });

  // Open Pre-Order Drawer
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

            // Dispatch global events for sply-cart.js
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

  // Kick off the one-time Clockwise Reveal Sequence on load
  startClockwiseReveal();

})();
