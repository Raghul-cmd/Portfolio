/* ── BACKEND ── */
const API = window.location.protocol === 'file:' ? null : window.location.origin;

/* ── CURSOR ── */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (dot && ring) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCur() {
    if (!dot || !ring) return;
    rx += (mx - rx) * .10; ry += (my - ry) * .10;
    dot.style.transform  = `translate(${mx - 4}px,${my - 4}px)`;
    ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
    requestAnimationFrame(animCur);
  })();
}
document.querySelectorAll('a,button,.work-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ── NAV COMPACT ON SCROLL ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('compact', window.scrollY > 30);
});

/* ── MOBILE MENU ── */
let mobOpen = false;
function toggleMob() {
  mobOpen = !mobOpen;
  document.getElementById('mobMenu').classList.toggle('open', mobOpen);
  document.getElementById('hamburger').classList.toggle('open', mobOpen);
  document.body.style.overflow = mobOpen ? 'hidden' : '';
}
function closeMob() {
  mobOpen = false;
  document.getElementById('mobMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── DYNAMIC HERO CANVAS (CLEAN PLAIN LOOK) ── */
function initHeroCanvas() {
  const canvas = document.getElementById('heroBgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);
}

/* ── MOUSE PARALLAX & HERO TEXT DRIFT ── */
function initParallax() {
  const hero = document.getElementById('hero');
  const heroName = document.getElementById('heroName');
  const heroPortrait = document.querySelector('.hero-portrait');
  const heroTag = document.getElementById('heroTag');
  const heroBadge = document.getElementById('heroBadge');
  if (!hero || !heroName) return;

  let targetX = 0, targetY = 0;
  let currX = 0, currY = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  });

  function update() {
    currX += (targetX - currX) * 0.08;
    currY += (targetY - currY) * 0.08;

    if (heroName) {
      heroName.style.transform = `translate3d(${currX * -25}px, ${currY * -12}px, 0)`;
    }
    if (heroPortrait) {
      heroPortrait.style.transform = `translateX(-50%) translate3d(${currX * 16}px, ${currY * 8}px, 0)`;
    }
    if (heroTag) {
      heroTag.style.transform = `translate3d(${currX * -12}px, ${currY * -8}px, 0)`;
    }
    if (heroBadge) {
      heroBadge.style.transform = `translate3d(${currX * 12}px, ${currY * -8}px, 0)`;
    }
    requestAnimationFrame(update);
  }
  update();
}

/* ── SCROLL-DRIVEN RIGHT-TO-LEFT MARQUEE DRIFT ── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const track = document.getElementById('hnTrack');
  if (track) track.style.transform = `translateX(-${(scrolled * 0.4) % 600}px)`;
});

/* ── FADE-UP OBSERVER ── */
const fuIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); fuIO.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fu').forEach(el => fuIO.observe(el));

/* ── WORKS HOVER PREVIEW ── */
const preview = document.getElementById('workPreview');
const previewImg = document.getElementById('previewImg');
let previewRaf;
document.querySelectorAll('.work-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const imgSrc = item.dataset.img;
    if (imgSrc) {
      previewImg.src = imgSrc;
      preview.classList.add('show');
    }
  });
  item.addEventListener('mousemove', e => {
    cancelAnimationFrame(previewRaf);
    previewRaf = requestAnimationFrame(() => {
      preview.style.left = (e.clientX + 24) + 'px';
      preview.style.top  = (e.clientY - 90) + 'px';
    });
  });
  item.addEventListener('mouseleave', () => preview.classList.remove('show'));
});

/* ── BUDGET SELECT ── */
function selBudget(el) {
  document.querySelectorAll('.bpill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ── EMAIL COPY ── */
function copyEmail() {
  navigator.clipboard.writeText(document.getElementById('emailAddr').textContent).then(() => {
    const b = document.getElementById('copyBtn');
    b.textContent = '✓ Copied!';
    setTimeout(() => b.textContent = 'Copy', 2200);
  });
}

/* ── CONFETTI ── */
function launchConfetti() {
  const cv = document.getElementById('confetti');
  const ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * cv.width, y: -12,
    w: Math.random() * 11 + 4, h: Math.random() * 6 + 3,
    color: ['#0a0a09','#d5d4cf','#f59e0b','#22c55e','#3b82f6','#c9b99a'][Math.floor(Math.random() * 6)],
    vx: (Math.random() - .5) * 5, vy: Math.random() * 5 + 3,
    rot: Math.random() * 360, rs: (Math.random() - .5) * 8, alpha: 1
  }));
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = 0;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rs;
      if (p.y > cv.height) p.alpha -= 0.05;
      p.alpha = Math.max(0, p.alpha);
      if (p.alpha > 0) alive++;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive > 0) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ── CONTACT FORM → NODE.JS API ── */
async function handleSend(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.send-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span style="opacity:.6">Sending…</span>';
  btn.disabled  = true;

  const payload = {
    name:    form.querySelector('input[type="text"]').value,
    email:   form.querySelector('input[type="email"]').value,
    budget:  document.querySelector('.bpill.active')?.textContent || '',
    message: form.querySelector('textarea').value
  };

  let ok = false;
  if (API) {
    try {
      const res  = await fetch(`${API}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      ok = data.ok;
    } catch (_) { ok = true; }
  } else {
    await new Promise(r => setTimeout(r, 700));
    ok = true;
  }

  btn.innerHTML = orig; btn.disabled = false;

  if (ok) {
    form.style.display = 'none';
    document.getElementById('successBox').classList.add('show');
    launchConfetti();
    setTimeout(() => {
      document.getElementById('successBox').classList.remove('show');
      form.style.display = '';
      form.reset();
      document.querySelectorAll('.bpill').forEach((b, i) => b.classList.toggle('active', i === 0));
    }, 6000);
  }
}

/* ── LOAD STATS FROM API ── */
async function loadStats() {
  if (!API) return;
  try {
    const res  = await fetch(`${API}/api/stats`);
    const data = await res.json();
    if (data.ok) {
      const s = data.stats;
      const y = document.getElementById('statYears');
      const p = document.getElementById('statProjects');
      if (y) y.textContent = s.yearsExperience + '+';
      if (p) p.textContent = s.projectsShipped + '+';
    }
  } catch (_) {}
}

/* ── PRELOADER DISMISS ON LOAD / REFRESH ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const p = document.getElementById('preloader');
    if (p) p.classList.add('hide');
  }, 1000);
});

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initParallax();
  loadStats();
  if (API) {
    fetch(`${API}/api/health`)
      .then(r => r.json())
      .then(d => console.log(`🟢 Server connected | ${d.time}`))
      .catch(() => console.log('⚪ Static mode — run npm start for backend'));
  } else {
    console.log('💡 Run "npm start" → http://localhost:3000 for backend');
  }
});
