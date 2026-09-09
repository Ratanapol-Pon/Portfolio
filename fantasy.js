/* A persistent, keyboard-accessible pause for all decorative movement. */
(() => {
  const control = document.getElementById('motionControl');
  const label = document.getElementById('motionLabel');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let choice = null;
  try { choice = localStorage.getItem('portfolio-motion'); } catch { /* Optional storage. */ }

  function updateMotion() {
    const paused = preference.matches || choice === 'paused';
    document.body.dataset.motion = paused ? 'paused' : 'running';
    control.setAttribute('aria-pressed', String(paused));
    control.setAttribute('aria-label', preference.matches ? 'Reduced motion enabled by your device' : paused ? 'Resume decorative motion' : 'Pause decorative motion');
    control.disabled = preference.matches;
    label.textContent = paused ? 'Motion off' : 'Motion on';
    document.getElementById('themeColor')?.setAttribute('content', '#121716');
  }

  control.addEventListener('click', () => {
    choice = document.body.dataset.motion === 'paused' ? 'running' : 'paused';
    try { localStorage.setItem('portfolio-motion', choice); } catch { /* Optional storage. */ }
    updateMotion();
  });
  preference.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', () => {
    document.body.dataset.pageHidden = String(document.hidden);
  });
  updateMotion();
})();
