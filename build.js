'use strict';
/* HealthyWorld static site generator.
   Usage:  node src/build.js
   Env:    SITE=https://yourdomain.com  EMAIL=you@yourdomain.com  OUT=folder  HERO_POSE=surya                         */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.env.OUT || path.join(ROOT, 'site'));
const SITE = (process.env.SITE || 'https://healthyworld.example').replace(/\/+$/, '');
const EMAIL = process.env.EMAIL || 'contact@healthyworld.example';
const DATE = '2026-10-11';
const LANGS = ['en', 'ur', 'hi', 'ar'];
const NAMES = { en: 'English', ur: 'اردو', hi: 'हिन्दी', ar: 'العربية' };
const LOCALE = { en: 'en_US', ur: 'ur_PK', hi: 'hi_IN', ar: 'ar_AR' };
const RTL = { ur: 1, ar: 1 };
const HERO_POSE = process.env.HERO_POSE || 'surya';

const Fig = require('./figure.js');
fs.readdirSync(__dirname).filter(f => /^poses_.+\.js$/.test(f) && f !== 'poses_test.js').sort().forEach(f => require('./' + f));
const POSES = globalThis.HWPOSES || {};
const BASE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'L_base.json'), 'utf8'));
const COPY = {};
LANGS.forEach(l => { COPY[l] = require('./copy_' + l + '.js'); });

/* ---------- language-independent data ---------- */
const G = [
  { id: 'g1', slug: 'age-5-12', min: 5, max: 12, label: '5–12', sleep: '9–11', water: '5–7', move: '60' },
  { id: 'g2', slug: 'age-13-19', min: 13, max: 19, label: '13–19', sleep: '8–10', water: '7–8', move: '60' },
  { id: 'g3', slug: 'age-20-35', min: 20, max: 35, label: '20–35', sleep: '7–9', water: '8–10', move: '30' },
  { id: 'g4', slug: 'age-36-50', min: 36, max: 50, label: '36–50', sleep: '7–9', water: '8–9', move: '30' },
  { id: 'g5', slug: 'age-51-64', min: 51, max: 64, label: '51–64', sleep: '7–9', water: '8', move: '30' },
  { id: 'g6', slug: 'age-65-plus', min: 65, max: 100, label: '65+', sleep: '7–8', water: '6–8', move: '30' }
];
const YOGA = [
  { id: 'tadasana', lvl: 1, sa: 'Tadasana', val: '30–60', unit: 'sec' },
  { id: 'marjari', lvl: 1, sa: 'Marjaryasana–Bitilasana', val: '8–10', unit: 'rounds' },
  { id: 'balasana', lvl: 1, sa: 'Balasana', val: '30–60', unit: 'sec' },
  { id: 'bhujanga', lvl: 1, sa: 'Bhujangasana', val: '15–20', unit: 'sec', sets: 3 },
  { id: 'sukhasana', lvl: 1, sa: 'Sukhasana', val: '2–5', unit: 'min' },
  { id: 'surya', lvl: 2, sa: 'Surya Namaskar', val: '5–8', unit: 'rounds' },
  { id: 'adho', lvl: 2, sa: 'Adho Mukha Svanasana', val: '30–45', unit: 'sec' },
  { id: 'vira2', lvl: 2, sa: 'Virabhadrasana II', val: '30', unit: 'secSide' },
  { id: 'trikona', lvl: 2, sa: 'Trikonasana', val: '30', unit: 'secSide' },
  { id: 'setu', lvl: 2, sa: 'Setu Bandhasana', val: '20–30', unit: 'sec', sets: 3 },
  { id: 'baka', lvl: 3, sa: 'Bakasana', val: '10–20', unit: 'sec' },
  { id: 'vasistha', lvl: 3, sa: 'Vasisthasana', val: '20–30', unit: 'secSide' },
  { id: 'ardha', lvl: 3, sa: 'Ardha Chandrasana', val: '30', unit: 'secSide' },
  { id: 'urdhva', lvl: 3, sa: 'Urdhva Dhanurasana', val: '15–30', unit: 'sec' },
  { id: 'sirsa', lvl: 3, sa: 'Sirsasana', val: '20–60', unit: 'sec' }
];
const EX = [
  { id: 'wallpush', lvl: 1, sets: 2, val: '10–12', unit: 'reps' },
  { id: 'squat', lvl: 1, sets: 2, val: '10–12', unit: 'reps' },
  { id: 'glute', lvl: 1, sets: 2, val: '10–12', unit: 'reps' },
  { id: 'march', lvl: 1, sets: 2, val: '30', unit: 'sec' },
  { id: 'kneeplank', lvl: 1, sets: 2, val: '15–20', unit: 'sec' },
  { id: 'pushup', lvl: 2, sets: 3, val: '8–12', unit: 'reps' },
  { id: 'lunge', lvl: 2, sets: 3, val: '10', unit: 'repsSide' },
  { id: 'plank', lvl: 2, sets: 3, val: '30–45', unit: 'sec' },
  { id: 'climber', lvl: 2, sets: 3, val: '30', unit: 'sec' },
  { id: 'dip', lvl: 2, sets: 3, val: '10–12', unit: 'reps' },
  { id: 'burpee', lvl: 3, sets: 3, val: '10–15', unit: 'reps' },
  { id: 'jumpsquat', lvl: 3, sets: 3, val: '12–15', unit: 'reps' },
  { id: 'pike', lvl: 3, sets: 3, val: '8–12', unit: 'reps' },
  { id: 'hollow', lvl: 3, sets: 3, val: '30', unit: 'sec' },
  { id: 'split', lvl: 3, sets: 3, val: '8–10', unit: 'repsSide' }
];
const KIND = { yoga: { list: YOGA, page: 'yoga', mk: 'yoga' }, ex: { list: EX, page: 'exercises', mk: 'ex' } };
const AGE_MOVES = {
  g1: { yoga: ['tadasana', 'marjari', 'balasana'], ex: ['squat', 'march', 'glute'] },
  g2: { yoga: ['surya', 'vira2', 'bhujanga'], ex: ['pushup', 'squat', 'plank'] },
  g3: { yoga: ['surya', 'adho', 'trikona'], ex: ['pushup', 'lunge', 'plank'] },
  g4: { yoga: ['surya', 'trikona', 'setu'], ex: ['squat', 'glute', 'plank'] },
  g5: { yoga: ['marjari', 'bhujanga', 'setu'], ex: ['wallpush', 'squat', 'march'] },
  g6: { yoga: ['sukhasana', 'tadasana', 'balasana'], ex: ['wallpush', 'march', 'glute'] }
};
const STARTER = { yoga: ['tadasana', 'marjari', 'balasana', 'bhujanga', 'sukhasana'], ex: ['march', 'squat', 'glute', 'kneeplank', 'wallpush'] };
const CATS = [
  ['produce', ['guava', 'citrus', 'apple', 'spinach', 'carrot', 'cucumber']],
  ['protein', ['eggs', 'daal', 'chickpeas', 'chicken', 'fish', 'beans']],
  ['grains', ['roti', 'oats', 'brownrice', 'daliya', 'barley', 'millet']],
  ['dairy', ['milk', 'yogurt', 'lassi', 'paneer', 'chaas', 'cheese']],
  ['fats', ['almonds', 'walnuts', 'oliveoil', 'flaxseeds', 'chiaseeds', 'salmon']],
  ['drinks', ['water', 'lemonwater', 'coconutwater', 'greentea', 'chaas', 'herbaltea']]
];
const SWAP_ICON = ['lemonwater', 'chickpeas', 'roti', 'almonds', 'apple', 'herbaltea'];
const HOME_FOODS = [['produce', 2], ['fats', 0], ['dairy', 1], ['protein', 1], ['grains', 0], ['fats', 5]];
const HOME_POSES = [['yoga', 'surya'], ['yoga', 'vira2'], ['yoga', 'adho'], ['ex', 'squat'], ['ex', 'pushup'], ['ex', 'plank']];
const MEALS = [['b', 'breakfast', 'meal_b_d'], ['l', 'lunch', 'meal_l_d'], ['s', 'snack', 'meal_s_d'], ['d', 'dinner', 'meal_d_d']];
const AGE_SLUGS = G.map(g => g.slug);
const PAGES = ['index'].concat(AGE_SLUGS, ['yoga', 'exercises', 'food', 'about', 'contact', 'privacy', 'disclaimer']);

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ltr = s => '<bdi dir="ltr">' + esc(s) + '</bdi>';
const T = (lang, k) => {
  const v = COPY[lang][k] != null ? COPY[lang][k] : (BASE[lang].ui[k] != null ? BASE[lang].ui[k] : null);
  if (v == null) throw new Error('missing text ' + lang + '.' + k);
  return v;
};
const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
const trunc = (s, n) => { if (s.length <= n) return s; const c = s.slice(0, n - 1), i = c.lastIndexOf(' '); return (i > n * 0.6 ? c.slice(0, i) : c) + '…'; };
const dirOf = l => (l === 'en' ? '' : l + '/');
const pre = l => (l === 'en' ? '' : '../');
const href = (from, to, slug) => (from === to ? '' : pre(from) + dirOf(to)) + slug + '.html';
const canon = (l, slug) => SITE + '/' + dirOf(l) + (slug === 'index' ? '' : slug + '.html');
const asset = (l, p) => pre(l) + 'assets/' + p;
const nameOf = (lang, kind, id) => BASE[lang].move[kind][id];
const foodName = (lang, cat, i) => BASE[lang].food.cats[cat].items[i];
const unitWord = (lang, u) => T(lang, 'u_' + u);
const doseHtml = (lang, i) => ltr((i.sets ? i.sets + ' × ' : '') + i.val) + ' ' + esc(unitWord(lang, i.unit));
const jsonSafe = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
function poseSvg(id, label, cls) { return POSES[id] ? Fig.svg(POSES[id], undefined, { label: label, cls: cls }) : ''; }

