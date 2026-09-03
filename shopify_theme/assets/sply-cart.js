// Client-Side Cart Fallback for Offline / Static / Vercel hosting
(function() {
  var CART_STORAGE_KEY = 'sply_local_cart_v2';
  
  function getLocalCart() {
    try {
      var d = localStorage.getItem(CART_STORAGE_KEY);
      if (d) return JSON.parse(d);
    } catch(e) {}
    return {
      token: 'sply_live_cart',
      note: null,
      attributes: {},
      original_total_price: 0,
      total_price: 0,
      total_discount: 0,
      total_weight: 0.0,
      item_count: 0,
      items: [],
      requires_shipping: true,
      currency: 'NGN',
      items_subtotal_price: 0
    };
  }

  function saveLocalCart(c) {
    var count = 0, total = 0;
    (c.items || []).forEach(function(it) {
      count += it.quantity;
      total += (it.final_line_price || (it.price * it.quantity));
    });
    c.item_count = count;
    c.total_price = total;
    c.original_total_price = total;
    c.items_subtotal_price = total;
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(c)); } catch(e) {}
    
    // Sync cart count badges in header
    var badges = document.querySelectorAll('[data-cart-count], .sply-cart-count');
    badges.forEach(function(el) {
      el.textContent = count;
      el.hidden = (count === 0);
    });
    return c;
  }

  var origFetch = window.fetch;
  window.fetch = function(url, opts) {
    if (typeof url === 'string') {
      // 1. GET /cart.js
      if (url === '/cart.js' || url.indexOf('/cart.js?') === 0) {
        return origFetch(url, opts).then(function(r) {
          if (!r.ok) throw new Error('API fallback');
          return r;
        }).catch(function() {
          var c = getLocalCart();
          return new Response(JSON.stringify(c), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }

      // 2. POST /cart/add.js
      if (url === '/cart/add.js' && opts && opts.method === 'POST') {
        return origFetch(url, opts).then(function(r) {
          if (!r.ok) throw new Error('API fallback');
          return r;
        }).catch(function() {
          var body = {};
          try { body = JSON.parse(opts.body); } catch(e) {}
          var items = body.items || [];
          var vid = items[0] && items[0].id;
          var qty = (items[0] && items[0].quantity) || 1;

          var pdp = document.querySelector('[data-sply-pdp]');
          var title = pdp ? (pdp.querySelector('[data-sply-name]') || {}).textContent || 'Product' : 'Outterspace Product';
          title = title.trim();

          var priceEl = pdp ? pdp.querySelector('[data-sply-price]') : null;
          var price = 28600000;
          if (priceEl) {
            var raw = (priceEl.textContent.split('/')[0] || priceEl.textContent).replace(/[^0-9]/g, '');
            if (raw) {
              var num = parseInt(raw, 10);
              // if in naira (e.g. 286000), multiply by 100 for cents/kobo
              price = num > 10000 ? num * 100 : num * 100;
            }
          }

          var activeSlide = pdp ? (pdp.querySelector('.sply-pdp__slide.is-active img') || pdp.querySelector('.sply-pdp__slide img')) : null;
          var img = activeSlide ? activeSlide.getAttribute('src') || '' : '';

          var sizeBtn = pdp ? (pdp.querySelector('.sply-size[data-variant-id="' + vid + '"]') || pdp.querySelector('.sply-size.is-active') || pdp.querySelector('.sply-size')) : null;
          var sizeTitle = sizeBtn ? sizeBtn.textContent.trim() : 'M';

          var c = getLocalCart();
          var existing = c.items.find(function(it) { return it.id == vid; });
          if (existing) {
            existing.quantity += qty;
            existing.final_line_price = existing.quantity * existing.price;
          } else {
            c.items.push({
              id: vid || Date.now(),
              key: String(vid || Date.now()) + ':1',
              product_title: title,
              title: title + ' - ' + sizeTitle,
              variant_title: sizeTitle,
              price: price,
              final_line_price: price * qty,
              original_line_price: price * qty,
              quantity: qty,
              image: img,
              featured_image: { url: img },
              url: window.location.pathname
            });
          }
          saveLocalCart(c);
          return new Response(JSON.stringify(c), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }

      // 3. POST /cart/change.js
      if (url === '/cart/change.js' && opts && opts.method === 'POST') {
        return origFetch(url, opts).then(function(r) {
          if (!r.ok) throw new Error('API fallback');
          return r;
        }).catch(function() {
          var body = {};
          try { body = JSON.parse(opts.body); } catch(e) {}
          var c = getLocalCart();
          var key = body.id;
          var qty = parseInt(body.quantity, 10);
          if (isNaN(qty) || qty <= 0) {
            c.items = c.items.filter(function(it) { return it.key !== key && it.id != key; });
          } else {
            var it = c.items.find(function(x) { return x.key === key || x.id == key; });
            if (it) {
              it.quantity = qty;
              it.final_line_price = it.quantity * it.price;
            }
          }
          saveLocalCart(c);
          return new Response(JSON.stringify(c), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }

      // 3.5. POST or GET /cart/clear.js
      if (url.indexOf('/cart/clear.js') > -1) {
        return origFetch(url, opts).then(function(r) {
          if (!r.ok) throw new Error('API fallback');
          return r;
        }).catch(function() {
          var c = getLocalCart();
          c.items = [];
          saveLocalCart(c);
          return new Response(JSON.stringify(c), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }

      // 4. Recommendations
      if (url.indexOf('/recommendations/products.json') > -1) {
        return origFetch(url, opts).then(function(r) {
          if (!r.ok) throw new Error('API fallback');
          return r;
        }).catch(function() {
          return new Response(JSON.stringify({ products: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }
    }
    return origFetch.apply(this, arguments);
  };
})();

(function(){var drawer=document.querySelector("[data-sply-cart]");if(!drawer)return;var itemsEl=drawer.querySelector("[data-sply-cart-items]"),lastItemsSig=itemsEl&&itemsEl.getAttribute("data-cart-sig")||"";function sizeImg(u){return u&&u+(u.indexOf("?")>-1?"&":"?")+"width=200"}function prewarm(){fetch("/cart.js",{headers:{Accept:"application/json"},credentials:"same-origin"}).then(function(r){return r.json()}).then(function(c){var items=c.items||[];if(items.forEach(function(it){if(it.image){var im=new Image;im.src=sizeImg(it.image)}}),upsellEnabled&&items.length){var fid=items[0].product_id;recCache[fid]||fetch("/recommendations/products.json?product_id="+fid+"&limit=10&intent=related",{headers:{Accept:"application/json"},credentials:"same-origin"}).then(function(r){return r.json()}).then(function(d){var m=mapRecs(d&&d.products);recCache[fid]=m,warmImgs(m)}).catch(function(){})}}).catch(function(){})}function warmImgs(arr){(arr||[]).forEach(function(p){if(p&&p.image){var im=new Image;im.src=sizeImg(p.image)}})}function warmAll(){prewarm(),warmImgs(fallbackData)}"requestIdleCallback"in window?requestIdleCallback(warmAll):window.setTimeout(warmAll,800);var emptyEl=drawer.querySelector("[data-sply-cart-empty]"),footEl=drawer.querySelector("[data-sply-cart-foot]"),totalEl=drawer.querySelector("[data-sply-cart-total]"),barEnabled=drawer.getAttribute("data-bar-enabled")==="true",barThreshold=parseInt(drawer.getAttribute("data-bar-threshold"),10)||0,barReward=drawer.getAttribute("data-bar-reward")||"free shipping",barEl=drawer.querySelector("[data-sply-bar]"),barMsg=drawer.querySelector("[data-sply-bar-msg]"),barFill=drawer.querySelector("[data-sply-bar-fill]"),upsellEnabled=drawer.getAttribute("data-upsell-enabled")==="true",upsellLimit=parseInt(drawer.getAttribute("data-upsell-limit"),10)||6,upsellEl=drawer.querySelector("[data-sply-upsell]"),upsellTrack=drawer.querySelector("[data-sply-upsell-track]"),upsellToggle=drawer.querySelector("[data-sply-upsell-toggle]"),UPSELL_KEY="sply-upsell-collapsed";function applyUpsellCollapsed(){var collapsed=!1;try{collapsed=localStorage.getItem(UPSELL_KEY)==="1"}catch(e){}upsellEl&&upsellEl.classList.toggle("is-collapsed",collapsed),upsellToggle&&upsellToggle.setAttribute("aria-expanded",collapsed?"false":"true")}applyUpsellCollapsed();var fallbackData=(function(){var el=drawer.querySelector("[data-sply-upsell-fallback]");if(!el)return[];try{return JSON.parse(el.textContent)||[]}catch(e){return[]}})(),recCache={},upsellSig="",syncEl=drawer.querySelector("[data-sply-sync]"),pending=0;function syncStart(){pending++,syncEl&&syncEl.classList.add("is-active")}function syncEnd(){pending=Math.max(0,pending-1),!pending&&syncEl&&syncEl.classList.remove("is-active")}var qtyTimers={},currency=window.Shopify&&Shopify.currency&&Shopify.currency.active||"USD";function makeFmt(min){try{return new Intl.NumberFormat(void 0,{style:"currency",currency:currency,minimumFractionDigits:min,maximumFractionDigits:2})}catch(e){return{format:function(v){return"$"+(min?v.toFixed(2):String(v))}}}}var fmtWhole=makeFmt(0),fmtCents=makeFmt(2);function money(cents){
  cents = cents || 0;
  var ngn = Math.round(cents / 100);
  var usd = Math.round(ngn / 1500);
  return '₦' + ngn.toLocaleString('en-US') + ' / $' + usd;
}function esc(t){return(t==null?"":String(t)).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}function setCount(n){for(var els=document.querySelectorAll("[data-cart-count]"),i=0;i<els.length;i++)els[i].textContent=n,els[i].hidden=!n}var closeT=null;function openDrawer(expectItems){closeT&&(window.clearTimeout(closeT),closeT=null),drawer.classList.remove("is-closing"),expectItems&&emptyEl&&(emptyEl.hidden=!0),drawer.hidden=!1,document.documentElement.classList.add("sply-cart-open"),window.dispatchEvent(new CustomEvent("sply:overlayopen",{detail:"cart"})),refresh(),window.__splyWalletPatch&&(window.__splyWalletPatch(),requestAnimationFrame(function(){window.dispatchEvent(new Event("resize")),window.__splyWalletPatch()}),[120,350,700,1200,1800].forEach(function(d){window.setTimeout(function(){window.dispatchEvent(new Event("resize")),window.__splyWalletPatch()},d)}))}window.addEventListener("sply:overlayopen",function(e){e.detail!=="cart"&&!drawer.hidden&&closeDrawer()});function closeDrawer(){drawer.hidden||drawer.classList.contains("is-closing")||(drawer.classList.add("is-closing"),document.documentElement.classList.remove("sply-cart-open"),closeT=window.setTimeout(function(){drawer.hidden=!0,drawer.classList.remove("is-closing"),closeT=null},520))}function render(cart){if(setCount(cart.item_count),!cart.items||!cart.items.length){lastItemsSig!==""&&(itemsEl.innerHTML="",lastItemsSig=""),itemsEl.hidden=!0,emptyEl.hidden=!1,footEl.hidden=!0,renderBar(cart),renderUpsell(cart);return}itemsEl.hidden=!1,emptyEl.hidden=!0,footEl.hidden=!1;var sig=cart.items.map(function(it){return it.key+":"+it.quantity}).join(";");if(sig===lastItemsSig){totalEl.textContent=money(cart.total_price),renderBar(cart),renderUpsell(cart);return}lastItemsSig=sig;var html="";cart.items.forEach(function(it){var hasVar=it.variant_title&&it.variant_title!=="Default Title";html+='<li class="sply-citem sply-border" data-key="'+esc(it.key)+'"><a class="sply-citem__media" href="'+esc(it.url)+'">'+(it.image?'<img src="'+esc(sizeImg(it.image))+'" alt="" width="120" height="120" loading="eager" decoding="async" fetchpriority="high">':"")+'</a><span class="sply-citem__info"><a class="sply-citem__name" href="'+esc(it.url)+'">'+esc(it.product_title)+"</a>"+(hasVar?'<span class="sply-citem__variant sply-muted">'+esc(it.variant_title)+"</span>":"")+'<span class="sply-citem__price">'+money(it.final_line_price)+'</span></span><span class="sply-citem__qty"><button type="button" class="sply-citem__step" data-sply-qty="'+esc(it.key)+'" data-delta="-1" aria-label="Decrease">\u2212</button><span class="sply-citem__n">'+it.quantity+'</span><button type="button" class="sply-citem__step" data-sply-qty="'+esc(it.key)+'" data-delta="1" aria-label="Increase">+</button></span></li>'}),itemsEl.innerHTML=html,totalEl.textContent=money(cart.total_price),renderBar(cart),renderUpsell(cart)}function renderBar(cart){if(!barEnabled||!barEl||barThreshold<=0){barEl&&(barEl.hidden=!0);return}if(!cart.items||!cart.items.length){barEl.hidden=!0;return}barEl.hidden=!0;var total=cart.total_price,pct=Math.max(0,Math.min(100,total/barThreshold*100));barFill&&(barFill.style.width=pct+"%"),total>=barThreshold?(barEl.classList.add("is-met"),barMsg&&(barMsg.textContent="You've unlocked "+barReward+".")):(barEl.classList.remove("is-met"),barMsg&&(barMsg.innerHTML='You\'re <strong class="sply-drawer__bar-amt">'+money(barThreshold-total)+" away</strong> from "+barReward+"."))}function mapRecs(arr){return(arr||[]).map(function(p){for(var v=null,vs=p.variants||[],i=0;i<vs.length;i++)if(vs[i].available){v=vs[i];break}return!v&&vs.length&&(v=vs[0]),{id:p.id,title:p.title,price:p.price,image:p.featured_image||p.images&&p.images[0]||"",variant:v?v.id:0,available:!!(v&&v.available),url:p.url||"/products/"+(p.handle||""),multi:vs.length>1}})}function paintUpsell(items){if(!items.length){upsellEl.hidden=!0,upsellSig="";return}upsellEl.hidden=!1;var sig=items.map(function(p){return p.variant}).join(",");if(sig!==upsellSig){upsellSig=sig;var html="";items.forEach(function(p,i){var media=p.image?'<img src="'+esc(sizeImg(p.image))+'" alt="" loading="eager" decoding="async">':"",cta=p.multi?'<a class="sply-upsell__add" href="'+esc(p.url)+'">View</a>':'<button type="button" class="sply-upsell__add" data-sply-upsell-add="'+esc(p.variant)+'" aria-label="Add '+esc(p.title)+'"><span class="sply-upsell__add-label">Add</span></button>';html+='<div class="sply-upsell" style="animation-delay:'+i*55+'ms"><a class="sply-upsell__media" href="'+esc(p.url)+'">'+media+'</a><a class="sply-upsell__name" href="'+esc(p.url)+'">'+esc(p.title)+'</a><span class="sply-upsell__price">'+money(p.price)+"</span>"+cta+"</div>"}),upsellTrack.innerHTML=html}}function renderUpsell(cart){if(!upsellEnabled||!upsellEl)return;if(!cart.items||!cart.items.length){upsellEl.hidden=!0;return}var cartIds=cart.items.map(function(it){return it.product_id}),firstId=cart.items[0].product_id;function done(recs){var items=recs.filter(function(p){return cartIds.indexOf(p.id)<0&&p.variant&&p.available});items.length||(items=fallbackData.filter(function(p){return cartIds.indexOf(p.id)<0&&p.variant&&p.available})),paintUpsell(items.slice(0,upsellLimit))}if(recCache[firstId]){done(recCache[firstId]);return}fetch("/recommendations/products.json?product_id="+firstId+"&limit=10&intent=related",{headers:{Accept:"application/json"},credentials:"same-origin"}).then(function(r){return r.json()}).then(function(d){var m=mapRecs(d&&d.products);recCache[firstId]=m,warmImgs(m),done(m)}).catch(function(){recCache[firstId]=[],done([])})}function refresh(){fetch("/cart.js",{headers:{Accept:"application/json"},credentials:"same-origin"}).then(function(r){return r.json()}).then(render).catch(function(){})}function changeQty(key,qty){syncStart(),fetch("/cart/change.js",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({id:key,quantity:qty})}).then(function(r){return r.json()}).then(render).catch(function(){}).then(syncEnd)}function stepQty(key,li,delta){var nEl=li.querySelector(".sply-citem__n"),cur=nEl&&parseInt(nEl.textContent,10)||0,next=Math.max(0,cur+delta);nEl&&(nEl.textContent=next),li.classList.add("is-updating"),window.clearTimeout(qtyTimers[key]),qtyTimers[key]=window.setTimeout(function(){changeQty(key,next)},280)}function setH(root,sel,h){var el=root&&root.querySelector(sel);el&&(el.hidden=h)}function closeSizechart(modal){!modal||modal.hidden||modal.classList.contains("is-closing")||(modal.classList.add("is-closing"),window.setTimeout(function(){modal.hidden=!0,modal.classList.remove("is-closing")},280))}var reduceMo=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function scrambleTo(el,target){if(el){if(target=target==null?"":String(target),el._sIv&&(window.clearInterval(el._sIv),el._sIv=null),reduceMo){el.textContent=target;return}for(var glyphs="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",n=target.length,ends=[],i=0;i<n;i++){var c=target.charAt(i);ends.push(c===" "||c==="-"||c==="/"||c==="."?0:Math.round(i*1.4)+4+Math.floor(Math.random()*5))}var frame=0;el._sIv=window.setInterval(function(){for(var out="",done=0,j=0;j<n;j++){var ch=target.charAt(j);ends[j]===0||frame>=ends[j]?(out+=ch,done++):out+=glyphs.charAt(Math.floor(Math.random()*glyphs.length))}el.textContent=out,frame++,done===n&&(window.clearInterval(el._sIv),el._sIv=null,el.textContent=target)},28)}}function expandBuy(pdpEl){setH(pdpEl,"[data-sply-name]",!0),setH(pdpEl,"[data-sply-buyhead]",!1),setH(pdpEl,"[data-sply-buy]",!0),setH(pdpEl,"[data-sply-sizes]",!1),setH(pdpEl,"[data-sply-info-toggle]",!1),pdpEl&&(pdpEl.offsetWidth,pdpEl.classList.add("is-buying"));var hlabel=pdpEl&&pdpEl.querySelector(".sply-pdp__hlabel");hlabel&&(hlabel.getAttribute("data-label")||hlabel.setAttribute("data-label",hlabel.textContent),scrambleTo(hlabel,hlabel.getAttribute("data-label")))}function hardCollapse(pdpEl){pdpEl&&pdpEl.classList.remove("is-info"),setH(pdpEl,"[data-sply-name]",!1),setH(pdpEl,"[data-sply-buyhead]",!0),setH(pdpEl,"[data-sply-buy]",!1),setH(pdpEl,"[data-sply-price]",!1),setH(pdpEl,"[data-sply-sizes]",!0),setH(pdpEl,"[data-sply-info-toggle]",!0),setH(pdpEl,"[data-sply-desc]",!0)}function collapseBuy(pdpEl){if(pdpEl&&pdpEl.classList.contains("is-buying")){var hlabel=pdpEl.querySelector(".sply-pdp__hlabel"),nameEl=pdpEl.querySelector("[data-sply-name]"),plus=pdpEl.querySelector("[data-sply-buy]"),title=nameEl?nameEl.textContent:"";pdpEl.classList.remove("is-buying"),hlabel&&scrambleTo(hlabel,title),window.setTimeout(function(){if(setH(pdpEl,"[data-sply-sizes]",!0),setH(pdpEl,"[data-sply-buy]",!1),plus)try{plus.animate([{opacity:0,transform:"scale(.85)"},{opacity:1,transform:"none"}],{duration:340,easing:"cubic-bezier(.22,1,.36,1)"})}catch(e){}},200),window.setTimeout(function(){setH(pdpEl,"[data-sply-name]",!1),setH(pdpEl,"[data-sply-buyhead]",!0),setH(pdpEl,"[data-sply-info-toggle]",!0),setH(pdpEl,"[data-sply-desc]",!0),hlabel&&(hlabel.textContent=hlabel.getAttribute("data-label")||hlabel.textContent)},470)}else hardCollapse(pdpEl)}function flipPlus(pdpEl,toX,firstRect){var plus=pdpEl.querySelector("[data-sply-buy]"),bx=pdpEl.querySelector("[data-sply-buy-close]");if(plus){plus._flip&&(plus._flip.cancel(),plus._flip=null);var opt={duration:460,easing:"cubic-bezier(.22,1,.36,1)",fill:"forwards"};if(toX&&bx){var first=firstRect||plus.getBoundingClientRect(),tgt=bx.getBoundingClientRect(),pr=pdpEl.getBoundingClientRect();plus.style.position="absolute",plus.style.margin="0",plus.style.zIndex="6",plus.style.transform="",plus.style.left=tgt.left+tgt.width/2-pr.left-first.width/2+"px",plus.style.top=tgt.top+tgt.height/2-pr.top-first.height/2+"px";var now=plus.getBoundingClientRect(),dx=first.left-now.left,dy=first.top-now.top;plus._flip=plus.animate([{transform:"translate("+dx+"px,"+dy+"px) rotate(0deg)"},{transform:"translate(0px,0px) rotate(45deg)"}],opt)}else{var firstE=plus.getBoundingClientRect();plus.style.position="",plus.style.margin="",plus.style.zIndex="",plus.style.left="",plus.style.top="",plus.style.transform="";var nowE=plus.getBoundingClientRect(),dxE=firstE.left-nowE.left,dyE=firstE.top-nowE.top;plus._flip=plus.animate([{transform:"translate("+dxE+"px,"+dyE+"px) rotate(45deg)"},{transform:"translate(0px,0px) rotate(0deg)"}],opt)}}}function enterInfo(pdpEl){if(pdpEl){var simple=pdpEl.classList.contains("sply-pdp--simple"),plusE=pdpEl.querySelector("[data-sply-buy]"),soldout=simple&&!plusE,hlabel=pdpEl.querySelector(".sply-pdp__hlabel"),flipFirst=null;if(simple&&plusE)flipFirst=plusE.getBoundingClientRect(),setH(pdpEl,"[data-sply-name]",!0),setH(pdpEl,"[data-sply-buyhead]",!1);else if(soldout){var nmIn=pdpEl.querySelector("[data-sply-name]");setH(pdpEl,"[data-sply-name]",!0),setH(pdpEl,"[data-sply-soldout]",!0),setH(pdpEl,"[data-sply-buyhead]",!1),hlabel&&nmIn&&(hlabel.textContent=nmIn.textContent),pdpEl.offsetWidth,pdpEl.classList.add("is-buying")}setH(pdpEl,"[data-sply-price]",!0),setH(pdpEl,"[data-sply-sizes]",!0),setH(pdpEl,"[data-sply-info-toggle]",!0),setH(pdpEl,"[data-sply-desc]",!1),pdpEl.classList.add("is-info"),hlabel&&scrambleTo(hlabel,"Information"),simple&&plusE&&flipPlus(pdpEl,!0,flipFirst);var dEl=pdpEl.querySelector("[data-sply-desc]");dEl&&(dEl.scrollTop=0,dEl.classList.remove("is-end"),dEl.classList.toggle("is-scroll",dEl.scrollHeight>dEl.clientHeight+2),dEl._scrollBound||(dEl._scrollBound=!0,dEl.addEventListener("scroll",function(){dEl.classList.toggle("is-end",dEl.scrollTop+dEl.clientHeight>=dEl.scrollHeight-4)})))}}function exitInfo(pdpEl){if(pdpEl){var simple=pdpEl.classList.contains("sply-pdp--simple"),plusE=pdpEl.querySelector("[data-sply-buy]"),soldout=simple&&!plusE,hlabel=pdpEl.querySelector(".sply-pdp__hlabel");if(setH(pdpEl,"[data-sply-desc]",!0),pdpEl.classList.remove("is-info"),simple&&plusE)setH(pdpEl,"[data-sply-buyhead]",!0),setH(pdpEl,"[data-sply-name]",!1),setH(pdpEl,"[data-sply-price]",!1),setH(pdpEl,"[data-sply-info-toggle]",!1),flipPlus(pdpEl,!1);else if(soldout){var nmOut=pdpEl.querySelector("[data-sply-name]"),titleOut=nmOut?nmOut.textContent:"";pdpEl.classList.remove("is-buying"),hlabel&&scrambleTo(hlabel,titleOut),window.setTimeout(function(){setH(pdpEl,"[data-sply-price]",!1),setH(pdpEl,"[data-sply-soldout]",!1),setH(pdpEl,"[data-sply-info-toggle]",!1)},150),window.setTimeout(function(){setH(pdpEl,"[data-sply-buyhead]",!0),setH(pdpEl,"[data-sply-name]",!1),hlabel&&(hlabel.textContent=hlabel.getAttribute("data-label")||hlabel.textContent)},470)}else setH(pdpEl,"[data-sply-sizechart]",!1),setH(pdpEl,"[data-sply-price]",!1),setH(pdpEl,"[data-sply-sizes]",!1),setH(pdpEl,"[data-sply-info-toggle]",!1),hlabel&&scrambleTo(hlabel,hlabel.getAttribute("data-label")||"Select size")}}function addToBag(pdpEl,id){if(!id)return;var hasSizes=!!(pdpEl&&pdpEl.querySelector("[data-sply-sizes]"));pdpEl&&pdpEl.classList.remove("is-buying","is-collapsing");var plusBtn=pdpEl&&pdpEl.querySelector("[data-sply-buy]");hasSizes?(setH(pdpEl,"[data-sply-name]",!0),setH(pdpEl,"[data-sply-buyhead]",!0),setH(pdpEl,"[data-sply-sizes]",!0),setH(pdpEl,"[data-sply-info-toggle]",!0),setH(pdpEl,"[data-sply-adding]",!1)):(setH(pdpEl,"[data-sply-name]",!0),setH(pdpEl,"[data-sply-adding]",!1),plusBtn&&plusBtn.classList.add("is-loading"));function restore(){setH(pdpEl,"[data-sply-adding]",!0),hasSizes?hardCollapse(pdpEl):(setH(pdpEl,"[data-sply-name]",!1),plusBtn&&plusBtn.classList.remove("is-loading"))}fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({items:[{id:Number(id),quantity:1}]})}).then(function(r){return r.json().then(function(data){return{ok:r.ok,status:r.status,data:data}},function(){return{ok:r.ok,status:r.status,data:null}})}).then(function(res){if(res.ok){restore(),openDrawer(!0);return}try{console.warn("[SPLY] add to cart failed:",res.status,res.data)}catch(e){}var msg=res.data&&(res.data.description||res.data.message)||"Unavailable",addingEl=pdpEl&&pdpEl.querySelector("[data-sply-adding]");plusBtn&&plusBtn.classList.remove("is-loading"),addingEl&&(addingEl.textContent=msg,addingEl.classList.add("is-error")),window.setTimeout(function(){addingEl&&(addingEl.classList.remove("is-error"),addingEl.textContent="Adding"),restore()},2e3)}).catch(function(){restore()})}document.addEventListener("click",function(e){var open=e.target.closest("[data-sply-cart-open]");if(open){e.preventDefault(),drawer.hidden?openDrawer():closeDrawer();return}var close=e.target.closest("[data-sply-cart-close]");if(close){e.preventDefault(),closeDrawer();return}var upToggle=e.target.closest("[data-sply-upsell-toggle]");if(upToggle){var nowCollapsed=!upsellEl.classList.contains("is-collapsed");upsellEl.classList.toggle("is-collapsed",nowCollapsed),upToggle.setAttribute("aria-expanded",nowCollapsed?"false":"true");try{localStorage.setItem(UPSELL_KEY,nowCollapsed?"1":"0")}catch(e2){}return}var upAdd=e.target.closest("[data-sply-upsell-add]");if(upAdd){e.preventDefault();var uvid=upAdd.getAttribute("data-sply-upsell-add");if(!uvid||uvid==="0")return;upAdd.classList.add("is-loading"),syncStart(),fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({items:[{id:Number(uvid),quantity:1}]})}).then(function(r){return r.json()}).then(function(){refresh()}).catch(function(){upAdd.classList.remove("is-loading")}).then(syncEnd);return}var buy=e.target.closest("[data-sply-buy]");if(buy){e.preventDefault();var form0=buy.closest("form"),pdp0=buy.closest("[data-sply-pdp]");if(pdp0.classList.contains("sply-pdp--simple")&&pdp0.classList.contains("is-info")){exitInfo(pdp0);return}if(form0&&form0.querySelector("[data-sply-sizes]"))expandBuy(pdp0);else{var h0=form0&&form0.querySelector("[data-sply-variant-id]");addToBag(pdp0,h0&&h0.value)}return}var bclose=e.target.closest("[data-sply-buy-close]");if(bclose){e.preventDefault();var pdpX=bclose.closest("[data-sply-pdp]");pdpX&&pdpX.classList.contains("is-info")?exitInfo(pdpX):collapseBuy(pdpX);return}var infoT=e.target.closest("[data-sply-info-toggle]");if(infoT){e.preventDefault(),enterInfo(infoT.closest("[data-sply-pdp]"));return}var scOpen=e.target.closest("[data-sply-sizechart]");if(scOpen){e.preventDefault();var mo=scOpen.closest("[data-sply-pdp]").querySelector("[data-sply-sizechart-modal]");mo&&(mo.classList.remove("is-closing"),mo.hidden=!1);return}var scClose=e.target.closest("[data-sply-sizechart-close]");if(scClose){e.preventDefault(),closeSizechart(scClose.closest("[data-sply-pdp]").querySelector("[data-sply-sizechart-modal]"));return}var size=e.target.closest(".sply-size");if(size){if(size.getAttribute("data-available")==="false")return;var form=size.closest("form"),hid=form&&form.querySelector("[data-sply-variant-id]"),vid=size.getAttribute("data-variant-id");hid&&vid&&(hid.value=vid),addToBag(size.closest("[data-sply-pdp]"),vid);return}var step=e.target.closest("[data-sply-qty]");if(step){var li=step.closest("[data-key]");li&&stepQty(step.getAttribute("data-sply-qty"),li,parseInt(step.getAttribute("data-delta"),10));return}}),document.addEventListener("submit",function(e){var form=e.target;if(!(!form||!form.querySelector||!form.querySelector("[data-sply-add]"))){e.preventDefault();var hid=form.querySelector("[data-sply-variant-id]");addVariant(hid&&hid.value,form.querySelector("[data-sply-add]"))}}),document.addEventListener("keydown",function(e){if(e.key==="Escape"){var openModal=document.querySelector("[data-sply-sizechart-modal]:not([hidden])");if(openModal){closeSizechart(openModal);return}drawer.hidden||closeDrawer()}});function reserveBuyPanel(){var pdp=document.querySelector("[data-sply-pdp]");if(pdp){var wrap=pdp.querySelector(".sply-pdp__buy"),desc=pdp.querySelector("[data-sply-desc]");if(!(!wrap||!desc)){var cs=getComputedStyle(wrap),minH=parseFloat(cs.minHeight)||132,padTop=parseFloat(cs.paddingTop)||22;desc.style.maxHeight=Math.max(64,Math.round(minH-padTop-12))+"px"}}}reserveBuyPanel(),document.addEventListener("sply:reserve",reserveBuyPanel);var rbpT=null;window.addEventListener("resize",function(){window.clearTimeout(rbpT),rbpT=window.setTimeout(reserveBuyPanel,200)})})(),(function(){var VER="sply-wallet-v5",MAX_BUTTONS=3;try{console.log("[SPLY wallet patch "+VER+" active]")}catch(e){}function hosts(){return document.querySelectorAll("shopify-accelerated-checkout-cart, shopify-accelerated-checkout, shopify-payment-terms")}function slottedButton(cell){var slot=cell.querySelector&&cell.querySelector("slot");if(slot&&slot.assignedElements){var els=slot.assignedElements();if(els.length)return els[0]}return cell.firstElementChild||null}function isRendered(cell){var btn=slottedButton(cell);if(!btn)return!1;var r=btn.getBoundingClientRect();return r.width>4&&r.height>4}function applyLayout(host){if(host.shadowRoot){var grid=host.shadowRoot.querySelector(".wallet-cart-grid");if(grid){var cells=Array.prototype.slice.call(grid.children),anyRendered=cells.some(isRendered),kept=0;cells.forEach(function(cell){var keep=anyRendered?isRendered(cell)&&kept<MAX_BUTTONS:!0;if(keep){cell.style.removeProperty("display"),cell.style.setProperty("width","100%","important"),cell.style.setProperty("min-width","0","important");var btn=slottedButton(cell);btn&&(btn.style.setProperty("width","100%","important"),btn.style.setProperty("max-width","none","important")),kept++}else cell.style.setProperty("display","none","important")}),grid.style.setProperty("display","grid","important"),grid.style.setProperty("grid-auto-flow","column","important"),grid.style.setProperty("grid-auto-columns","1fr","important"),grid.style.removeProperty("grid-template-columns"),grid.style.setProperty("container-type","normal","important"),grid.style.setProperty("gap","8px","important"),grid.style.setProperty("width","100%","important"),grid.style.setProperty("max-width","none","important")}}}function observe(host){if(!(!host.shadowRoot||host._spwObs)){host._spwObs=!0;try{new MutationObserver(function(){host._spwP||(host._spwP=!0,requestAnimationFrame(function(){host._spwP=!1,applyLayout(host)}))}).observe(host.shadowRoot,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["hidden","style","class"]})}catch(e){}}}function patch(){hosts().forEach(function(host){if(host.shadowRoot){var existing=host.shadowRoot.querySelectorAll("[data-sply-wallet]"),current=!1;if(existing.forEach(function(el){el.getAttribute("data-sply-wallet")===VER?current=!0:el.remove()}),!current){var st=document.createElement("style");st.setAttribute("data-sply-wallet",VER),st.textContent=':host,.wallet-button-fade-in,.wallet-button-wrapper,.accelerated-checkout-button-container,.wallet-cart-grid,.wallet-cart-button{width:100%!important;max-width:none!important;box-sizing:border-box!important;container-type:normal!important;}.wallet-cart-grid,.wallet-cart-grid:not(.wallet-cart-grid--horizontal){display:grid!important;grid-auto-flow:column!important;grid-auto-columns:1fr!important;grid-template-columns:none!important;gap:8px!important;margin:0!important;padding:0!important;container-type:normal!important;--shopify-accelerated-checkout-inline-alignment:stretch!important;--shopify-accelerated-checkout-row-gap:8px!important;}.wallet-cart-grid > *{box-sizing:border-box!important;min-width:0!important;max-width:none!important;width:100%!important;margin:0!important;border-radius:0!important;}::slotted(*){width:100%!important;max-width:none!important;box-sizing:border-box!important;--apple-pay-button-width:100%!important;--apple-pay-button-border-radius:0!important;border-radius:0!important;}apple-pay-button,shopify-apple-pay-button,apple-pay-button-element{width:100%!important;min-width:0!important;max-width:none!important;display:block!important;box-sizing:border-box!important;--apple-pay-button-width:100%!important;--apple-pay-button-border-radius:0!important;}shop-pay-button,.wallet-button-wrapper,[role="button"]{border-radius:0!important;}',host.shadowRoot.appendChild(st)}applyLayout(host),observe(host)}})}window.__splyWalletPatch=patch,patch();var pt;window.addEventListener("resize",function(){window.clearTimeout(pt),pt=window.setTimeout(patch,120)})})();
//# sourceMappingURL=/cdn/shop/t/5/assets/sply-cart.js.map

document.addEventListener("click", function(e) {
  var ck = e.target.closest('[name="checkout"], .sply-drawer__checkout, a[href="/checkout"]');
  if (ck) {
    e.preventDefault();
    window.location.href = '/checkout';
  }
});
