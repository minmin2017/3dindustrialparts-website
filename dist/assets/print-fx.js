(function () {
  var root = document.documentElement;
  function done() { root.classList.remove('js-print'); }
  var copy = document.querySelector('.hero-copy');
  var lead = copy && copy.querySelector('.lead');
  if (!copy || !lead || !copy.animate || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) { done(); return; }
  try {
    var N = 48, DUR = 2200;
    var H = Math.round(lead.offsetTop + lead.offsetHeight);   // build height: eyebrow, h1, lead
    var W = copy.offsetWidth + 48;
    var steps = 'steps(' + N + ',jump-end)';
    var line = document.createElement('div'); line.className = 'pf-line'; line.setAttribute('aria-hidden', 'true');
    var spot = document.createElement('div'); spot.className = 'pf-spot'; line.appendChild(spot);
    var tex = document.createElement('div'); tex.className = 'pf-tex'; tex.setAttribute('aria-hidden', 'true'); tex.style.height = H + 'px';
    copy.appendChild(tex); copy.appendChild(line);
    var anims = [];
    var opt = function (o) { o.fill = 'both'; return o; };
    // stepped bottom-to-top reveal of the whole copy block (CTA area is faded in separately)
    anims.push(copy.animate([
      { clipPath: 'inset(' + H + 'px -48px -48px -48px)' },
      { clipPath: 'inset(0px -48px -48px -48px)' }
    ], opt({ duration: DUR, easing: steps })));
    // glowing build edge moves up with the same steps
    anims.push(line.animate([
      { transform: 'translateY(' + H + 'px)', opacity: 1 },
      { transform: 'translateY(0px)', opacity: 1, offset: .96 },
      { transform: 'translateY(0px)', opacity: 0 }
    ], opt({ duration: DUR + 120, easing: steps })));
    // nozzle sweeps along the edge (raster path)
    anims.push(spot.animate([
      { transform: 'translateX(24px)' }, { transform: 'translateX(' + (W - 24) + 'px)' }
    ], opt({ duration: 560, iterations: 4, direction: 'alternate', easing: 'ease-in-out' })));
    // layer-line texture on fresh material, clears to clean text
    anims.push(tex.animate([
      { opacity: 1 }, { opacity: 1, offset: .35 }, { opacity: 0 }
    ], opt({ duration: DUR + 700, easing: 'linear' })));
    // actions + note fade in right after the headline starts forming
    [copy.querySelector('.hero-actions')].forEach(function (el, i) {
      if (!el) return;
      anims.push(el.animate([
        { opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }
      ], opt({ duration: 450, delay: 850, easing: 'ease-out' })));
    });
    var last = anims[3];
    var finish = function () {
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      if (line.parentNode) line.parentNode.removeChild(line);
      if (tex.parentNode) tex.parentNode.removeChild(tex);
      done();
    };
    last.onfinish = finish;
    setTimeout(finish, 3800); // safety: never stay hidden
    // run the clip/line immediately; lift the CSS hold now that WAAPI owns the clip
    root.classList.remove('js-print');
  } catch (e) { done(); }
})();
