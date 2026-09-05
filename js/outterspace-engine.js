/**
 * OUTTERSPACE STORE — Interaction & UI Engine
 * Inspired by SPLY Studio (sply-studio.webexp.dev)
 */

(function(window, document) {
  'use strict';

  // =========================================================================
  // 1. SOUND SYNTHESIZER (Sound Disabled)
  // =========================================================================
  var AudioFX = {
    play: function() {},
    toggleMute: function() { return true; },
    isMuted: function() { return true; }
  };
  window.AudioFX = AudioFX;

  // =========================================================================
  // 2. TEXT SCRAMBLER EFFECT
  // =========================================================================
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  function scrambleText(element, finalString, duration) {
    if (!element) return;
    duration = duration || 350;
    var length = finalString.length;
    var startTime = Date.now();

    function step() {
      var elapsed = Date.now() - startTime;
      var progress = Math.min(1, elapsed / duration);
      var scrambled = '';

      for (var i = 0; i < length; i++) {
        if (progress >= (i + 1) / length) {
          scrambled += finalString[i];
        } else if (finalString[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      element.textContent = scrambled;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = finalString;
      }
    }
    requestAnimationFrame(step);
  }

  // =========================================================================
  // 3. THEME CONTROLLER (Dark / Light Mode)
  // =========================================================================
  function initTheme() {
    var savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem('outterspace_theme') || 'dark';
    } catch(e) {}

    applyTheme(savedTheme, false);

    var toggleBtn = document.getElementById('splyThemeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        var current = document.documentElement.classList.contains('sply--light') ? 'light' : 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        applyTheme(next, true);
        AudioFX.play('click');
      });
    }
  }

  function applyTheme(theme, animate) {
    var root = document.documentElement;
    var change = function() {
      root.classList.remove('sply--dark', 'sply--light');
      root.classList.add('sply--' + theme);
      try {
        localStorage.setItem('outterspace_theme', theme);
      } catch(e) {}
    };

    if (animate && document.startViewTransition) {
      document.startViewTransition(change);
    } else {
      change();
    }
  }

  // =========================================================================
  // 4. ZOOM LEVEL CONTROLLER
  // =========================================================================
  var currentZoom = 0; // 0 = Dense, 1 = Hero

  function initZoom() {
    var surface = document.querySelector('[data-sply-surface]');
    if (!surface) return;

    var btn0 = document.getElementById('splyZoom0');
    var btn1 = document.getElementById('splyZoom1');

    function setZoom(level) {
      currentZoom = level;
      surface.setAttribute('data-sply-zoom', String(level));
      if (btn0) btn0.classList.toggle('is-active', level === 0);
      if (btn1) btn1.classList.toggle('is-active', level === 1);
      AudioFX.play('zoom');
    }

    if (btn0) btn0.addEventListener('click', function() { setZoom(0); });
    if (btn1) btn1.addEventListener('click', function() { setZoom(1); });
  }

  // =========================================================================
  // 5. CATEGORY FILTER & VIEW SWITCHER
  // =========================================================================
  var activeCategory = 'ALL';
  var activeView = 'GRID'; // 'GRID' or 'ROAM'

  function initFilters(products) {
    var chips = document.querySelectorAll('[data-sply-filter]');
    var cards = document.querySelectorAll('.sply-card');

    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var cat = chip.getAttribute('data-sply-filter');
        activeCategory = cat;

        chips.forEach(function(c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');

        // Scramble text effect on chip
        var label = chip.querySelector('span:first-child');
        if (label) {
          scrambleText(label, label.getAttribute('data-original') || label.textContent, 200);
        }

        AudioFX.play('click');
        filterGridCards(cat);
      });

      // Cache original label for text scrambling
      var span = chip.querySelector('span:first-child');
      if (span) {
        span.setAttribute('data-original', span.textContent);
      }
    });

    // View Switchers
    var gridViewBtn = document.getElementById('splyViewGrid');
    var roamViewBtn = document.getElementById('splyViewRoam');
    var gridSurface = document.getElementById('splyGridSurface');
    var roamSection = document.getElementById('splyRoamSection');

    function setView(view) {
      activeView = view;
      if (view === 'GRID') {
        if (gridViewBtn) gridViewBtn.classList.add('is-active');
        if (roamViewBtn) roamViewBtn.classList.remove('is-active');
        if (gridSurface) gridSurface.style.display = 'block';
        if (roamSection) roamSection.classList.remove('is-active');
      } else {
        if (gridViewBtn) gridViewBtn.classList.remove('is-active');
        if (roamViewBtn) roamViewBtn.classList.add('is-active');
        if (gridSurface) gridSurface.style.display = 'none';
        if (roamSection) roamSection.classList.add('is-active');
      }
      AudioFX.play('click');
    }

    if (gridViewBtn) gridViewBtn.addEventListener('click', function() { setView('GRID'); });
    if (roamViewBtn) roamViewBtn.addEventListener('click', function() { setView('ROAM'); });

    window.setViewMode = setView;
  }

  function filterGridCards(cat) {
    var cards = document.querySelectorAll('.sply-card');
    cards.forEach(function(card, idx) {
      var itemCat = card.getAttribute('data-category');
      var itemTags = card.getAttribute('data-tags') || '';
      var match = (cat === 'ALL') || (itemCat === cat) || (itemTags.indexOf(cat) > -1);

      if (match) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(function() {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, idx * 25);
      } else {
        card.style.display = 'none';
      }
    });
  }

  // =========================================================================
  // 6. PRODUCT DETAIL MODAL & MAGNIFIER LENS
  // =========================================================================
  var currentPdpProduct = null;
  var selectedPdpSize = null;

  function initPdp(productsMap) {
    var modal = document.getElementById('splyPdpModal');
    if (!modal) return;

    var closeBtn = document.getElementById('splyPdpClose');
    var scrim = modal.querySelector('.sply-pdp-scrim');

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
      AudioFX.play('close');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (scrim) scrim.addEventListener('click', closeModal);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Open PDP Function
    window.openPdp = function(productId) {
      var product = productsMap[productId];
      if (!product) return;
      currentPdpProduct = product;
      selectedPdpSize = product.sizes ? product.sizes[0] : 'OS';

      // 1. Set Title with Scramble Effect
      var titleEl = document.getElementById('splyPdpTitle');
      if (titleEl) {
        scrambleText(titleEl, product.title, 400);
      }

      // 2. Set SKU & Subtitle
      var skuEl = document.getElementById('splyPdpSku');
      if (skuEl) skuEl.textContent = product.sku || ('SKU: ' + product.id.toUpperCase());

      // 3. Set Price
      var priceEl = document.getElementById('splyPdpPrice');
      var compareEl = document.getElementById('splyPdpComparePrice');
      if (priceEl) priceEl.textContent = '$' + product.price.toFixed(2);
      if (compareEl) {
        if (product.compare_at_price && product.compare_at_price > product.price) {
          compareEl.textContent = '$' + product.compare_at_price.toFixed(2);
          compareEl.style.display = 'inline';
        } else {
          compareEl.style.display = 'none';
        }
      }

      // 4. Description & Details
      var descEl = document.getElementById('splyPdpDesc');
      if (descEl) descEl.textContent = product.description;

      var detailsList = document.getElementById('splyPdpDetailsList');
      if (detailsList && product.details) {
        var dHtml = '';
        product.details.forEach(function(det) {
          dHtml += '<li>' + det + '</li>';
        });
        detailsList.innerHTML = dHtml;
      }

      // 5. Sizes Selector
      var sizesContainer = document.getElementById('splyPdpSizes');
      if (sizesContainer && product.sizes) {
        var sHtml = '';
        product.sizes.forEach(function(sz, sIdx) {
          var isSelected = sIdx === 0 ? ' is-selected' : '';
          sHtml += '<button type="button" class="sply-size-btn' + isSelected + '" data-pdp-size="' + sz + '">' + sz + '</button>';
        });
        sizesContainer.innerHTML = sHtml;

        sizesContainer.querySelectorAll('[data-pdp-size]').forEach(function(sBtn) {
          sBtn.addEventListener('click', function() {
            sizesContainer.querySelectorAll('[data-pdp-size]').forEach(function(b) { b.classList.remove('is-selected'); });
            sBtn.classList.add('is-selected');
            selectedPdpSize = sBtn.getAttribute('data-pdp-size');
            AudioFX.play('click');
          });
        });
      }

      // 6. Gallery & Thumbs
      var mainImg = document.getElementById('splyPdpMainImg');
      var thumbsContainer = document.getElementById('splyPdpThumbs');
      if (mainImg && product.images && product.images.length > 0) {
        mainImg.src = product.images[0];
        mainImg.alt = product.title;

        if (thumbsContainer) {
          var tHtml = '';
          product.images.forEach(function(imgSrc, tIdx) {
            var activeClass = tIdx === 0 ? ' is-active' : '';
            tHtml += '<div class="sply-pdp-thumb' + activeClass + '" data-pdp-img="' + imgSrc + '">' +
              '<img src="' + imgSrc + '" alt="Angle ' + (tIdx + 1) + '">' +
            '</div>';
          });
          thumbsContainer.innerHTML = tHtml;

          thumbsContainer.querySelectorAll('[data-pdp-img]').forEach(function(tBox) {
            tBox.addEventListener('click', function() {
              thumbsContainer.querySelectorAll('.sply-pdp-thumb').forEach(function(b) { b.classList.remove('is-active'); });
              tBox.classList.add('is-active');
              var newSrc = tBox.getAttribute('data-pdp-img');
              mainImg.src = newSrc;
              AudioFX.play('click');
            });
          });
        }
      }

      // 7. Add to Bag Button
      var addBtn = document.getElementById('splyPdpAddBtn');
      if (addBtn) {
        addBtn.onclick = function() {
          if (window.OutterspaceCart) {
            window.OutterspaceCart.add(product, selectedPdpSize, 1);
            closeModal();
          }
        };
      }

      // Open Modal
      modal.classList.add('is-open');
      document.body.classList.add('drawer-open');
      AudioFX.play('open');
    };

    // Magnifier Lens Setup
    setupMagnifier();

    // Accordions
    document.querySelectorAll('.sply-accordion-header').forEach(function(hdr) {
      hdr.addEventListener('click', function() {
        var item = hdr.closest('.sply-accordion-item');
        if (item) {
          item.classList.toggle('is-open');
          AudioFX.play('click');
        }
      });
    });
  }

  // Magnifier Lens Engine
  function setupMagnifier() {
    var container = document.getElementById('splyPdpImgContainer');
    var img = document.getElementById('splyPdpMainImg');
    var lens = document.getElementById('splyMagnifierLens');
    if (!container || !img || !lens) return;

    var ZOOM_LEVEL = 2.4;

    container.addEventListener('mouseenter', function() {
      lens.classList.add('is-active');
      lens.style.backgroundImage = "url('" + img.src + "')";
      lens.style.backgroundRepeat = "no-repeat";
      lens.style.backgroundSize = (img.width * ZOOM_LEVEL) + "px " + (img.height * ZOOM_LEVEL) + "px";
    });

    container.addEventListener('mouseleave', function() {
      lens.classList.remove('is-active');
    });

    container.addEventListener('mousemove', function(e) {
      var rect = container.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      lens.style.left = x + 'px';
      lens.style.top = y + 'px';

      // Lens background calculation
      var bgX = -(x * ZOOM_LEVEL - lens.offsetWidth / 2);
      var bgY = -(y * ZOOM_LEVEL - lens.offsetHeight / 2);
      lens.style.backgroundPosition = bgX + "px " + bgY + "px";
    });
  }

  // =========================================================================
  // 7. ENTER SCREEN / SPLASH SCREEN
  // =========================================================================
  function initEnterScreen() {
    var enterScreen = document.getElementById('splyEnterScreen');
    if (!enterScreen) return;

    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem('outterspace_enter_dismissed') === 'true';
    } catch(e) {}

    if (dismissed) {
      enterScreen.classList.add('is-hidden');
    }

    function dismiss(view) {
      enterScreen.classList.add('is-hidden');
      try {
        sessionStorage.setItem('outterspace_enter_dismissed', 'true');
      } catch(e) {}
      AudioFX.play('open');
      if (view && window.setViewMode) {
        window.setViewMode(view);
      }
    }

    document.querySelectorAll('[data-enter-go]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var v = btn.getAttribute('data-enter-go') || 'GRID';
        dismiss(v);
      });
    });
  }

  // =========================================================================
  // 8. NAVIGATION MENU DRAWER
  // =========================================================================
  function initMenuDrawer() {
    var drawer = document.getElementById('splyMenuDrawer');
    var burger = document.getElementById('splyMenuBurger');
    var scrim = drawer ? drawer.querySelector('.sply-menu-scrim') : null;
    var closeBtn = document.getElementById('splyMenuClose');

    function toggleMenu() {
      if (!drawer) return;
      var isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        drawer.classList.remove('is-open');
        if (burger) burger.classList.remove('is-active');
        document.body.classList.remove('drawer-open');
        AudioFX.play('close');
      } else {
        drawer.classList.add('is-open');
        if (burger) burger.classList.add('is-active');
        document.body.classList.add('drawer-open');
        AudioFX.play('open');
      }
    }

    if (burger) burger.addEventListener('click', toggleMenu);
    if (scrim) scrim.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
  }

  // =========================================================================
  // 9. APP INITIALIZER
  // =========================================================================
  function initApp() {
    initTheme();
    initZoom();
    initEnterScreen();
    initMenuDrawer();

    // Fetch or Load Products
    var productsData = (window.__OUTTERSPACE_PRODUCTS__ && window.__OUTTERSPACE_PRODUCTS__.products) || [];
    var productsMap = {};

    function processProducts(products) {
      products.forEach(function(p) {
        productsMap[p.id] = p;
      });

      initFilters(products);
      initPdp(productsMap);

      // Bind Card Clicks
      document.querySelectorAll('.sply-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
          // If clicked a quick size button
          if (e.target.closest('[data-quick-size]')) {
            e.stopPropagation();
            var size = e.target.getAttribute('data-quick-size');
            var pid = card.getAttribute('data-product-id');
            var prod = productsMap[pid];
            if (prod && window.OutterspaceCart) {
              window.OutterspaceCart.add(prod, size, 1);
            }
            return;
          }
          var pid = card.getAttribute('data-product-id');
          if (window.openPdp) {
            window.openPdp(pid);
          }
        });
      });

      // Bind Roam Card Clicks
      document.querySelectorAll('[data-roam-pdp]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var pid = btn.getAttribute('data-roam-pdp');
          if (window.openPdp) {
            window.openPdp(pid);
          }
        });
      });
    }

    if (productsData.length > 0) {
      processProducts(productsData);
    } else {
      // Fetch data/products.json
      fetch('data/products.json')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          window.__OUTTERSPACE_PRODUCTS__ = data;
          processProducts(data.products || []);
        })
        .catch(function(err) {
          console.warn('Products fetch error, using embedded data:', err);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})(window, document);
