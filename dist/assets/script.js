(function(){
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var v = document.querySelectorAll('video');
  if (rm) { v.forEach(function(x){ x.removeAttribute('autoplay'); x.pause(); x.controls = true; }); }
  if (!rm && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold: .12});
    document.querySelectorAll('.steps li,.proof-strip>div,.material-grid>div,.checklist>span,.closing,.process-media,.faq-list details').forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
    var vo = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.target.hasAttribute('autoplay')) return; if (e.isIntersecting) { e.target.play().catch(function(){}); } else { e.target.pause(); } }); }, {threshold: .35});
    v.forEach(function(x){ vo.observe(x); });
  } else { v.forEach(function(x){ x.controls = true; }); }
})();

(function(){
  var g = document.querySelector('.material-grid'); if (!g) return;
  var cards = [].slice.call(g.querySelectorAll('.mat'));
  g.classList.add('js-mat');
  var hov = window.matchMedia && matchMedia('(hover:hover)').matches;
  function set(c, on){ c.classList.toggle('open', on); c.querySelector('.mat-btn').setAttribute('aria-expanded', on ? 'true' : 'false'); c.dispatchEvent(new Event(on ? 'mat:open' : 'mat:close')); }
  function closeAll(except){ cards.forEach(function(c){ if (c !== except) set(c, false); }); }
  cards.forEach(function(c){
    var b = c.querySelector('.mat-btn');
    if (hov) {
      c.addEventListener('mouseenter', function(){ closeAll(c); set(c, true); });
      c.addEventListener('mouseleave', function(){ if (document.activeElement !== b) set(c, false); });
      b.addEventListener('focus', function(){ closeAll(c); set(c, true); });
      b.addEventListener('blur', function(){ set(c, false); });
    } else {
      b.addEventListener('click', function(e){ e.stopPropagation(); var on = !c.classList.contains('open'); closeAll(c); set(c, on); });
    }
  });
  if (!hov) document.addEventListener('click', function(){ closeAll(null); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(null); });
})();

