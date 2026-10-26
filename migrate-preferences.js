// Run before app.js/help.js: keep only the old garden's design preferences.
// Never inspect or copy sessions, passwords, API keys, or unrelated storage.
(() => {
  if (document.documentElement.dataset.base !== '/garten/') return;
  try {
    const oldSeasonKey = 'ramonas-garten-season:/newgarten/';
    const seasonKey = 'ramonas-garten-season:/garten/';
    if (localStorage.getItem(seasonKey) === null) {
      const season = localStorage.getItem(oldSeasonKey);
      if (['spring', 'summer', 'autumn', 'winter'].includes(season)) {
        localStorage.setItem(seasonKey, season);
      }
    }

    const oldSayingKey = 'ramonas-garten-sayings:/newgarten/';
    const sayingKey = 'ramonas-garten-sayings:/garten/';
    if (localStorage.getItem(sayingKey) !== null) return;
    const raw = localStorage.getItem(oldSayingKey);
    if (!raw || raw.length > 32768) return;
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.history)) return;
    const validEntry = entry => entry &&
      /^(spring|summer|autumn|winter|all):\d{1,3}$/.test(entry.id) &&
      Number.isFinite(entry.shownAt) && entry.shownAt >= 0;
    const history = data.history.filter(validEntry).slice(-96)
      .map(({ id, shownAt }) => ({ id, shownAt }));
    const current = validEntry(data.current) &&
      /^\d{4}-(?:[0-9]|1[01])$/.test(data.current.period)
      ? { id: data.current.id, period: data.current.period, shownAt: data.current.shownAt }
      : null;
    localStorage.setItem(sayingKey, JSON.stringify({ version: 1, current, history }));
  } catch {
    // Restricted storage or malformed old preferences must not block login.
  }
})();
