(function(){
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var v = document.querySelectorAll('video');
  if (rm) { v.forEach(function(x){ x.removeAttribute('autoplay'); x.pause(); x.controls = true; }); }
  if (!rm && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold: .12});
    document.querySelectorAll('.service-card,.steps li,.proof-strip>div,.material-grid>div,.checklist>span,.closing,.process-media,.faq-list details').forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
    var vo = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.target.hasAttribute('autoplay')) return; if (e.isIntersecting) { e.target.play().catch(function(){}); } else { e.target.pause(); } }); }, {threshold: .35});
    v.forEach(function(x){ vo.observe(x); });
  } else { v.forEach(function(x){ x.controls = true; }); }
})();
