/* HealthyWorld: shared page behaviour (age picker, language menu, contact form). No dependencies. */
(function () {
  'use strict';
  function store(k, v) { try { if (v === undefined) return localStorage.getItem('hw.' + k); localStorage.setItem('hw.' + k, String(v)); } catch (e) { return null; } }

  /* language menu: close on outside click / Escape */
  document.addEventListener('click', function (e) {
    var open = document.querySelectorAll('details.langsw[open]');
    for (var i = 0; i < open.length; i++) if (!open[i].contains(e.target)) open[i].removeAttribute('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelectorAll('details.langsw[open]');
    for (var i = 0; i < open.length; i++) { open[i].removeAttribute('open'); var s = open[i].querySelector('summary'); if (s) s.focus(); }
  });
  var langLinks = document.querySelectorAll('details.langsw a');
  for (var l = 0; l < langLinks.length; l++) langLinks[l].addEventListener('click', function () { store('lang', this.getAttribute('hreflang')); });

  /* home: age picker */
  var picker = document.getElementById('picker');
  if (picker) {
    var input = document.getElementById('age'), go = document.getElementById('goBtn'), hint = document.getElementById('hint');
    var chips = [].slice.call(picker.querySelectorAll('.chip'));
    var def = picker.getAttribute('data-default');
    function groupFor(n) { for (var i = 0; i < chips.length; i++) if (n >= +chips[i].getAttribute('data-min') && n <= +chips[i].getAttribute('data-max')) return chips[i]; return null; }
    function setHint(kind) {
      hint.className = 'hint' + (kind ? ' err' : '');
      hint.textContent = kind === 'range' ? picker.getAttribute('data-range') : kind === 'young' ? picker.getAttribute('data-young') : picker.getAttribute('data-hint');
    }
    function apply(n, fromTyping) {
      var c = groupFor(n);
      chips.forEach(function (x) { x.removeAttribute('aria-current'); });
      if (c) { c.setAttribute('aria-current', 'true'); go.setAttribute('href', c.getAttribute('href')); store('age', n); setHint(null); }
    }
    function read() {
      var v = (input.value || '').trim(), n = parseInt(v, 10);
      if (v === '' || isNaN(n) || n > 100) { setHint('range'); return null; }
      if (n < 5) { setHint('young'); return null; }
      return n;
    }
    input.addEventListener('input', function () { var n = read(); if (n != null) apply(n, true); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var n = read(); if (n != null) { apply(n); location.href = go.getAttribute('href'); } } });
    input.addEventListener('blur', function () { var n = read(); if (n == null) { input.value = store('age') || 25; apply(parseInt(input.value, 10)); } });
    document.getElementById('ageDown').addEventListener('click', function () { var n = Math.max(5, (parseInt(input.value, 10) || 25) - 1); input.value = n; apply(n); });
    document.getElementById('ageUp').addEventListener('click', function () { var n = Math.min(100, (parseInt(input.value, 10) || 25) + 1); input.value = n; apply(n); });
    chips.forEach(function (c) { c.addEventListener('click', function () { input.value = c.getAttribute('data-min') > 0 ? Math.round((+c.getAttribute('data-min') + Math.min(+c.getAttribute('data-max'), 70)) / 2) : input.value; store('age', input.value); }); });
    var saved = parseInt(store('age'), 10);
    if (!isNaN(saved) && saved >= 5 && saved <= 100) input.value = saved;
    apply(parseInt(input.value, 10) || 25);
    if (!go.getAttribute('href')) go.setAttribute('href', def);
  }

  /* contact form: opens the visitor's email app */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('cName').value, m = document.getElementById('cEmail').value, b = document.getElementById('cMsg').value;
      location.href = 'mailto:' + form.getAttribute('data-to') + '?subject=' + encodeURIComponent('HealthyWorld: ' + n) + '&body=' + encodeURIComponent(b + '\n\n' + n + ' (' + m + ')');
    });
  }
})();
