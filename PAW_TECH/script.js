// Navbar background on scroll
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30));

// Mobile menu
const menu = document.getElementById('menu');
document.getElementById('burger').onclick = () => menu.classList.toggle('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// About Us: tap to slide on phones (hover works on desktop through CSS)
document.querySelectorAll('.person').forEach(p => {
  p.addEventListener('click', e => {
    if (e.target.closest('.social a')) return;
    document.querySelectorAll('.person').forEach(o => o !== p && o.classList.remove('open'));
    p.classList.toggle('open');
  });
});

// Background music
const bgm = document.getElementById('bgm');
const btn = document.getElementById('musicBtn');
bgm.volume = 0.4;
function setMusic(on) {
  if (on) bgm.play().then(() => btn.classList.add('on')).catch(() => {});
  else { bgm.pause(); btn.classList.remove('on'); }
  try { localStorage.setItem('music', on ? 'on' : 'off'); } catch (e) {}
}
btn.onclick = () => setMusic(bgm.paused);
// Browsers block autoplay, so start on the first click anywhere (unless the user turned it off)
let saved = null; try { saved = localStorage.getItem('music'); } catch (e) {}
if (saved !== 'off') {
  const start = () => { setMusic(true); removeEventListener('click', start); };
  addEventListener('click', start);
}