const BRAND = '<svg class="mark" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="30" rx="9" fill="currentColor"/><path d="M8.5 20.5c0-6.5 4.2-10.8 12.8-10.8 0 8.6-4.2 12.8-10.6 12.8-1.4 0-2.2-.7-2.2-2z" fill="#fff"/><path d="M9.8 21.4c3.2-3.3 5.5-5.6 8.6-8.6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
const GLOBE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>';
const ARROW = '<svg class="flip" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONS = {
  diet: '<path d="M12 7c-2-2-6-1.5-6.5 2.5C5 14 8 20 12 19.5c4 .5 7-5.5 6.5-10C18 5.5 14 5 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
  routine: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  skin: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
  move: '<circle cx="12" cy="5" r="2"/><path d="M12 8v6M12 10l-4 3M12 10l4 3M12 14l-3 6M12 14l3 6"/>'
};
const icon = k => '<svg class="ico" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>';

/* ---------- layout ---------- */
function header(lang, slug) {
  const t = k => T(lang, k), cur = on => (on ? ' aria-current="page"' : '');
  const links = [
    [href(lang, lang, 'index'), t('nav_home'), slug === 'index'],
    [href(lang, lang, 'index') + '#ages', t('nav_ages'), AGE_SLUGS.includes(slug)],
    [href(lang, lang, 'yoga'), t('nav_yoga'), slug === 'yoga'],
    [href(lang, lang, 'exercises'), t('nav_ex'), slug === 'exercises'],
    [href(lang, lang, 'food'), t('nav_food'), slug === 'food']
  ].map(l => '<a href="' + l[0] + '"' + cur(l[2]) + '>' + esc(l[1]) + '</a>').join('');
  const langs = LANGS.map(l => '<li><a href="' + href(lang, l, slug) + '" lang="' + l + '" hreflang="' + l + '"' + (l === lang ? ' aria-current="true"' : '') + '>' + NAMES[l] + '</a></li>').join('');
  return '<a class="skip" href="#main">' + esc(t('skip')) + '</a>\n<header class="top"><div class="wrap bar">' +
    '<a class="brand" href="' + href(lang, lang, 'index') + '">' + BRAND + '<span>HealthyWorld</span></a>' +
    '<nav class="nav" aria-label="' + esc(t('nav_label')) + '">' + links + '</nav>' +
    '<details class="langsw"><summary aria-label="' + esc(t('lang_label')) + '">' + GLOBE + '<span>' + NAMES[lang] + '</span></summary><ul>' + langs + '</ul></details>' +
    '</div></header>';
}
function footer(lang) {
  const t = k => T(lang, k), li = (slug, label) => '<li><a href="' + href(lang, lang, slug) + '">' + label + '</a></li>';
  const ages = G.map(g => li(g.slug, ltr(g.label) + ' ' + esc(BASE[lang].groups[g.id].name))).join('');
  return '<footer class="foot"><div class="wrap"><div class="foot-grid">' +
    '<div><a class="brand" href="' + href(lang, lang, 'index') + '">' + BRAND + '<span>HealthyWorld</span></a><p class="fine">' + esc(t('f_tagline')) + '</p></div>' +
    '<div><h2 class="fh">' + esc(t('f_guides')) + '</h2><ul>' + ages + '</ul></div>' +
    '<div><h2 class="fh">' + esc(t('f_explore')) + '</h2><ul>' + li('yoga', esc(t('nav_yoga'))) + li('exercises', esc(t('nav_ex'))) + li('food', esc(t('nav_food'))) + '</ul></div>' +
    '<div><h2 class="fh">' + esc(t('f_about')) + '</h2><ul>' + li('about', esc(t('p_about'))) + li('contact', esc(t('p_contact'))) + li('privacy', esc(t('p_privacy'))) + li('disclaimer', esc(t('p_disclaimer'))) + '</ul></div>' +
    '</div><p class="fine">' + esc(t('disclaimer')) + '</p><p class="fine">&copy; ' + DATE.slice(0, 4) + ' HealthyWorld. ' + esc(t('f_rights')) + '</p></div></footer>';
}
function crumbs(lang, items) {
  const last = items.length - 1;
  return '<nav class="crumbs" aria-label="' + esc(T(lang, 'crumb_label')) + '"><ol>' + items.map((c, i) =>
    '<li>' + (i === last ? '<span aria-current="page">' + esc(c.label) + '</span>' : '<a href="' + c.href + '">' + esc(c.label) + '</a>') + '</li>').join('') + '</ol></nav>';
}
function crumbLd(lang, items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.abs })) };
}
const FONTS = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Sora:wght@500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Arabic:wght@400;500;600&family=Noto+Nastaliq+Urdu:wght@400;500;600&display=swap';

