/**
 * OUTTERSPACE STORE — Cart Management Engine
 * SPLY Studio Architecture & State Store
 */

(function(window, document) {
  'use strict';

  var STORAGE_KEY = 'outterspace_cart_v1';
  var FREE_SHIPPING_THRESHOLD = 150.00; // $150 threshold

  // State
  var cart = {
    items: [],
    subtotal: 0.00,
    itemCount: 0
  };

  // Audio helper
  function playSound(type) {
    if (window.AudioFX && window.AudioFX.play) {
      window.AudioFX.play(type);
    }
  }

  // Load cart from LocalStorage
  function loadCart() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        cart = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    recalculateCart();
  }

  // Save cart to LocalStorage
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
    window.dispatchEvent(new CustomEvent('outterspace:cart-updated', { detail: cart }));
    renderCart();
  }

  // Recalculate totals
  function recalculateCart() {
    var count = 0;
    var subtotal = 0;
    for (var i = 0; i < cart.items.length; i++) {
      var item = cart.items[i];
      count += item.quantity;
      subtotal += item.price * item.quantity;
    }
    cart.itemCount = count;
    cart.subtotal = Math.round(subtotal * 100) / 100;
  }

  // Add Item to Cart
  function addToCart(product, selectedSize, quantity) {
    quantity = quantity || 1;
    selectedSize = selectedSize || (product.sizes ? product.sizes[0] : 'OS');

    // Check if item already exists in cart with same size
    var existingIndex = -1;
    for (var i = 0; i < cart.items.length; i++) {
      if (cart.items[i].id === product.id && cart.items[i].size === selectedSize) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: product.price,
        size: selectedSize,
        color: product.color || 'Standard',
        image: (product.images && product.images.length > 0) ? product.images[0] : '',
        quantity: quantity
      });
    }

    recalculateCart();
    saveCart();
    playSound('add');
    openDrawer();
  }

  // Update Quantity
  function updateQuantity(index, newQty) {
    if (index >= 0 && index < cart.items.length) {
      if (newQty <= 0) {
        cart.items.splice(index, 1);
        playSound('remove');
      } else {
        cart.items[index].quantity = newQty;
        playSound('click');
      }
      recalculateCart();
      saveCart();
    }
  }

  // Remove Item
  function removeItem(index) {
    updateQuantity(index, 0);
  }

  // Clear Cart
  function clearCart() {
    cart.items = [];
    recalculateCart();
    saveCart();
  }

  // Open & Close Drawer
  function openDrawer() {
    var drawer = document.getElementById('splyCartDrawer');
    if (drawer) {
      drawer.classList.add('is-open');
      drawer.removeAttribute('hidden');
      document.body.classList.add('drawer-open');
      playSound('open');
    }
  }

  function closeDrawer() {
    var drawer = document.getElementById('splyCartDrawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
      playSound('close');
    }
  }

  // Render UI
  function renderCart() {
    // 1. Update Header Badge
    var badges = document.querySelectorAll('[data-sply-cart-count]');
    badges.forEach(function(badge) {
      badge.textContent = cart.itemCount;
      badge.style.display = cart.itemCount > 0 ? 'inline-flex' : 'none';
    });

    // 2. Free Shipping Bar
    var barMsg = document.getElementById('splyBarMsg');
    var barFill = document.getElementById('splyBarFill');
    if (barMsg && barFill) {
      var remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal;
      if (cart.subtotal >= FREE_SHIPPING_THRESHOLD) {
        barMsg.innerHTML = '<strong>FREE EXPRESS SHIPPING UNLOCKED</strong>';
        barFill.style.width = '100%';
      } else {
        var pct = Math.min(100, Math.round((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        barMsg.innerHTML = 'ADD <strong>$' + remaining.toFixed(2) + '</strong> FOR FREE EXPRESS SHIPPING';
        barFill.style.width = pct + '%';
      }
    }

    // 3. Render Items List
    var itemsContainer = document.getElementById('splyCartItems');
    var emptyContainer = document.getElementById('splyCartEmpty');
    var footContainer = document.getElementById('splyCartFoot');

    if (!itemsContainer) return;

    if (cart.items.length === 0) {
      itemsContainer.style.display = 'none';
      if (emptyContainer) emptyContainer.style.display = 'flex';
      if (footContainer) footContainer.style.display = 'none';
    } else {
      itemsContainer.style.display = 'flex';
      if (emptyContainer) emptyContainer.style.display = 'none';
      if (footContainer) footContainer.style.display = 'flex';

      var html = '';
      for (var i = 0; i < cart.items.length; i++) {
        var it = cart.items[i];
        html += '<li class="sply-cart-item">' +
          '<div class="sply-cart-item__media">' +
            '<img src="' + it.image + '" alt="' + it.title + '" loading="lazy">' +
          '</div>' +
          '<div class="sply-cart-item__info">' +
            '<div class="sply-cart-item__top">' +
              '<div>' +
                '<h4 class="sply-cart-item__title">' + it.title + '</h4>' +
                '<p class="sply-cart-item__meta">' + it.color + ' / SIZE: ' + it.size + '</p>' +
              '</div>' +
              '<button type="button" class="sply-cart-item__remove" data-cart-remove="' + i + '" title="Remove item">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>' +
            '<div class="sply-cart-item__bottom">' +
              '<div class="sply-qty-stepper">' +
                '<button type="button" class="sply-qty-btn" data-cart-qty-down="' + i + '">-</button>' +
                '<span class="sply-qty-val">' + it.quantity + '</span>' +
                '<button type="button" class="sply-qty-btn" data-cart-qty-up="' + i + '">+</button>' +
              '</div>' +
              '<span class="sply-cart-item__price">$' + (it.price * it.quantity).toFixed(2) + '</span>' +
            '</div>' +
          '</div>' +
        '</li>';
      }
      itemsContainer.innerHTML = html;

      // Bind quantity buttons & remove buttons
      itemsContainer.querySelectorAll('[data-cart-remove]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = parseInt(btn.getAttribute('data-cart-remove'), 10);
          removeItem(idx);
        });
      });

      itemsContainer.querySelectorAll('[data-cart-qty-down]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = parseInt(btn.getAttribute('data-cart-qty-down'), 10);
          updateQuantity(idx, cart.items[idx].quantity - 1);
        });
      });

      itemsContainer.querySelectorAll('[data-cart-qty-up]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = parseInt(btn.getAttribute('data-cart-qty-up'), 10);
          updateQuantity(idx, cart.items[idx].quantity + 1);
        });
      });
    }

    // 4. Update Subtotal
    var subtotalEl = document.getElementById('splyCartSubtotal');
    if (subtotalEl) {
      subtotalEl.textContent = '$' + cart.subtotal.toFixed(2);
    }
  }

  // Setup Event Listeners
  function initCart() {
    loadCart();

    // Trigger buttons
    document.querySelectorAll('[data-sply-cart-trigger]').forEach(function(btn) {
      btn.addEventListener('click', openDrawer);
    });

    document.querySelectorAll('[data-sply-cart-close]').forEach(function(btn) {
      btn.addEventListener('click', closeDrawer);
    });

    // Checkout Simulator
    var checkoutBtn = document.getElementById('splyCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        if (cart.items.length === 0) return;
        playSound('click');
        alert('Proceeding to Secure Outterspace Checkout with ' + cart.itemCount + ' item(s) • Total: $' + cart.subtotal.toFixed(2));
      });
    }

    // Express Checkout
    document.querySelectorAll('.sply-express-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var provider = btn.textContent.trim();
        playSound('click');
        alert('Express checkout with ' + provider + ' • Total: $' + cart.subtotal.toFixed(2));
      });
    });
  }

  // Export API
  window.OutterspaceCart = {
    init: initCart,
    add: addToCart,
    update: updateQuantity,
    remove: removeItem,
    clear: clearCart,
    open: openDrawer,
    close: closeDrawer,
    getCart: function() { return cart; }
  };

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }

})(window, document);
