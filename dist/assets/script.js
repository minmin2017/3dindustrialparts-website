const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .steps li, .material-grid div, details').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease, border-color .25s';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.visible{opacity:1!important;transform:translateY(0)!important}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}.service-card,.steps li,.material-grid div,details{opacity:1!important;transform:none!important}}';
document.head.appendChild(style);