// o: {title, desc, body, kind:'home'|'article'|'page', crumbItems, scripts:[], noSuffix}
function layout(lang, slug, o) {
  const title = o.noSuffix ? o.title : o.title + ' | HealthyWorld', desc = trunc(o.desc, 158), url = canon(lang, slug);
  const alts = LANGS.map(l => '<link rel="alternate" hreflang="' + l + '" href="' + canon(l, slug) + '">').join('\n') + '\n<link rel="alternate" hreflang="x-default" href="' + canon('en', slug) + '">';
  const pub = { '@type': 'Organization', name: 'HealthyWorld', url: SITE + '/' };
  const main = o.kind === 'home'
    ? { '@type': 'WebSite', name: 'HealthyWorld', url: canon(lang, 'index'), inLanguage: lang, description: desc, publisher: pub }
    : { '@type': o.kind === 'article' ? 'Article' : 'WebPage', headline: o.title, name: o.title, description: desc, inLanguage: lang, url: url, dateModified: DATE, mainEntityOfPage: url, publisher: pub };
  const graph = [main].concat(o.crumbItems ? [crumbLd(lang, o.crumbItems)] : []);
  const ld = jsonSafe({ '@context': 'https://schema.org', '@graph': graph });
  const scripts = (o.scripts || []).map(s => s.startsWith('<') ? s : '<script src="' + asset(lang, s) + '" defer></script>').join('\n');
  return '<!doctype html>\n<html lang="' + lang + '" dir="' + (RTL[lang] ? 'rtl' : 'ltr') + '">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' + esc(title) + '</title>\n<meta name="description" content="' + esc(desc) + '">\n' +
    '<link rel="canonical" href="' + url + '">\n' + alts + '\n' +
    '<meta property="og:type" content="' + (o.kind === 'article' ? 'article' : 'website') + '">\n<meta property="og:site_name" content="HealthyWorld">\n' +
    '<meta property="og:title" content="' + esc(title) + '">\n<meta property="og:description" content="' + esc(desc) + '">\n<meta property="og:url" content="' + url + '">\n' +
    '<meta property="og:locale" content="' + LOCALE[lang] + '">\n<meta name="twitter:card" content="summary">\n<meta name="theme-color" content="#F1F3F3">\n' +
    '<link rel="icon" href="' + asset(lang, 'favicon.svg') + '" type="image/svg+xml">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link rel="stylesheet" href="' + FONTS + '">\n<link rel="stylesheet" href="' + asset(lang, 'style.css') + '">\n' +
    '<script>document.documentElement.classList.add("js")</script>\n' +
    '<script type="application/ld+json">' + ld + '</script>\n' +
    '<!-- Google AdSense: paste the script Google gives you here after your site is approved. -->\n' +
    '</head>\n<body>\n' + header(lang, slug) + '\n' + o.body + '\n' + footer(lang) + '\n' + scripts + '\n</body>\n</html>\n';
}

