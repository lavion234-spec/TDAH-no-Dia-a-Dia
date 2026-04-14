// ---- Intersection Observer para animações de fade-in ----
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item__trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', (!isOpen).toString());
  });
});

// ---- Floating CTA (aparece após o hero sair da tela) ----
const floatingCTA = document.getElementById('floatingCTA');
const heroSection = document.getElementById('inicio');
window.addEventListener('scroll', () => {
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  if (heroBottom < 0) {
    floatingCTA.classList.add('visible');
  } else {
    floatingCTA.classList.remove('visible');
  }
}, { passive: true });

// ---- Countdown timer (persiste na sessão por 24h) ----
function getCountdownEnd() {
  const key = 'tdah_countdown_end';
  let end = sessionStorage.getItem(key);
  if (!end) {
    end = Date.now() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000;
    sessionStorage.setItem(key, end);
  }
  return parseInt(end, 10);
}

const endTime = getCountdownEnd();

function updateCountdown() {
  const now = Date.now();
  let diff = Math.max(0, endTime - now);
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Smooth scroll para links internos ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 56; // altura da topbar fixa
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Exit Intent Modal ----
const exitModal = document.getElementById('exitModal');
const exitModalClose = document.getElementById('exitModalClose');
const exitModalOverlay = document.getElementById('exitModalOverlay');
const exitModalDismiss = document.getElementById('exitModalDismiss');

let exitShown = false;

function openExitModal() {
  if (exitShown) return;
  exitShown = true;
  exitModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeExitModal() {
  exitModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Desktop: detecta cursor saindo pelo topo da janela
document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0) openExitModal();
});

// Mobile: detecta scroll rápido para cima (intenção de sair)
let lastScrollY = window.scrollY;
let scrollUpStreak = 0;

window.addEventListener('scroll', () => {
  const delta = lastScrollY - window.scrollY;
  if (delta > 50) {
    scrollUpStreak++;
    if (scrollUpStreak >= 3) openExitModal();
  } else if (delta < 0) {
    scrollUpStreak = 0;
  }
  lastScrollY = window.scrollY;
}, { passive: true });

exitModalClose.addEventListener('click', closeExitModal);
exitModalOverlay.addEventListener('click', closeExitModal);
exitModalDismiss.addEventListener('click', closeExitModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeExitModal();
});
