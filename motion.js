(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const progress = document.querySelector('.scroll-progress');
  const network = document.querySelector('.network');
  const hero = document.querySelector('.hero');
  const animatedElements = document.querySelectorAll('.hero-copy,.hero-art,.about>div,.section-heading,.experience,.skill-grid article,.education,.empty-state,.contact>div');
  let frame = 0;
  let revealObserver;
  function setupReveals() {
    if (preference.matches || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, {threshold:0.08});
    animatedElements.forEach((element, index) => {
      element.dataset.reveal = '';
      if (element.closest('.skill-grid')) element.style.setProperty('--reveal-delay',`${(index % 3) * 90}ms`);
      revealObserver.observe(element);
    });
    document.documentElement.classList.add('motion-enhanced');
  }
  function updateScroll() {
    frame = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    if (!preference.matches && hero.getBoundingClientRect().bottom > 0) {
      network.style.setProperty('--parallax',`${Math.min(14, scrollY * 0.035)}px`);
    }
  }
  function queueScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll',queueScroll,{passive:true});
  addEventListener('resize',queueScroll,{passive:true});
  document.querySelectorAll('.hero-art,.skill-grid article').forEach(card => {
    let tiltFrame = 0;
    function reset() {
      cancelAnimationFrame(tiltFrame); tiltFrame = 0;
      card.style.setProperty('--tilt-x','0deg'); card.style.setProperty('--tilt-y','0deg');
      card.style.removeProperty('--pointer-x'); card.style.removeProperty('--pointer-y');
    }
    card.addEventListener('pointermove',event => {
      if (preference.matches || !finePointer.matches) return;
      cancelAnimationFrame(tiltFrame);
      const x = event.clientX, y = event.clientY;
      tiltFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const px = Math.max(0,Math.min(1,(x-rect.left)/rect.width));
        const py = Math.max(0,Math.min(1,(y-rect.top)/rect.height));
        card.style.setProperty('--tilt-x',`${(0.5-py)*5}deg`);
        card.style.setProperty('--tilt-y',`${(px-0.5)*7}deg`);
        card.style.setProperty('--pointer-x',`${px*100}%`);
        card.style.setProperty('--pointer-y',`${py*100}%`);
        tiltFrame = 0;
      });
    });
    card.addEventListener('pointerleave',reset);
    preference.addEventListener('change',reset);
  });
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => {
        if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-15% 0px -45% 0px',threshold:[0,.1,.3]});
    links.forEach(link => { const target=document.querySelector(link.hash); if(target) navObserver.observe(target); });
  }
  preference.addEventListener('change',() => {
    if(preference.matches) {
      revealObserver?.disconnect(); document.documentElement.classList.remove('motion-enhanced');
      network.style.setProperty('--parallax','0px');
      document.querySelectorAll('.data-packets animateMotion').forEach(el=>el.parentElement.remove());
    }
  });
  setupReveals(); updateScroll();
})();
