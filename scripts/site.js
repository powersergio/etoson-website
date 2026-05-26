// Etoson — shared interactions

// 1. Sticky header scroll state
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 2. Theme toggle
(function () {
  const KEY = 'etoson-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') {
    root.dataset.theme = saved;
  }
  const btns = document.querySelectorAll('[data-theme-toggle]');
  const sync = () => {
    const t = root.dataset.theme || 'light';
    btns.forEach(b => { b.textContent = t === 'dark' ? '☼' : '☾'; });
  };
  sync();
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = (root.dataset.theme === 'dark') ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem(KEY, next);
      sync();
    });
  });
})();

// 3. FAQ accordion
(function () {
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      item.classList.toggle('is-open');
    });
  });
})();