/* ---------- shared components ---------- */
function ageChips(lang, activeSlug, withNames) {
  return G.map(g => {
    const on = g.slug === activeSlug;
    return '<a class="chip" data-min="' + g.min + '" data-max="' + g.max + '" href="' + href(lang, lang, g.slug) + '"' + (on ? ' aria-current="page"' : '') + '><b>' + ltr(g.label) + '</b><small>' + esc(BASE[lang].groups[g.id].name) + '</small></a>';
  }).join('');
}
function pips(lang, l) {
  return '<span class="pips"><span class="pip-dots" aria-hidden="true">' + [1, 2, 3].map(n => '<i' + (n <= l ? ' class="on"' : '') + '></i>').join('') + '</span><span class="pip-l">' + esc(T(lang, 'lvl' + l)) + '</span></span>';
}
function miniCard(lang, kind, id) {
  const item = KIND[kind].list.find(x => x.id === id), tx = nameOf(lang, kind, id);
  return '<a class="mini" href="' + href(lang, lang, KIND[kind].page) + '#' + id + '"><span class="mini-art">' + poseSvg(id, tx.n) + '</span><span class="mini-body"><b>' + esc(tx.n) + '</b><span class="chip dose">' + doseHtml(lang, item) + '</span></span></a>';
}
function foodTile(lang, cat, idx, id) {
  return '<figure class="ftile"><img src="' + asset(lang, 'food/' + id + '.svg') + '" alt="" width="160" height="160" loading="lazy" decoding="async"><figcaption>' + esc(foodName(lang, cat, idx)) + '</figcaption></figure>';
}
function sectionHead(h, sub, id) {
  return '<div class="section-head"><h2' + (id ? ' id="' + id + '"' : '') + '>' + h + '</h2>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + '</div>';
}
function proseSections(arr) {
  return arr.map(s => '<h2>' + esc(s.h) + '</h2>' + s.p.map(p => '<p>' + esc(p) + '</p>').join('')).join('');
}
function checkList(arr, cls) { return '<ul class="check' + (cls ? ' ' + cls : '') + '">' + arr.map(x => '<li><span>' + esc(x) + '</span></li>').join('') + '</ul>'; }
function stepList(arr) { return '<ol class="steps-list">' + arr.map(x => '<li><span>' + esc(x) + '</span></li>').join('') + '</ol>'; }

/* ---------- pages ---------- */
function homePage(lang) {
  const t = k => T(lang, k), bd = BASE[lang];
  const heroLabel = nameOf(lang, 'yoga', HERO_POSE) ? nameOf(lang, 'yoga', HERO_POSE).n : '';
  const feats = [['diet', 'feat1'], ['routine', 'feat2'], ['skin', 'feat3'], ['move', 'feat4']].map(f =>
    '<div class="feat">' + icon(f[0]) + '<h3>' + esc(t(f[1] + '_t')) + '</h3><p>' + esc(t(f[1] + '_d')) + '</p></div>').join('');
  const ages = G.map((g, i) => '<a class="age-card" href="' + href(lang, lang, g.slug) + '"><span class="age-art">' + poseSvg('age' + (i + 1), bd.groups[g.id].name) + '</span><span class="age-meta"><span class="age-range">' + ltr(g.label) + '</span><h3>' + esc(bd.groups[g.id].name) + '</h3><p>' + esc(bd.groups[g.id].intro) + '</p><span class="more">' + esc(t('age_cta')) + ARROW + '</span></span></a>').join('');
  const sims = HOME_POSES.map(p => miniCard(lang, p[0], p[1])).join('');
  const steps = [1, 2, 3].map(n => '<li class="step"><span class="num">' + n + '</span><h3>' + esc(t('how' + n + '_t')) + '</h3><p>' + esc(t('how' + n + '_d')) + '</p></li>').join('');
  const foods = HOME_FOODS.map(f => foodTile(lang, f[0], f[1], CATS.find(c => c[0] === f[0])[1][f[1]])).join('');
  const body = '<main id="main">' +
    '<section class="hero"><div class="wrap hero-grid"><div class="hero-copy">' +
    '<p class="eyebrow">' + esc(t('hero_eyebrow')) + '</p><h1>' + esc(t('hero_title')) + '</h1><p class="lead">' + esc(t('hero_lead')) + '</p>' +
    '<form class="picker" id="picker" action="#" data-default="' + href(lang, lang, 'age-20-35') + '" data-range="' + esc(t('hint_range')) + '" data-young="' + esc(t('hint_young')) + '" data-hint="' + esc(t('picker_hint')) + '">' +
    '<label class="ttl" for="age">' + esc(t('picker_title')) + ': <span class="muted">' + esc(t('age_label')) + '</span></label>' +
    '<div class="picker-row"><button class="step-btn" id="ageDown" type="button" aria-label="' + esc(t('age_minus')) + '">&minus;</button>' +
    '<input class="age-input" id="age" type="number" inputmode="numeric" min="5" max="100" value="25" autocomplete="off">' +
    '<button class="step-btn" id="ageUp" type="button" aria-label="' + esc(t('age_plus')) + '">+</button><span class="muted">' + esc(t('years')) + '</span>' +
    '<a class="btn" id="goBtn" href="' + href(lang, lang, 'age-20-35') + '">' + esc(t('picker_btn')) + ARROW + '</a></div>' +
    '<div class="chips" id="chips">' + ageChips(lang, null) + '</div><p class="hint" id="hint">' + esc(t('picker_hint')) + '</p></form>' +
    '</div><div class="hero-visual"><div class="hero-card"><div class="hero-stage" id="heroStage" data-pose="' + HERO_POSE + '" data-label="' + esc(heroLabel) + '">' + poseSvg(HERO_POSE, heroLabel) + '</div>' +
    '<span class="float f1"><img src="' + asset(lang, 'food/apple.svg') + '" alt="" width="64" height="64"></span><span class="float f2"><img src="' + asset(lang, 'food/almonds.svg') + '" alt="" width="64" height="64"></span><span class="float f3"><img src="' + asset(lang, 'food/milk.svg') + '" alt="" width="64" height="64"></span></div></div></div></section>' +
    '<section class="statsband"><div class="wrap stats">' + [1, 2, 3].map(n => '<div class="stat"><b>' + esc(t('hs' + n + '_n')) + '</b><span>' + esc(t('hs' + n + '_l')) + '</span></div>').join('') + '</div></section>' +
    '<section class="section" id="ages"><div class="wrap">' + sectionHead(esc(t('ages_title')), esc(t('ages_sub'))) + '<div class="age-grid">' + ages + '</div></div></section>' +
    '<section class="section band"><div class="wrap">' + sectionHead(esc(t('feat_title')), esc(t('feat_sub'))) + '<div class="feat-grid">' + feats + '</div></div></section>' +
    '<section class="section"><div class="wrap">' + sectionHead(esc(t('sim_title')), esc(t('sim_sub'))) + '<div class="mini-grid">' + sims + '</div>' +
    '<div class="btn-row"><a class="btn" href="' + href(lang, lang, 'yoga') + '">' + esc(t('sim_yoga')) + ARROW + '</a><a class="btn btn-ghost" href="' + href(lang, lang, 'exercises') + '">' + esc(t('sim_ex')) + ARROW + '</a></div></div></section>' +
    '<section class="section band"><div class="wrap">' + sectionHead(esc(t('how_title'))) + '<ol class="steps3">' + steps + '</ol></div></section>' +
    '<section class="section"><div class="wrap">' + sectionHead(esc(t('food_home_title')), esc(t('food_home_sub'))) + '<div class="food-strip">' + foods + '</div>' +
    '<div class="btn-row"><a class="btn" href="' + href(lang, lang, 'food') + '">' + esc(t('food_cta')) + ARROW + '</a></div></div></section>' +
    '<section class="section tight"><div class="wrap"><div class="trust"><h2>' + esc(t('trust_title')) + '</h2><p>' + esc(t('trust_d')) + '</p></div></div></section></main>';
  return layout(lang, 'index', {
    title: t('home_title'), desc: t('home_desc'), body: body, kind: 'home', noSuffix: true,
    scripts: ['site.js', 'studio.js']
  });
}