/* MATERIALS-ART: drawLayeredPart(profile, layers, tint) */
(function(){
  var g = document.querySelector('.material-grid.js-mat'); if (!g) return;
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function circ(cx, cy, r, n, f){ var a = []; for (var i = 0; i < n; i++) { var t = i / n * Math.PI * 2, rr = f ? f(t, r) : r; a.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]); } return a; }
  function rect(x, y, w, h){ return [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]; }
  var P = {
    petg: {tint: '#2f9ee6', gloss: 1, shapes: [{o: rect(0, 0, 1.7, 1.05), h: [circ(-.5, 0, .13, 14), circ(0, 0, .13, 14), circ(.5, 0, .13, 14)]}]},
    asa: {tint: '#8c9aa8', shapes: [{o: rect(0, 0, 1.5, 1.0), h: []}, {o: circ(.35, -.05, .3, 20), h: [circ(.35, -.05, .13, 14)], up: 1}]},
    pc: {tint: '#7fd0e6', glass: 1, shapes: [{o: rect(0, 0, 1.7, 1.05), h: [rect(-.5, 0, .14, .6), rect(0, 0, .14, .6), rect(.5, 0, .14, .6)]}]},
    pa: {tint: '#c9d3dc', shapes: [{o: circ(-.35, 0, .62, 40, function(t, r){ return r * (Math.cos(t * 10) > 0 ? 1 : .82); }), h: [circ(-.35, 0, .2, 14)]}, {o: circ(.62, .15, .3, 20), h: [circ(.62, .15, .14, 14)]}]},
    tpu: {tint: '#46576a', soft: 1, shapes: [{o: circ(0, 0, .78, 64, function(t, r){ return r + .07 * Math.sin(t * 8); }), h: [circ(0, 0, .42, 40)]}]},
    cf: {tint: '#3b4b5a', weave: 1, shapes: [{o: [[-.8, -.5], [.8, -.5], [.8, -.18], [-.35, -.18], [-.35, .5], [-.8, .5]], h: [circ(.5, -.34, .09, 12), circ(-.58, .15, .09, 12)]}]}
  };
  var N = 14, DZ = 3, S = 58;
  function shade(hex, k){ var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255; function m(v){ return Math.max(0, Math.min(255, Math.round(v * k))); } return 'rgb(' + m(r) + ',' + m(gg) + ',' + m(b) + ')'; }
  function pr(pt, z, cx, cy){ return [cx + (pt[0] - pt[1]) * .866 * S, cy + (pt[0] + pt[1]) * .5 * S - z]; }
  function path(c, pts, z, cx, cy){ pts.forEach(function(pt, i){ var q = pr(pt, z, cx, cy); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); }
  function drawLayeredPart(ctx, id, layers, W, H){
    var pf = P[id], cx = W / 2, cy = H * .56 + 4;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(cx, cy + 22, 82, 20, 0, 0, 7); ctx.fill();
    var top = null;
    for (var k = 0; k < layers; k++) {
      var last = k === layers - 1;
      pf.shapes.forEach(function(sh){
        var z = k * DZ + (sh.up ? 4 * DZ : 0);
        if (sh.up && k < N - 5) return;
        ctx.beginPath(); path(ctx, sh.o, z, cx, cy); sh.h.forEach(function(h){ path(ctx, h, z, cx, cy); });
        ctx.fillStyle = last ? shade(pf.tint, 1.12) : shade(pf.tint, .62 + .2 * (k % 2));
        if (pf.glass) ctx.globalAlpha = .88;
        ctx.fill('evenodd'); ctx.globalAlpha = 1;
        ctx.lineWidth = 1; ctx.strokeStyle = pf.glass ? 'rgba(180,240,255,.55)' : 'rgba(0,0,0,.35)'; ctx.stroke();
        if (last) {
          if (pf.weave) { ctx.save(); ctx.clip('evenodd'); ctx.strokeStyle = 'rgba(120,170,200,.35)'; ctx.lineWidth = .8; for (var w = -200; w < 200; w += 5) { ctx.beginPath(); ctx.moveTo(cx + w, cy - 70); ctx.lineTo(cx + w + 70, cy + 40); ctx.stroke(); } ctx.restore(); }
          if (pf.gloss) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.stroke(); }
          top = pr([0, 0], z, cx, cy);
        }
      });
    }
    return top;
  }
  var cards = [].slice.call(g.querySelectorAll('.mat')), st = [];
  cards.forEach(function(c, i){
    var art = c.querySelector('.mat-art'), cv = art.querySelector('canvas'), id = art.getAttribute('data-id'), ph = art.getAttribute('data-photo');
    if (ph) { var im = document.createElement('img'); im.src = ph; im.alt = ''; art.appendChild(im); cv.style.display = 'none'; }
    var ctx = cv.getContext('2d'); if (!ctx) return;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    var W = 320, H = 150, raf = 0, o = {c: c, ph: !!ph};
    function done(){ drawLayeredPart(ctx, id, N, W, H); }
    o.replay = function(){
      cancelAnimationFrame(raf);
      if (rm || ph) { done(); return; }
      var t0 = performance.now(), T = 520;
      (function f(now){
        var u = Math.min(1, (now - t0) / T), n = Math.max(1, Math.ceil(u * N));
        var tp = drawLayeredPart(ctx, id, n, W, H);
        if (u < 1) {
          ctx.fillStyle = '#61d6ff'; ctx.beginPath(); ctx.arc(tp[0], tp[1] - 4, 3, 0, 7); ctx.fill();
          raf = requestAnimationFrame(f);
        }
      })(t0);
    };
    o.done = done;
    st.push(o); done();
    c.addEventListener('mat:open', o.replay);
    c.addEventListener('mat:close', function(){ cancelAnimationFrame(raf); done(); });
  });
})();
