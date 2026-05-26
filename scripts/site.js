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

// 4. Contact modal
(function () {
  const overlay = document.getElementById('contact-modal');
  if (!overlay) return;

  const form = document.getElementById('contact-form');
  const successEl = overlay.querySelector('.modal__success');
  const phoneInput = document.getElementById('f-phone');
  const phoneErr = document.getElementById('f-phone-err');

  function open() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => phoneInput && phoneInput.focus(), 60);
  }
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-trigger]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); open(); });
  });

  overlay.querySelector('.modal__close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const phone = phoneInput.value.trim();
    const email = document.getElementById('f-email').value.trim();

    phoneInput.classList.remove('is-error');
    phoneErr.textContent = '';

    if (!phone) {
      phoneInput.classList.add('is-error');
      phoneErr.textContent = 'Укажите номер телефона';
      phoneInput.focus();
      return;
    }

    const submitBtn = form.querySelector('.modal__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email })
      });
      if (!res.ok) throw new Error();
      form.style.display = 'none';
      successEl.classList.add('is-visible');
      setTimeout(close, 3500);
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Отправить заявку <span class="arrow">→</span>';
      phoneErr.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
    }
  });
})();