function agePage(lang, g) {
  const t = k => T(lang, k), bd = BASE[lang], d = bd.groups[g.id], name = d.name, idx = G.indexOf(g);
  const ci = [{ label: t('nav_home'), href: href(lang, lang, 'index'), abs: canon(lang, 'index') }, { label: t('nav_ages'), href: href(lang, lang, 'index') + '#ages', abs: canon(lang, 'index') + '#ages' }, { label: name, abs: canon(lang, g.slug) }];
  const meals = MEALS.map(m => '<figure class="meal"><img src="' + asset(lang, 'meals/' + m[1] + '.svg') + '" alt="' + esc(fmt(t('meal_img_alt'), { meal: t(m[1]) })) + '" width="320" height="240" loading="lazy" decoding="async"><figcaption><b>' + esc(t(m[1])) + '</b><span>' + esc(d.diet.meals[m[0]]) + '</span></figcaption></figure>').join('');
  const habits = d.health.habits.map((h, i) => '<li class="habit"><span class="num">' + (i + 1) + '</span><span>' + esc(h) + '</span></li>').join('');
  const kit = ['cleanser', 'serum', 'moisturiser', 'sunscreen'].map(k => '<li><img src="' + asset(lang, 'skin/' + k + '.svg') + '" alt="" width="160" height="160" loading="lazy"><span>' + esc(t('pr_' + k)) + '</span></li>').join('');
  const mv = AGE_MOVES[g.id];
  const prev = G[idx - 1], next = G[idx + 1];
  const pager = '<nav class="pager" aria-label="' + esc(t('other_ages')) + '">' +
    (prev ? '<a class="pg prev" href="' + href(lang, lang, prev.slug) + '"><small>' + esc(t('prev_age')) + '</small><b>' + esc(bd.groups[prev.id].name) + ' ' + ltr(prev.label) + '</b></a>' : '<span></span>') +
    (next ? '<a class="pg next" href="' + href(lang, lang, next.slug) + '"><small>' + esc(t('next_age')) + '</small><b>' + esc(bd.groups[next.id].name) + ' ' + ltr(next.label) + '</b></a>' : '<span></span>') + '</nav>';
  const body = '<main id="main">' +
    '<section class="page-hero"><div class="wrap">' + crumbs(lang, ci) + '<div class="age-hero-grid"><div>' +
    '<span class="badge">' + fmt(esc(t('age_badge')), { label: ltr(g.label) }) + '</span><h1>' + esc(fmt(t('age_h1'), { name: name })) + '</h1><p class="lead">' + esc(d.intro) + '</p>' +
    '<div class="statrow"><div class="stat"><b>' + ltr(g.sleep) + '</b><span>' + esc(t('stat_sleep')) + '</span></div><div class="stat"><b>' + ltr(g.water) + '</b><span>' + esc(t('stat_water')) + '</span></div><div class="stat"><b>' + ltr(g.move) + '</b><span>' + esc(t('stat_move')) + '</span></div></div>' +
    '</div><div class="hero-art">' + poseSvg('age' + (idx + 1), name) + '</div></div></div></section>' +
    '<nav class="subnav" aria-label="' + esc(name) + '"><div class="wrap"><a href="#diet">' + esc(t('a_diet')) + '</a><a href="#health">' + esc(t('a_health')) + '</a><a href="#skin">' + esc(t('a_skin')) + '</a><a href="#move">' + esc(t('a_move')) + '</a></div></nav>' +
    '<section class="switcher"><div class="wrap"><p class="sw-t"><b>' + esc(t('other_ages')) + '</b> ' + esc(t('other_ages_sub')) + '</p><div class="chips">' + ageChips(lang, g.slug) + '</div></div></section>' +
    '<section class="section" id="diet"><div class="wrap">' + sectionHead(esc(t('sec_diet_title')), esc(d.diet.goal)) +
    '<div class="two-col"><div><h3 class="h4">' + esc(t('h_tips')) + '</h3>' + checkList(d.diet.tips) +
    '<div class="callout"><strong>' + esc(t('h_water')) + ':</strong> ' + esc(d.diet.water) + '</div><div class="callout warn"><strong>' + esc(t('h_limit')) + ':</strong> ' + esc(d.diet.limit) + '</div></div>' +
    '<div><h3 class="h4">' + esc(t('h_meals')) + '</h3><div class="meal-grid">' + meals + '</div></div></div></div></section>' +
    '<section class="section band" id="health"><div class="wrap">' + sectionHead(esc(t('sec_health_title'))) +
    '<h3 class="h4">' + esc(t('h_habits')) + '</h3><ol class="habits">' + habits + '</ol><div class="callout"><strong>' + esc(t('h_checkups')) + ':</strong> ' + esc(d.health.checkups) + '</div></div></section>' +
    '<section class="section" id="skin"><div class="wrap">' + sectionHead(esc(t('sec_skin_title'))) +
    '<h3 class="h4">' + esc(t('skin_kit')) + '</h3><ul class="kit">' + kit + '</ul>' +
    '<div class="two-col"><div class="card"><h3 class="h4">' + esc(t('h_am')) + '</h3>' + stepList(d.skin.am) + '</div><div class="card"><h3 class="h4">' + esc(t('h_pm')) + '</h3>' + stepList(d.skin.pm) + '</div></div>' +
    '<div class="two-col"><div><h3 class="h4">' + esc(t('h_weekly')) + '</h3>' + checkList(d.skin.weekly) + '</div><div><h3 class="h4">' + esc(t('h_avoid')) + '</h3>' + checkList(d.skin.avoid, 'no') + '</div></div>' +
    '<div class="callout neutral">' + esc(t('skin_note')) + '</div></div></section>' +
    '<section class="section band" id="move"><div class="wrap">' + sectionHead(esc(t('sec_move_title')), esc(fmt(t('sec_move_sub'), { name: name }))) +
    '<h3 class="h4">' + esc(t('m_yoga')) + '</h3><div class="mini-grid">' + mv.yoga.map(i => miniCard(lang, 'yoga', i)).join('') + '</div>' +
    '<h3 class="h4 gap">' + esc(t('m_ex')) + '</h3><div class="mini-grid">' + mv.ex.map(i => miniCard(lang, 'ex', i)).join('') + '</div>' +
    '<div class="btn-row"><a class="btn" href="' + href(lang, lang, 'yoga') + '">' + esc(t('see_all_yoga')) + ARROW + '</a><a class="btn btn-ghost" href="' + href(lang, lang, 'exercises') + '">' + esc(t('see_all_ex')) + ARROW + '</a></div></div></section>' +
    '<section class="section tight"><div class="wrap">' + pager + '<p class="fine center">' + esc(t('disclaimer')) + '</p></div></section></main>';
  return layout(lang, g.slug, {
    title: fmt(t('age_page_title'), { name: name, label: g.label }), desc: fmt(t('age_page_desc'), { name: name, label: g.label }),
    body: body, kind: 'article', crumbItems: ci, scripts: ['site.js']
  });
}

