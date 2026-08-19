const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    mobileMenu.classList.toggle('open', !open);
    mobileMenu.setAttribute('aria-hidden', String(open));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.spotlight').forEach(card => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

const parallaxItem = document.querySelector('.parallax-item');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (parallaxItem && !reduceMotion && window.innerWidth > 768) {
  const updateParallax = () => {
    const y = window.scrollY;
    const opacity = Math.max(0, 1 - y / 650);
    const scale = Math.max(0.96, 1 - y / 2600);
    const translateY = y * 0.18;
    parallaxItem.style.opacity = opacity;
    parallaxItem.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
  };
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}

const legalModal = document.querySelector('#legal-modal');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

const legalText = {
  impressum: `
    <div class="eyebrow">LEGAL · IMPRESSUM</div>
    <h2>Impressum</h2>
    <p><strong>Vor Veröffentlichung ergänzen:</strong> vollständiger Unternehmensname, ladungsfähige Anschrift, Vertretungsberechtigte und Kontaktmöglichkeiten der Horlbeck & Meyer GbR.</p>
    <p>Dieser Prototyp enthält bewusst keine erfundenen Unternehmensdaten.</p>
  `,
  privacy: `
    <div class="eyebrow">LEGAL · DATENSCHUTZ</div>
    <h2>Datenschutz</h2>
    <p>Diese statische Demo verwendet keine eigenen Analyse- oder Tracking-Dienste. Externe Verlinkungen führen zu Instagram und Facebook.</p>
    <p>Vor dem produktiven Einsatz müssen Hosting, eingebundene Schriften, Social-Media-Verlinkungen und die tatsächlichen Datenverarbeitungen rechtlich geprüft und dokumentiert werden.</p>
  `
};

document.querySelectorAll('[data-modal]').forEach(button => {
  button.addEventListener('click', () => {
    if (!legalModal || !modalContent) return;
    modalContent.innerHTML = legalText[button.dataset.modal] || '';
    legalModal.showModal();
  });
});

modalClose?.addEventListener('click', () => legalModal?.close());
legalModal?.addEventListener('click', (event) => {
  if (event.target === legalModal) legalModal.close();
});
