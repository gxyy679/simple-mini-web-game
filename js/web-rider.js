(() => {
  const rider = document.querySelector('.web-rider');
  const line = rider?.querySelector('.web-rider__line');
  const main = document.querySelector('main');

  if (!rider || !line || !main) return;

  const webConnection = 0.41;
  let frame = 0;

  const updatePosition = () => {
    frame = 0;

    const scrollRange = main.scrollHeight - main.clientHeight;
    const progress = scrollRange > 0 ? main.scrollTop / scrollRange : 0;
    const maxDrop = Math.max(
      0,
      Math.min(280, window.innerHeight * 0.3, window.innerHeight - rider.offsetHeight - 24)
    );
    const drop = Math.max(0, Math.min(1, progress)) * maxDrop;
    const baseWebLength = line.offsetHeight * webConnection;
    const scale = baseWebLength > 0 ? (baseWebLength + drop) / baseWebLength : 1;

    rider.style.setProperty('--web-drop', `${drop}px`);
    rider.style.setProperty('--web-scale', scale.toFixed(3));
  };

  const scheduleUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updatePosition);
  };

  main.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  updatePosition();
})();