function studioPage(lang, kind) {
  const t = k => T(lang, k), K = KIND[kind], isYoga = kind === 'yoga', slug = K.page, list = K.list;
  const ci = [{ label: t('nav_home'), href: href(lang, lang, 'index'), abs: canon(lang, 'index') }, { label: t(isYoga ? 'nav_yoga' : 'nav_ex'), abs: canon(lang, slug) }];
  const first = list[0], ft = nameOf(lang, kind, first.id);
  const data = { kind: kind, first: first.id, poses: {}, i18n: {} };
  list.forEach(i => { const tx = nameOf(lang, kind, i.id); data.poses[i.id] = { name: tx.n, sa: i.sa || '', dose: doseHtml(lang, i), desc: tx.d, lvl: i.lvl, lvlName: t('lvl' + i.lvl) }; });
  ['ph_in', 'ph_out', 'ph_hold', 'ph_down', 'ph_up', 'ph_rest', 'ph_switch', 'st_round', 'st_play', 'st_pause', 'reduce_motion', 'st_level'].forEach(k => { data.i18n[k] = t(k); });
  const cards = list.map(i => {
    const tx = nameOf(lang, kind, i.id);
    return '<article class="pcard" id="p-' + i.id + '" data-id="' + i.id + '" data-lvl="' + i.lvl + '"><button class="pcard-btn" type="button" data-pose="' + i.id + '" aria-label="' + esc(t('st_watch') + ': ' + tx.n) + '"><span class="pthumb">' + poseSvg(i.id, '') + '</span></button>' +
      '<div class="pcard-body"><h3>' + esc(tx.n) + '</h3>' + (i.sa ? '<div class="sa">' + esc(i.sa) + '</div>' : '') + '<div class="meta"><span class="chip dose">' + doseHtml(lang, i) + '</span>' + pips(lang, i.lvl) + '</div><p>' + esc(tx.d) + '</p></div></article>';
  }).join('');
  const starter = STARTER[kind].map(id => { const tx = nameOf(lang, kind, id); return '<li><a href="#' + id + '" data-pose="' + id + '">' + esc(tx.n) + '</a></li>'; }).join('');
  const body = '<main id="main">' +
    '<section class="page-hero compact"><div class="wrap">' + crumbs(lang, ci) + '<h1>' + esc(t(isYoga ? 'yoga_h1' : 'ex_h1')) + '</h1><p class="lead">' + esc(t(isYoga ? 'yoga_lead' : 'ex_lead')) + '</p></div></section>' +
    '<section class="studio" id="studio" data-kind="' + kind + '"><div class="wrap studio-grid">' +
    '<div class="stage-col"><div class="stage-card" id="stageCard"><div class="stage-top"><span class="pill" id="phase">&nbsp;</span><span class="round" id="round"></span></div>' +
    '<div class="stage" id="stage">' + poseSvg(first.id, ft.n) + '</div>' +
    '<div class="stage-info"><h2 id="stName">' + esc(ft.n) + '</h2><div class="sa" id="stSa">' + esc(first.sa || '') + '</div><div class="meta"><span class="chip dose" id="stDose">' + doseHtml(lang, first) + '</span><span id="stPips">' + pips(lang, first.lvl) + '</span></div><p id="stDesc">' + esc(ft.d) + '</p></div>' +
    '<div class="stage-ctl"><button class="btn" id="btnPlay" type="button">' + esc(t('st_pause')) + '</button><div class="seg" id="speedSeg" role="group" aria-label="' + esc(t('st_speed')) + '"><button type="button" data-s="0.5" aria-pressed="false">' + esc(t('st_slow')) + '</button><button type="button" data-s="1" aria-pressed="true">' + esc(t('st_norm')) + '</button></div></div>' +
    '<p class="muted small" id="motionNote" hidden>' + esc(t('reduce_motion')) + '</p></div></div>' +
    '<div class="list-col"><div class="list-head"><h2 class="h3">' + esc(t(isYoga ? 'st_pick_yoga' : 'st_pick_ex')) + '</h2><div class="seg" id="lvlSeg" role="group" aria-label="' + esc(t('m_level_label')) + '"><button type="button" data-lvl="0" aria-pressed="true">' + esc(t('st_all')) + '</button>' + [1, 2, 3].map(n => '<button type="button" data-lvl="' + n + '" aria-pressed="false">' + esc(t('lvl' + n)) + '</button>').join('') + '</div></div>' +
    '<p class="muted small lvl-hint">' + [1, 2, 3].map(n => esc(t('lvl' + n)) + ': ' + esc(t('lvl' + n + '_d'))).join(' · ') + '</p><div class="plist" id="plist">' + cards + '</div></div></div></section>' +
    '<section class="section band"><div class="wrap two-col"><div class="card"><h2 class="h3">' + esc(t(isYoga ? 'routine_yoga_title' : 'routine_ex_title')) + '</h2><p class="sub">' + esc(t(isYoga ? 'routine_yoga_sub' : 'routine_ex_sub')) + '</p><ol class="starter">' + starter + '</ol></div>' +
    '<div class="card"><h2 class="h3">' + esc(t(isYoga ? 'tips_title_yoga' : 'tips_title_ex')) + '</h2>' + checkList(t(isYoga ? 'tips_yoga' : 'tips_ex')) + '<div class="callout neutral"><strong>' + esc(t('safe_title')) + ':</strong> ' + esc(t(isYoga ? 'safe_yoga' : 'safe_ex')) + '</div></div></div></section>' +
    '<section class="section tight"><div class="wrap"><div class="trust row"><div><h2 class="h3">' + esc(t('food_age_cta')) + '</h2><p>' + esc(t('food_age_sub')) + '</p></div><a class="btn" href="' + href(lang, lang, 'index') + '#ages">' + esc(t('nav_ages')) + ARROW + '</a></div></div></section></main>';
  return layout(lang, slug, {
    title: t(isYoga ? 'yoga_page_title' : 'ex_page_title'), desc: t(isYoga ? 'yoga_page_desc' : 'ex_page_desc'), body: body, kind: 'article', crumbItems: ci,
    scripts: ['site.js', '<script type="application/json" id="hw-data">' + jsonSafe(data) + '</script>', 'studio.js']
  });
}

