/* HealthyWorld: animated studio (yoga / exercises) and the home hero animation. Needs HWFig + HWPOSES loaded before this code. */
(function () {
  'use strict';
  var Fig = window.HWFig, POSES = window.HWPOSES || {};
  if (!Fig) return;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function $(id) { return document.getElementById(id); }

  /* ---- home hero: loops quietly while visible ---- */
  var hero = $('heroStage');
  if (hero && POSES[hero.getAttribute('data-pose')]) {
    var hc = Fig.mount(hero, POSES[hero.getAttribute('data-pose')], { label: hero.getAttribute('data-label') || '', autoplay: false });
    if (!reduce) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) hc.play(); else hc.pause(); }); }, { threshold: 0.2 }).observe(hero);
      } else hc.play();
    }
  }

  /* ---- studio ---- */
  var dataEl = $('hw-data');
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent), I = D.i18n, order = Object.keys(D.poses);
  var stage = $('stage'), phase = $('phase'), round = $('round'), btn = $('btnPlay'), note = $('motionNote');
  var cur = null, ctl = null, userPaused = false;

  function phaseText(ph) { return I['ph_' + ph] || ''; }
  function pipsHtml(l, name) {
    return '<span class="pips"><span class="pip-dots" aria-hidden="true">' + [1, 2, 3].map(function (n) { return '<i' + (n <= l ? ' class="on"' : '') + '></i>'; }).join('') + '</span><span class="pip-l">' + name + '</span></span>';
  }
  function setBtn(playing) { btn.textContent = playing ? I.st_pause : I.st_play; btn.setAttribute('aria-pressed', playing ? 'true' : 'false'); }

  function select(id, opts) {
    opts = opts || {};
    if (!D.poses[id] || !POSES[id]) return;
    var p = D.poses[id];
    cur = id;
    round.textContent = '';
    $('stName').textContent = p.name;
    $('stSa').textContent = p.sa;
    $('stDose').innerHTML = p.dose;
    $('stPips').innerHTML = pipsHtml(p.lvl, p.lvlName);
    $('stDesc').textContent = p.desc;
    var cards = document.querySelectorAll('.pcard');
    for (var i = 0; i < cards.length; i++) { if (cards[i].getAttribute('data-id') === id) cards[i].setAttribute('aria-current', 'true'); else cards[i].removeAttribute('aria-current'); }
    if (!ctl) {
      ctl = Fig.mount(stage, POSES[id], {
        label: p.name, autoplay: false,
        onphase: function (ph) { phase.textContent = phaseText(ph); },
        onloop: function (n) { round.textContent = I.st_round + ' ' + (n + 1); },
        onstate: setBtn
      });
      round.textContent = I.st_round + ' 1';
    } else {
      ctl.set(POSES[id], p.name);
      round.textContent = I.st_round + ' 1';
    }
    if (reduce || userPaused) { ctl.pause(); setBtn(false); if (reduce && note) note.hidden = false; } else ctl.play();
    if (opts.scroll) { var card = $('stageCard'); if (card && window.matchMedia && matchMedia('(max-width: 899px)').matches) card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    if (opts.hash && history.replaceState) { try { history.replaceState(null, '', '#' + id); } catch (e) {} }
  }

  btn.addEventListener('click', function () {
    if (!ctl) return;
    if (ctl.playing()) { userPaused = true; ctl.pause(); } else { userPaused = false; ctl.play(); }
  });
  var speedSeg = $('speedSeg');
  speedSeg.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-s]'); if (!b || !ctl) return;
    ctl.speed(parseFloat(b.getAttribute('data-s')));
    var bs = speedSeg.querySelectorAll('button'); for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i] === b ? 'true' : 'false');
  });

  var lvlSeg = $('lvlSeg');
  lvlSeg.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-lvl]'); if (!b) return;
    var l = parseInt(b.getAttribute('data-lvl'), 10), bs = lvlSeg.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i] === b ? 'true' : 'false');
    var cards = document.querySelectorAll('.pcard');
    for (var j = 0; j < cards.length; j++) cards[j].hidden = !(l === 0 || parseInt(cards[j].getAttribute('data-lvl'), 10) === l);
  });

  $('plist').addEventListener('click', function (e) {
    var c = e.target.closest('.pcard'); if (!c) return;
    userPaused = false;
    select(c.getAttribute('data-id'), { scroll: true, hash: true });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-pose]'); if (!a) return;
    e.preventDefault(); userPaused = false;
    select(a.getAttribute('data-pose'), { scroll: true, hash: true });
  });

  var start = (location.hash || '').replace('#', '');
  select(D.poses[start] ? start : D.first, { hash: false });
  window.addEventListener('hashchange', function () { var h = (location.hash || '').replace('#', ''); if (D.poses[h] && h !== cur) { userPaused = false; select(h, { scroll: true }); } });
  document.addEventListener('visibilitychange', function () { if (!ctl) return; if (document.hidden) ctl.pause(); else if (!reduce && !userPaused) ctl.play(); });
})();
