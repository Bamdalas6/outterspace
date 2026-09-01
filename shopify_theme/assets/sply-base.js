(function(){var root=document.documentElement,toggle=document.querySelector(".sply-mode-toggle"),KEY="sply-mode",reduceMo=window.matchMedia("(prefers-reduced-motion: reduce)").matches;toggle&&toggle.addEventListener("click",function(){var apply=function(){var next=root.classList.contains("sply--dark")?"light":"dark";root.classList.remove("sply--light","sply--dark"),root.classList.add("sply--"+next);try{localStorage.setItem(KEY,next)}catch(e){}};if(!reduceMo&&document.startViewTransition){root.classList.add("sply--mode-vt");var vt=document.startViewTransition(apply);vt.finished.then(function(){root.classList.remove("sply--mode-vt")},function(){root.classList.remove("sply--mode-vt")})}else apply()})})(),(function(){function floating(e){var p=getComputedStyle(e).position;return p==="fixed"||p==="absolute"}function safeHide(e){!e||!e.style||e.querySelector&&e.querySelector('input,textarea,select,button[type="submit"]')||e.style.setProperty("display","none","important")}function nuke(){document.querySelectorAll(".grecaptcha-badge,.h-captcha").forEach(safeHide),document.querySelectorAll('iframe[src*="hcaptcha"],iframe[title*="hcaptcha" i],iframe[src*="recaptcha"]').forEach(function(f){for(var w=f,hops=0;w&&w!==document.body&&hops<5;){if(floating(w)){safeHide(w);return}w=w.parentElement,hops++}}),document.querySelectorAll("body > *").forEach(function(e){floating(e)&&e.querySelector&&e.querySelector('iframe[src*="hcaptcha"],iframe[title*="hcaptcha" i]')&&safeHide(e)})}nuke();try{new MutationObserver(nuke).observe(document.documentElement,{childList:!0,subtree:!0})}catch(e){}window.addEventListener("load",nuke),[250,700,1500,3e3,5e3].forEach(function(t){setTimeout(nuke,t)})})(),document.addEventListener("click",function(e){var q=e.target.closest&&e.target.closest("[data-sply-faq-q]");q&&q.setAttribute("aria-expanded",q.getAttribute("aria-expanded")==="true"?"false":"true")}),(function(){function reveal(items){Array.prototype.forEach.call(items,function(it,i){it.style.transitionDelay=i*60+"ms",it.classList.add("is-in")})}var supported="IntersectionObserver"in window,obs=supported?new IntersectionObserver(function(entries){entries.forEach(function(en){en.isIntersecting&&(reveal(en.target.querySelectorAll("[data-reveal-item]")),obs.unobserve(en.target))})},{threshold:.1,rootMargin:"0px 0px -8% 0px"}):null;function observe(scope){Array.prototype.forEach.call((scope||document).querySelectorAll("[data-reveal]"),function(g){g._revObs||(g._revObs=!0,obs?obs.observe(g):reveal(g.querySelectorAll("[data-reveal-item]")))})}observe(document),window.Shopify&&Shopify.designMode&&document.addEventListener("shopify:section:load",function(e){var t=e.target;!t||!t.querySelectorAll||Array.prototype.forEach.call(t.querySelectorAll("[data-reveal-item], .sply-surface-grid .sply-card"),function(it){it.classList.add("is-in")})})})(),(function(){var box=null,imgs=[],idx=0;function build(){box=document.createElement("div"),box.className="sply-lb",box.innerHTML='<button class="sply-lb__close" data-lb-close aria-label="Close">\xD7</button><button class="sply-lb__nav sply-lb__nav--prev" data-lb-prev aria-label="Previous">\u2039</button><figure class="sply-lb__fig"><img class="sply-lb__img" alt=""><figcaption class="sply-lb__cap"></figcaption></figure><button class="sply-lb__nav sply-lb__nav--next" data-lb-next aria-label="Next">\u203A</button>',document.body.appendChild(box),box.addEventListener("click",function(e){e.target===box||e.target.closest("[data-lb-close]")?close():e.target.closest("[data-lb-prev]")?go(-1):e.target.closest("[data-lb-next]")&&go(1)})}function show(){var im=imgs[idx];box.querySelector(".sply-lb__img").src=im.getAttribute("data-full")||im.src;var cap=im.getAttribute("data-caption")||"",c=box.querySelector(".sply-lb__cap");c.textContent=cap,c.style.display=cap?"block":"none"}function go(d){idx=(idx+d+imgs.length)%imgs.length,show()}function open(g,i){imgs=Array.prototype.slice.call(g.querySelectorAll(".sply-gallery__img")),imgs.length&&(idx=i,box||build(),show(),box.classList.add("is-open"),document.documentElement.classList.add("sply-lb-open"))}function close(){box&&(box.classList.remove("is-open"),document.documentElement.classList.remove("sply-lb-open"))}document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-sply-gallery-open]");if(b){var g=b.closest("[data-sply-gallery]");g&&open(g,parseInt(b.getAttribute("data-sply-gallery-open"),10)||0)}}),document.addEventListener("keydown",function(e){!box||!box.classList.contains("is-open")||(e.key==="Escape"?close():e.key==="ArrowLeft"?go(-1):e.key==="ArrowRight"&&go(1))})})(),(function(){var menu=document.querySelector("[data-sply-menu]");if(!menu)return;var closeT=null;function open(){closeT&&(window.clearTimeout(closeT),closeT=null),menu.classList.remove("is-closing"),menu.hidden=!1,document.documentElement.classList.add("sply-menu-open"),window.dispatchEvent(new CustomEvent("sply:overlayopen",{detail:"menu"})),glitchIn()}var RM=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function glitchIn(){for(var items=menu.querySelectorAll(".sply-menu__link,.sply-menu__sublink"),i=0;i<items.length;i++)(function(el,idx){var fin=el.getAttribute("data-txt");fin==null&&(fin=el.textContent,el.setAttribute("data-txt",fin)),el._iv&&(window.clearInterval(el._iv),el._iv=null),el.style.opacity="0",window.setTimeout(function(){if(el.style.opacity="1",RM){el.style.opacity="",el.textContent=fin;return}for(var glyphs="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",q=[],k=0;k<fin.length;k++){var c=fin.charAt(k),fx=c===" "||c==="-"||c==="/"||c===".";q.push({c:c,fx:fx,end:fx?0:Math.round(k*1.6)+6+Math.floor(Math.random()*5)})}var fr=0;el._iv=window.setInterval(function(){for(var o="",d=0,jx=0;jx<q.length;jx++){var t=q[jx];t.fx||fr>=t.end?(o+=t.c,d++):o+=glyphs.charAt(Math.floor(Math.random()*glyphs.length))}el.textContent=o,fr++,d===q.length&&(window.clearInterval(el._iv),el._iv=null,el.textContent=fin,el.style.opacity="")},38)},idx*115)})(items[i],i)}window.addEventListener("sply:overlayopen",function(e){e.detail!=="menu"&&!menu.hidden&&close()});function close(){if(!(menu.hidden||menu.classList.contains("is-closing"))){menu.classList.add("is-closing"),document.documentElement.classList.remove("sply-menu-open");for(var items=menu.querySelectorAll(".sply-menu__link,.sply-menu__sublink"),n=items.length,i=0;i<n;i++)(function(el,rev){el._iv&&(window.clearInterval(el._iv),el._iv=null,el.textContent=el.getAttribute("data-txt")||el.textContent),el.style.transition="opacity .3s ease",window.setTimeout(function(){el.style.opacity="0"},rev*85)})(items[i],n-1-i);var dur=(n>1?(n-1)*85:0)+380;dur<520&&(dur=520),closeT=window.setTimeout(function(){menu.hidden=!0,menu.classList.remove("is-closing");for(var k=0;k<items.length;k++)items[k].style.transition="";closeT=null},dur)}}document.addEventListener("click",function(e){if(e.target.closest("[data-sply-menu-open]")){e.preventDefault(),menu.hidden?open():close();return}if(e.target.closest("[data-sply-menu-close]")){e.preventDefault(),close();return}}),document.addEventListener("keydown",function(e){e.key==="Escape"&&!menu.hidden&&close()})})(),(function(){function revealBg(m){var bg=m.querySelector(".sply-enter__bg");if(!(!bg||bg._bg)){bg._bg=!0;var img=bg.querySelector("img");if(img){var show2=function(){bg.classList.add("is-loaded")};img.complete&&img.naturalWidth?show2():(img.addEventListener("load",show2,{once:!0}),img.addEventListener("error",show2,{once:!0}))}}}function open(m){m.hidden=!1,m.classList.remove("is-exit"),document.documentElement.classList.add("sply-enter-open"),revealBg(m)}function close(m){m.hidden=!0,document.documentElement.classList.remove("sply-enter-open")}function dismiss(m,href){m.classList.contains("is-exit")||(m.classList.add("is-exit"),window.setTimeout(function(){document.documentElement.classList.remove("sply-enter-open"),m.hidden=!0,href&&(window.location.href=href)},760))}function bind(m){!m||m._bound||(m._bound=!0,m.addEventListener("click",function(e){var p=e.target.closest("[data-enter-go]");p&&(e.preventDefault(),dismiss(m,p.getAttribute("data-href")||null))}))}document.addEventListener("keydown",function(e){if(e.key==="Escape"){var m=document.querySelector("[data-sply-enter]");m&&!m.hidden&&document.documentElement.classList.contains("sply-enter-open")&&dismiss(m,null)}});var design=!!(window.Shopify&&Shopify.designMode);if(design){var has2=function(t){return t&&t.querySelector&&t.querySelector("[data-sply-enter]")},show2=function(){var m=document.querySelector("[data-sply-enter]");m&&(bind(m),open(m))},has=has2,show=show2;document.addEventListener("shopify:section:select",function(e){has2(e.target)&&show2()}),document.addEventListener("shopify:section:load",function(e){has2(e.target)&&show2()}),document.addEventListener("shopify:section:deselect",function(e){if(has2(e.target)){var m=document.querySelector("[data-sply-enter]");m&&close(m)}});return}var modal=document.querySelector("[data-sply-enter]");if(modal){bind(modal);var seen=!1;try{seen=sessionStorage.getItem("sply-entered")==="1"}catch(e){}if(seen){modal.parentNode&&modal.parentNode.removeChild(modal);return}try{sessionStorage.setItem("sply-entered","1")}catch(e){}open(modal)}})();
//# sourceMappingURL=/cdn/shop/t/5/assets/sply-base.js.map


/* Robust Global Event Delegation for Shopify Theme */
document.addEventListener("click", function(e) {
  // 1. Dark / Light Mode Toggle
  var modeBtn = e.target.closest(".sply-mode-toggle, [data-sply-mode-toggle]");
  if (modeBtn) {
    e.preventDefault();
    var root = document.documentElement;
    var next = root.classList.contains("sply--dark") ? "light" : "dark";
    root.classList.remove("sply--light", "sply--dark");
    root.classList.add("sply--" + next);
    try { localStorage.setItem("sply-mode", next); } catch(err){}
    return;
  }

  // 2. Enter Screen Dismissal
  var enterBtn = e.target.closest("[data-enter-go]");
  if (enterBtn) {
    e.preventDefault();
    var enter = document.querySelector("[data-sply-enter]");
    if (enter) {
      enter.classList.add("is-dismissed");
      try { sessionStorage.setItem("sply-landed", "1"); } catch(err){}
      setTimeout(function() {
        if (enter.parentNode) enter.parentNode.removeChild(enter);
      }, 500);
    }
    return;
  }

  // 3. Menu Open / Close
  var menuOpen = e.target.closest("[data-sply-menu-open], .sply-menu-btn");
  if (menuOpen) {
    e.preventDefault();
    var menu = document.querySelector("[data-sply-menu]");
    if (menu) menu.hidden = false;
    return;
  }
  var menuClose = e.target.closest("[data-sply-menu-close], .sply-menu__scrim");
  if (menuClose) {
    e.preventDefault();
    var menu = document.querySelector("[data-sply-menu]");
    if (menu) menu.hidden = true;
    return;
  }

  // 4. Cart Drawer Open / Close
  var cartOpen = e.target.closest("[data-sply-cart-open], .sply-cart-link");
  if (cartOpen) {
    e.preventDefault();
    var drawer = document.querySelector("[data-sply-cart]");
    if (drawer) drawer.hidden = false;
    return;
  }
  var cartClose = e.target.closest("[data-sply-cart-close], .sply-drawer__scrim");
  if (cartClose) {
    e.preventDefault();
    var drawer = document.querySelector("[data-sply-cart]");
    if (drawer) drawer.hidden = true;
    return;
  }
});