function foodPage(lang) {
  const t = k => T(lang, k), bd = BASE[lang], f = bd.food;
  const ci = [{ label: t('nav_home'), href: href(lang, lang, 'index'), abs: canon(lang, 'index') }, { label: t('nav_food'), abs: canon(lang, 'food') }];
  const plate = '<svg class="plate" viewBox="0 0 200 200" role="img" aria-label="' + esc(t('plate_title')) + '"><circle cx="100" cy="100" r="96" fill="#fff" stroke="#DFE4E3" stroke-width="4"/><circle cx="100" cy="100" r="80" fill="#F1F3F3"/>' +
    '<path d="M100 100H20A80 80 0 0 1 180 100Z" fill="#7FB394"/><path d="M100 100H180A80 80 0 0 1 100 180Z" fill="#E3A77C"/><path d="M100 100V180A80 80 0 0 1 20 100Z" fill="#E7CF9C"/>' +
    '<path d="M20 100H180M100 100V180" stroke="#fff" stroke-width="3"/></svg>';
  const legend = '<ul class="legend"><li><i style="background:#7FB394"></i><span><b>50%</b> ' + esc(t('plate_veg')) + '</span></li><li><i style="background:#E3A77C"></i><span><b>25%</b> ' + esc(t('plate_pro')) + '</span></li><li><i style="background:#E7CF9C"></i><span><b>25%</b> ' + esc(t('plate_gr')) + '</span></li></ul>';
  const cats = CATS.map(c => {
    const x = f.cats[c[0]];
    return '<section class="cat" id="' + c[0] + '"><div class="cat-head"><h3>' + esc(x.n) + '</h3><p>' + esc(x.why) + '</p></div><div class="food-grid">' + c[1].map((id, i) => foodTile(lang, c[0], i, id)).join('') + '</div></section>';
  }).join('');
  const swaps = f.swaps.map((s, i) => '<div class="swap"><span class="from">' + esc(s[0]) + '</span><span class="arrow">' + ARROW + '</span><span class="to"><img src="' + asset(lang, 'food/' + SWAP_ICON[i] + '.svg') + '" alt="" width="40" height="40" loading="lazy">' + esc(s[1]) + '</span></div>').join('');
  const meals = MEALS.map(m => '<figure class="meal"><img src="' + asset(lang, 'meals/' + m[1] + '.svg') + '" alt="' + esc(fmt(t('meal_img_alt'), { meal: t(m[1]) })) + '" width="320" height="240" loading="lazy" decoding="async"><figcaption><b>' + esc(t(m[1])) + '</b><span>' + esc(t(m[2])) + '</span></figcaption></figure>').join('');
  const body = '<main id="main">' +
    '<section class="page-hero compact"><div class="wrap">' + crumbs(lang, ci) + '<h1>' + esc(t('food_h1')) + '</h1><p class="lead">' + esc(t('food_lead')) + '</p></div></section>' +
    '<section class="section"><div class="wrap plate-wrap"><div>' + plate + '</div><div><h2>' + esc(t('plate_title')) + '</h2><p class="sub">' + esc(t('plate_sub')) + '</p>' + legend + '<div class="callout">' + esc(t('plate_note')) + '</div></div></div></section>' +
    '<section class="section band"><div class="wrap">' + sectionHead(esc(t('food_title')), esc(t('food_sub'))) + cats + '</div></section>' +
    '<section class="section"><div class="wrap">' + sectionHead(esc(t('swap_title'))) + '<div class="swap-grid">' + swaps + '</div>' +
    '<div class="two-col gap"><div><h3 class="h4">' + esc(t('tips_title')) + '</h3>' + checkList(f.tips) + '</div><div><h3 class="h4">' + esc(t('limit_title')) + '</h3><ul class="tags limit">' + f.limit.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div></div></section>' +
    '<section class="section band"><div class="wrap">' + sectionHead(esc(t('meals_title')), esc(t('meals_sub'))) + '<div class="meal-grid four">' + meals + '</div></div></section>' +
    '<section class="section tight"><div class="wrap"><div class="trust row"><div><h2 class="h3">' + esc(t('food_age_cta')) + '</h2><p>' + esc(t('food_age_sub')) + '</p></div><a class="btn" href="' + href(lang, lang, 'index') + '#ages">' + esc(t('nav_ages')) + ARROW + '</a></div></div></section></main>';
  return layout(lang, 'food', { title: t('food_page_title'), desc: t('food_page_desc'), body: body, kind: 'article', crumbItems: ci, scripts: ['site.js'] });
}

function prosePage(lang, slug, titleK, descK, h1K, sections, extraTop, extraBottom) {
  const t = k => T(lang, k);
  const ci = [{ label: t('nav_home'), href: href(lang, lang, 'index'), abs: canon(lang, 'index') }, { label: t(h1K), abs: canon(lang, slug) }];
  const body = '<main id="main"><section class="page-hero compact"><div class="wrap">' + crumbs(lang, ci) + '<h1>' + esc(t(h1K)) + '</h1>' + (extraTop || '') + '</div></section>' +
    '<section class="section tight"><div class="wrap"><div class="prose">' + (sections ? proseSections(t(sections)) : '') + (extraBottom || '') + '</div></div></section></main>';
  return layout(lang, slug, { title: t(titleK), desc: t(descK), body: body, kind: 'page', crumbItems: ci, scripts: ['site.js'] });
}
function aboutPage(lang) { return prosePage(lang, 'about', 'about_title', 'about_desc', 'about_h1', 'about_sections', '<p class="lead">' + esc(T(lang, 'about_lead')) + '</p>'); }
function privacyPage(lang) { return prosePage(lang, 'privacy', 'privacy_title', 'privacy_desc', 'privacy_h1', 'privacy_sections', '<p class="muted">' + esc(T(lang, 'privacy_updated')) + '</p>'); }
function disclaimerPage(lang) { return prosePage(lang, 'disclaimer', 'disc_title', 'disc_desc', 'disc_h1', 'disc_sections', '<p class="muted">' + esc(T(lang, 'disc_updated')) + '</p>'); }
function contactPage(lang) {
  const t = k => T(lang, k);
  const form = '<div class="contact-grid"><div class="card"><h2 class="h3">' + esc(t('contact_email_label')) + '</h2><p><a class="email" href="mailto:' + EMAIL + '" dir="ltr">' + EMAIL + '</a></p><p>' + esc(t('contact_resp')) + '</p><div class="callout neutral">' + esc(t('contact_medical')) + '</div></div>' +
    '<form class="card form" id="contactForm" data-to="' + EMAIL + '" action="mailto:' + EMAIL + '" method="post" enctype="text/plain">' +
    '<div class="field"><label for="cName">' + esc(t('form_name')) + '</label><input id="cName" name="name" type="text" required autocomplete="name"></div>' +
    '<div class="field"><label for="cEmail">' + esc(t('form_email')) + '</label><input id="cEmail" name="email" type="email" required autocomplete="email" dir="ltr"></div>' +
    '<div class="field"><label for="cMsg">' + esc(t('form_msg')) + '</label><textarea id="cMsg" name="message" rows="5" required></textarea></div>' +
    '<button class="btn" type="submit">' + esc(t('form_send')) + ARROW + '</button><p class="muted small">' + esc(t('form_note')) + '</p></form></div>';
  const ci = [{ label: t('nav_home'), href: href(lang, lang, 'index'), abs: canon(lang, 'index') }, { label: t('contact_h1'), abs: canon(lang, 'contact') }];
  const body = '<main id="main"><section class="page-hero compact"><div class="wrap">' + crumbs(lang, ci) + '<h1>' + esc(t('contact_h1')) + '</h1><p class="lead">' + esc(t('contact_lead')) + '</p></div></section><section class="section tight"><div class="wrap">' + form + '</div></section></main>';
  return layout(lang, 'contact', { title: t('contact_title'), desc: t('contact_desc'), body: body, kind: 'page', crumbItems: ci, scripts: ['site.js'] });
}

/* ---------- output ---------- */
function write(rel, content) { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); }
function build() {
  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  const poseFiles = fs.readdirSync(__dirname).filter(f => /^poses_.+\.js$/.test(f) && f !== 'poses_test.js').sort();
  const bundle = [fs.readFileSync(path.join(__dirname, 'figure.js'), 'utf8')].concat(poseFiles.map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')), [fs.readFileSync(path.join(__dirname, 'studio_src.js'), 'utf8')]).join('\n;\n');
  write('assets/studio.js', bundle);
  write('assets/style.css', fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'));
  write('assets/site.js', fs.readFileSync(path.join(__dirname, 'site_src.js'), 'utf8'));
  write('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><rect width="30" height="30" rx="9" fill="#2B7A68"/><path d="M8.5 20.5c0-6.5 4.2-10.8 12.8-10.8 0 8.6-4.2 12.8-10.6 12.8-1.4 0-2.2-.7-2.2-2z" fill="#fff"/><path d="M9.8 21.4c3.2-3.3 5.5-5.6 8.6-8.6" stroke="#2B7A68" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>');
  let count = 0;
  LANGS.forEach(lang => {
    const put = (slug, html) => { write(dirOf(lang) + slug + '.html', html); count++; };
    put('index', homePage(lang));
    G.forEach(g => put(g.slug, agePage(lang, g)));
    put('yoga', studioPage(lang, 'yoga'));
    put('exercises', studioPage(lang, 'ex'));
    put('food', foodPage(lang));
    put('about', aboutPage(lang));
    put('contact', contactPage(lang));
    put('privacy', privacyPage(lang));
    put('disclaimer', disclaimerPage(lang));
  });
  const urls = [];
  LANGS.forEach(l => PAGES.forEach(slug => urls.push([l, slug])));
  write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.map(u =>
    '<url><loc>' + canon(u[0], u[1]) + '</loc><lastmod>' + DATE + '</lastmod>' + LANGS.map(l => '<xhtml:link rel="alternate" hreflang="' + l + '" href="' + canon(l, u[1]) + '"/>').join('') + '<xhtml:link rel="alternate" hreflang="x-default" href="' + canon('en', u[1]) + '"/></url>').join('\n') + '\n</urlset>\n');
  write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');
  write('404.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | HealthyWorld</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/style.css"></head><body><main class="wrap" style="padding:80px 16px;text-align:center"><h1>Page not found</h1><p class="lead" style="margin-inline:auto">The page you are looking for does not exist.</p><p><a class="btn" href="/">Go to the home page</a></p></main></body></html>');
  console.log('built', count, 'pages ->', OUT);
}
build();
