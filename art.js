'use strict';
/* HealthyWorld illustrations: flat, original SVGs generated from shared primitives. Usage: node src/art.js */
const fs = require('fs'), path = require('path');
const OUT = path.resolve(__dirname, '..', 'site', 'assets');
const BG = '#E6ECEA', INK = '#1B2826', GREEN = '#2B7A68', LEAF = '#5E9E6B', LEAF2 = '#7DB784';
const o = (n) => Math.round(n * 10) / 10;
const circ = (x, y, r, f, ex) => `<circle cx="${o(x)}" cy="${o(y)}" r="${o(r)}" fill="${f}"${ex || ''}/>`;
const ell = (x, y, rx, ry, f, rot, ex) => `<ellipse cx="${o(x)}" cy="${o(y)}" rx="${o(rx)}" ry="${o(ry)}" fill="${f}"${rot ? ` transform="rotate(${rot} ${o(x)} ${o(y)})"` : ''}${ex || ''}/>`;
const rect = (x, y, w, h, rx, f, ex) => `<rect x="${o(x)}" y="${o(y)}" width="${o(w)}" height="${o(h)}" rx="${rx}" fill="${f}"${ex || ''}/>`;
const path_ = (d, f, ex) => `<path d="${d}" fill="${f}"${ex || ''}/>`;
const line = (x1, y1, x2, y2, c, w, op) => `<path d="M${o(x1)} ${o(y1)}L${o(x2)} ${o(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"${op ? ` opacity="${op}"` : ''}/>`;
const shadow = (x, y, rx) => ell(x, y, rx, rx * 0.15, INK, 0, ' opacity=".08"');
const leaf = (x, y, rot, len, f) => ell(x, y, len, len * 0.42, f || LEAF, rot);
const dots = (list, r, f) => list.map(p => circ(p[0], p[1], p[2] || r, f)).join('');
const hi = (x, y, rx, ry, rot) => ell(x, y, rx, ry, '#FFFFFF', rot, ' opacity=".35"');

function bowl(cx, y, w, surface, extra) {
  return shadow(cx, y + w * 0.84, w * 0.95) +
    `<path d="M${cx - w} ${y}a${w} ${w * 0.85} 0 0 0 ${2 * w} 0z" fill="#FFFFFF"/>` +
    `<path d="M${cx - w * 0.7} ${y + w * 0.6}a${w} ${w * 0.85} 0 0 0 ${w * 1.4} 0z" fill="#E1E8E6" opacity=".0"/>` +
    rect(cx - w * 0.4, y + w * 0.78, w * 0.8, w * 0.1, 3, '#D5DDDB') +
    ell(cx, y, w, w * 0.22, '#EEF2F1') + ell(cx, y, w * 0.9, w * 0.17, surface) + (extra || '');
}
function glass(cx, y0, wt, wb, h, liquid, level, extra) {
  const lv = y0 + h * (1 - (level == null ? 0.82 : level)), wl = wt + (wb - wt) * (1 - (level == null ? 0.82 : level));
  return shadow(cx, y0 + h + 3, wb * 0.8) +
    `<path d="M${cx - wt / 2} ${y0}L${cx + wt / 2} ${y0}L${cx + wb / 2} ${y0 + h}L${cx - wb / 2} ${y0 + h}Z" fill="#FFFFFF" fill-opacity=".85" stroke="#D5DDDB" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M${cx - wl / 2 + 1.5} ${lv}L${cx + wl / 2 - 1.5} ${lv}L${cx + wb / 2 - 2.5} ${y0 + h - 2}L${cx - wb / 2 + 2.5} ${y0 + h - 2}Z" fill="${liquid}"/>` +
    line(cx - wt / 2 + 5, y0 + 8, cx - wb / 2 + 7, y0 + h - 8, '#FFFFFF', 3, 0.6) + (extra || '');
}
function cup(cx, y, w, liquid, extra) {
  return shadow(cx, y + w * 0.6, w * 1.1) + ell(cx, y + w * 0.5, w * 1.05, w * 0.2, '#E1E8E6') +
    `<path d="M${cx - w * 0.8} ${y - w * 0.25}h${w * 1.6}v${w * 0.35}a${w * 0.8} ${w * 0.62} 0 0 1 ${-w * 1.6} 0z" fill="#FFFFFF"/>` +
    `<path d="M${cx + w * 0.8} ${y - w * 0.1}a${w * 0.42} ${w * 0.38} 0 0 1 0 ${w * 0.6}" fill="none" stroke="#FFFFFF" stroke-width="${w * 0.16}" stroke-linecap="round"/>` +
    ell(cx, y - w * 0.25, w * 0.8, w * 0.16, liquid) + (extra || '');
}
const steam = (x, y) => [0, 14].map(d => `<path d="M${x + d} ${y}c-6 -7 6 -11 0 -18" stroke="#BFC9C6" stroke-width="3" stroke-linecap="round" fill="none"/>`).join('');
const spoon = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})">${rect(x - 2.5, y, 5, 40, 2.5, '#C7D0CD')}${ell(x, y - 1, 8, 11, '#C7D0CD')}</g>`;

/* ---------- foods: each returns SVG markup in a 160 x 160 box ---------- */
const F = {};
F.apple = () => shadow(80, 130, 34) +
  path_('M80 54C64 40 38 56 43 88c4 24 22 40 37 34c15 6 33-10 37-34c5-32-21-48-37-34z', '#C9573F') + hi(62, 76, 7, 14, 25) +
  path_('M80 54c0-8 3-14 8-18', 'none', ' stroke="#7A5A3A" stroke-width="4" stroke-linecap="round"') + leaf(94, 46, -30, 13, LEAF);
F.guava = () => shadow(70, 128, 34) + circ(66, 88, 34, '#B8C777') + ell(54, 96, 14, 11, '#E7A3A0', 0, ' opacity=".55"') + hi(52, 72, 7, 12, 30) +
  dots([[74, 70], [82, 88], [66, 104], [88, 102]], 1.8, '#8FA05A') + leaf(80, 54, -25, 12, LEAF) +
  circ(116, 108, 22, '#B8C777') + circ(116, 108, 17, '#F3C4BE') + circ(116, 108, 7, '#F7DDD6') + dots([[108, 101], [124, 102], [110, 118], [122, 116]], 1.6, '#C99A3F');
F.citrus = () => shadow(70, 126, 32) + circ(62, 88, 30, '#E8993B') + hi(50, 76, 6, 11, 30) + dots([[56, 98], [70, 80], [64, 106]], 1.4, '#C97A22') + leaf(66, 58, -20, 11, LEAF) +
  circ(108, 100, 25, '#F0A94A') + circ(108, 100, 21, '#F9DB96') +
  [0, 45, 90, 135].map(a => line(108 - 21 * Math.cos(a * Math.PI / 180), 100 - 21 * Math.sin(a * Math.PI / 180), 108 + 21 * Math.cos(a * Math.PI / 180), 100 + 21 * Math.sin(a * Math.PI / 180), '#F0A94A', 2.2)).join('') + circ(108, 100, 4, '#F0A94A');
F.spinach = () => shadow(80, 132, 34) + [-32, 0, 32].map((r, i) => `<g transform="rotate(${r} 80 128)">${line(80, 128, 80, 92, '#7DB784', 4)}${ell(80, 66, 22, 32, ['#4F9A5E', '#5FAE6E', '#4F9A5E'][i])}${line(80, 98, 80, 40, '#7DB784', 2, 0.7)}</g>`).join('');
F.carrot = () => shadow(80, 134, 36) + [-14, 14].map((r, i) => `<g transform="rotate(${r} 80 130)">${path_('M68 60Q80 52 92 60L84 128Q80 138 76 128Z', ['#E8893D', '#F09A4C'][i])}${line(72, 82, 80, 82, '#C86F25', 2.5)}${line(76, 100, 84, 100, '#C86F25', 2.5)}${leaf(80, 50, -35, 13, LEAF)}${leaf(80, 50, 35, 13, LEAF2)}${leaf(80, 44, 90, 12, LEAF)}</g>`).join('');
F.cucumber = () => shadow(80, 132, 40) + `<g transform="rotate(-28 70 80)">${rect(28, 62, 84, 34, 17, '#4F9A5E')}${rect(34, 68, 72, 8, 4, '#7DB784', ' opacity=".7"')}${dots([[48, 86], [66, 88], [84, 86], [98, 84]], 1.5, '#3F7F4C')}</g>` +
  circ(112, 112, 21, '#4F9A5E') + circ(112, 112, 16, '#D8EBC9') + circ(112, 112, 8, '#EAF4DE') + dots([[112, 102], [121, 112], [112, 122], [103, 112]], 1.4, '#9CC48A');
F.eggs = () => shadow(80, 130, 44) + ell(60, 92, 20, 26, '#F4EBDD', -8) + ell(100, 94, 20, 26, '#EFE2CF', 10) + hi(52, 82, 4, 10, -8) + hi(94, 84, 4, 10, 10) +
  `<path d="M34 112h92a46 36 0 0 1-92 0z" fill="#FFFFFF"/>` + ell(80, 112, 46, 8, '#EEF2F1') + rect(60, 138, 40, 6, 3, '#D5DDDB');
F.daal = () => bowl(80, 92, 44, '#E3B93C', ell(80, 88, 34, 12, '#E8C34E') + dots([[64, 86], [78, 82], [92, 88], [100, 84], [70, 94], [86, 94]], 2.2, '#C99A25')) + steam(70, 66);
F.chickpeas = () => bowl(80, 94, 44, '#D9B77A', ell(80, 90, 34, 11, '#E1C28A') + dots([[56, 88], [68, 82], [80, 86], [92, 82], [104, 88], [62, 96], [76, 95], [90, 96], [100, 96]], 5, '#E6CB95') + dots([[68, 82, 1.2], [92, 82, 1.2]], 1, '#C59F5F'));
F.chicken = () => shadow(80, 134, 40) + `<g transform="rotate(-35 80 88)">${rect(86, 80, 38, 11, 5, '#F3EDE0')}${circ(126, 78, 8, '#F3EDE0')}${circ(126, 93, 8, '#F3EDE0')}${ell(60, 86, 36, 28, '#C98242')}${ell(52, 78, 20, 12, '#DDA05F', 0, ' opacity=".7"')}</g>`;
F.fish = () => shadow(80, 124, 48) + path_('M24 80c18-24 52-30 80-8l28-20v56l-28-20c-28 22-62 16-80-8z', '#8FAABC') +
  path_('M24 80c18-24 52-30 80-8c-24 4-48 4-80 8z', '#A6BDCB') + circ(46, 76, 4, INK) + line(70, 62, 66, 98, '#7A97AA', 3) + line(86, 64, 82, 98, '#7A97AA', 3) + line(100, 70, 98, 94, '#7A97AA', 3);
F.beans = () => bowl(80, 94, 44, '#8E3B32', dots([], 0, '#000') + [[58, 88, -20], [74, 84, 30], [90, 86, -10], [104, 90, 40], [66, 96, 20], [84, 96, -30], [98, 98, 10]].map(b => ell(b[0], b[1], 9, 5.5, '#A2463A', b[2])).join('') + [[58, 88, -20], [90, 86, -10]].map(b => hi(b[0] - 2, b[1] - 2, 3, 1.6, b[2])).join(''));
F.roti = () => shadow(80, 130, 46) + circ(74, 86, 44, '#D9B27A') + circ(80, 80, 44, '#E8C58E') + circ(80, 80, 36, '#EFD3A0') + dots([[62, 68, 5], [90, 64, 4], [98, 88, 5], [70, 98, 4], [86, 82, 3], [58, 86, 3]], 4, '#C99A58');
F.oats = () => bowl(80, 94, 44, '#EAD9B3', ell(80, 90, 34, 11, '#EFE0BE') + dots([[62, 88], [74, 84], [88, 90], [100, 86], [70, 94], [84, 95]], 2, '#CDB78A')) + spoon(112, 52, 24);
F.brownrice = () => bowl(80, 94, 44, '#C9A272', path_('M40 92Q80 56 120 92Z', '#D2AE80') + [[60, 82], [72, 74], [86, 76], [98, 82], [68, 88], [84, 86], [104, 90], [56, 90]].map(g => ell(g[0], g[1], 4.5, 2, '#E3C89F', g[0] * 1.3)).join(''));
F.daliya = () => bowl(80, 94, 44, '#D8B46B', path_('M40 92Q80 58 120 92Z', '#E0BE7A') + dots([[62, 84], [74, 76], [88, 78], [100, 84], [70, 88], [84, 86], [96, 90], [58, 90]], 2.4, '#C49A4E'));
F.barley = () => shadow(80, 134, 30) + [-18, 0, 18].map(r => `<g transform="rotate(${r} 80 132)">${line(80, 132, 80, 54, '#C9A85A', 3)}${[0, 1, 2, 3, 4].map(i => ell(73, 60 + i * 11, 4.5, 8, '#DDB964', -22) + ell(87, 66 + i * 11, 4.5, 8, '#E5C675', 22)).join('')}${ell(80, 44, 4.5, 9, '#DDB964')}</g>`).join('');
F.millet = () => shadow(80, 128, 44) + path_('M26 124Q80 24 134 124Z', '#E3C45A') + dots([[60, 100], [72, 90], [88, 94], [100, 106], [66, 112], [82, 108], [96, 118], [52, 118], [112, 120], [80, 76], [76, 100]], 4, '#EBD072') + dots([[64, 92], [90, 102], [58, 112], [102, 114]], 2, '#C9A63F');
F.milk = () => glass(80, 40, 52, 42, 88, '#FBFBF7', 0.78, ell(80, 66, 24, 4, '#FFFFFF', 0, ' opacity=".7"'));
F.yogurt = () => bowl(80, 94, 44, '#FFFFFF', path_('M44 92Q80 56 116 92Z', '#FBFAF4') + path_('M62 80c10-6 26-6 36 0', 'none', ' stroke="#EAE6D8" stroke-width="3" stroke-linecap="round"') + circ(92, 70, 6, '#C9573F') + leaf(98, 64, -30, 6, LEAF)) + spoon(118, 52, 20);
F.lassi = () => glass(76, 36, 50, 40, 96, '#F1E7CF', 0.8, line(92, 14, 84, 80, '#2B7A68', 5) + ell(76, 62, 22, 4, '#FBF4E2')) ;
F.paneer = () => shadow(80, 130, 46) + [[46, 92, 38], [88, 98, 34], [64, 62, 32]].map(c => rect(c[0], c[1] - 4, c[2], c[2], 6, '#EAE3CF') + rect(c[0], c[1] - 4, c[2], c[2] - 9, 6, '#FBF7EA') + rect(c[0] + 3, c[1] - 1, c[2] - 6, 5, 2.5, '#FFFFFF', ' opacity=".7"')).join('');
F.chaas = () => glass(80, 40, 52, 42, 88, '#F1F1E2', 0.8, leaf(70, 34, -20, 11, LEAF) + leaf(86, 32, 25, 11, LEAF2) + leaf(78, 26, 90, 9, LEAF) + dots([[64, 80], [92, 96], [74, 108]], 2, '#E3E3CC'));
F.cheese = () => shadow(80, 126, 46) + path_('M26 100L120 56L136 112Z', '#F1C655') + path_('M26 100L136 112V126H26Z', '#E3B23D') + dots([[66, 100, 6], [100, 98, 5], [112, 108, 4]], 5, '#D9A52F') + circ(52, 114, 4, '#CF9A26') + circ(84, 118, 4.5, '#CF9A26') + hi(60, 82, 18, 3, -22);
F.almonds = () => shadow(80, 130, 44) + [[56, 86, -30], [92, 80, 25], [74, 108, 8], [106, 108, -20], [48, 112, 40]].map(a => `<g transform="rotate(${a[2]} ${a[0]} ${a[1]})">${path_(`M${a[0]} ${a[1] - 22}C${a[0] + 16} ${a[1] - 8} ${a[0] + 14} ${a[1] + 16} ${a[0]} ${a[1] + 22}C${a[0] - 14} ${a[1] + 16} ${a[0] - 16} ${a[1] - 8} ${a[0]} ${a[1] - 22}Z`, '#B98652')}${hi(a[0] - 5, a[1] - 4, 2.5, 8, 0)}</g>`).join('');
F.walnuts = () => shadow(80, 130, 44) + circ(60, 90, 28, '#B58A5B') + circ(60, 90, 28, 'none', ' stroke="#9A7146" stroke-width="3"') + path_('M60 64v52M44 72c10 6 10 40 0 46M76 72c-10 6-10 40 0 46', 'none', ' stroke="#9A7146" stroke-width="2.6" stroke-linecap="round"') +
  circ(106, 104, 22, '#C49A68') + path_('M106 82v44M92 90c8 6 8 26 0 32M120 90c-8 6-8 26 0 32', 'none', ' stroke="#A27B4B" stroke-width="2.4" stroke-linecap="round"');
F.oliveoil = () => shadow(70, 134, 28) + rect(50, 66, 40, 66, 12, '#7E9A52') + rect(62, 40, 16, 30, 4, '#7E9A52') + rect(60, 32, 20, 10, 3, '#3F5A2C') + rect(54, 90, 32, 32, 8, '#D9C24A', ' opacity=".9"') + hi(58, 84, 3, 22, 0) +
  ell(122, 112, 14, 11, '#6E8A3E') + circ(126, 108, 4, '#C9573F') + leaf(124, 96, -30, 8, LEAF);
const seedBowl = (c, c2, spoonOn) => bowl(80, 94, 44, c, path_('M44 92Q80 62 116 92Z', c) + [[60, 86], [72, 80], [86, 82], [98, 88], [66, 92], [80, 90], [94, 94], [56, 92]].map(d => ell(d[0], d[1], 3.2, 2, c2, d[0] * 2)).join('')) + (spoonOn ? spoon(116, 54, 22) : '');
F.flaxseeds = () => seedBowl('#8B5A33', '#B2814F', true);
F.chiaseeds = () => seedBowl('#3C3C3E', '#9A9A9C', true);
F.salmon = () => shadow(80, 126, 48) + `<g transform="rotate(-12 80 90)">${rect(24, 60, 112, 52, 26, '#EE8C69')}${[0, 1, 2, 3, 4].map(i => path_(`M${46 + i * 20} 66c10 10 10 34 0 44`, 'none', ' stroke="#FBD3C2" stroke-width="4" stroke-linecap="round"')).join('')}${hi(64, 68, 30, 3, 0)}</g>` +
  circ(128, 116, 15, '#F2D35E') + circ(128, 116, 11, '#F9EAA3') + line(128, 105, 128, 127, '#F2D35E', 2) + line(117, 116, 139, 116, '#F2D35E', 2);
F.water = () => glass(80, 40, 54, 44, 88, '#BCDDEB', 0.78, `<path d="M104 28c-5 7-8 11-8 15a8 8 0 0 0 16 0c0-4-3-8-8-15z" fill="#BCDDEB"/>`);
F.lemonwater = () => glass(76, 40, 54, 44, 88, '#EEF3C4', 0.8, circ(104, 46, 17, '#F2D35E') + circ(104, 46, 13, '#F9EAA3') + line(104, 33, 104, 59, '#F2D35E', 2) + line(91, 46, 117, 46, '#F2D35E', 2) + leaf(62, 40, -30, 10, LEAF) + leaf(74, 34, 20, 10, LEAF2));
F.coconutwater = () => shadow(76, 134, 36) + circ(76, 90, 40, '#6B4E36') + circ(76, 90, 40, 'none', ' stroke="#563D29" stroke-width="3"') + ell(76, 62, 24, 8, '#F3F1EA') + ell(76, 62, 18, 5, '#D6ECF3') + line(98, 24, 82, 62, '#2B7A68', 5) + hi(56, 90, 5, 14, 15);
F.greentea = () => cup(80, 94, 40, '#9DBB6B', leaf(112, 78, 40, 8, LEAF) ) + steam(66, 58);
F.herbaltea = () => cup(76, 94, 40, '#D9A25B', '') + steam(62, 58) + leaf(122, 100, -30, 10, LEAF) + leaf(130, 112, 40, 9, LEAF2) + leaf(116, 114, 10, 8, LEAF);

const icon = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">${circ(80, 80, 76, BG)}${body}</svg>\n`;
const write = (rel, s) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
Object.keys(F).forEach(k => write('food/' + k + '.svg', icon(F[k]())));

/* ---------- meals (320 x 240), composed from the food pieces ---------- */
const at = (id, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${F[id]()}</g>`;
const plate = (cx, cy, r) => shadow(cx, cy + r * 0.34, r) + ell(cx, cy, r, r * 0.34, '#FFFFFF') + ell(cx, cy, r * 0.72, r * 0.22, '#F1F4F3');
const scene = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240">${rect(0, 0, 320, 240, 18, '#EEF2F1')}${rect(0, 168, 320, 72, 0, '#E1E8E6', ' opacity=".7"')}${body}</svg>\n`;
const omelette = (cx, cy) => ell(cx, cy, 52, 18, '#F2CF5A') + path_(`M${cx - 52} ${cy}Q${cx} ${cy - 40} ${cx + 52} ${cy}Q${cx} ${cy + 8} ${cx - 52} ${cy}Z`, '#F7DE7C') + dots([[cx - 18, cy - 8, 3], [cx + 10, cy - 12, 2.5], [cx + 26, cy - 4, 3]], 3, '#6BB070');
write('meals/breakfast.svg', scene(plate(104, 164, 84) + omelette(96, 152) + at('apple', 12, 20, 0.6) + at('roti', 150, 84, 0.78) + at('milk', 214, 62, 0.86)));
write('meals/lunch.svg', scene(plate(110, 168, 92) + at('daal', 28, 72, 0.92) + at('roti', 138, 98, 0.72) + at('cucumber', 206, 78, 0.58) + at('spinach', 250, 112, 0.5)));
write('meals/snack.svg', scene(plate(160, 176, 110) + at('apple', 30, 70, 0.8) + at('guava', 96, 58, 0.8) + at('almonds', 172, 78, 0.74) + at('walnuts', 104, 104, 0.6)));
write('meals/dinner.svg', scene(at('daal', 6, 58, 1.0) + at('chicken', 124, 66, 0.86) + at('brownrice', 206, 96, 0.64) + at('spinach', 236, 48, 0.46)));

/* ---------- skin care products ---------- */
const lab = (x, y, w, c) => rect(x, y, w, 16, 4, c) + rect(x + 6, y + 6, w - 12, 4, 2, '#FFFFFF', ' opacity=".8"');
write('skin/cleanser.svg', icon(shadow(80, 134, 30) + rect(52, 62, 56, 70, 14, '#FFFFFF') + rect(52, 62, 56, 70, 14, 'none', ' stroke="#D5DDDB" stroke-width="2"') + lab(58, 88, 44, GREEN) + rect(74, 40, 12, 24, 3, '#C7D0CD') + path_('M62 36h38a4 4 0 0 1 4 4v6H62v-6a4 4 0 0 1 0-0z', '#B5BFBC') + rect(94, 36, 18, 8, 4, '#B5BFBC') + hi(60, 76, 3, 18, 0)));
write('skin/serum.svg', icon(shadow(80, 134, 28) + rect(56, 74, 48, 58, 12, '#8DB5AA') + rect(56, 74, 48, 58, 12, 'none', ' stroke="#6E9A8E" stroke-width="2"') + rect(60, 100, 40, 20, 6, '#E4EFEC', ' opacity=".8"') + rect(70, 62, 20, 14, 3, '#C7D0CD') + path_('M72 62V44a8 8 0 0 1 16 0v18z', '#4B5A57') + hi(63, 92, 3, 14, 0)));
write('skin/moisturiser.svg', icon(shadow(80, 130, 46) + rect(36, 82, 88, 48, 14, '#FFFFFF') + rect(36, 82, 88, 48, 14, 'none', ' stroke="#D5DDDB" stroke-width="2"') + rect(32, 62, 96, 26, 10, GREEN) + rect(40, 66, 80, 6, 3, '#FFFFFF', ' opacity=".25"') + lab(56, 100, 48, '#8DB5AA')));
write('skin/sunscreen.svg', icon(shadow(80, 134, 26) + path_('M54 52h52l-4 76a6 6 0 0 1-6 6H64a6 6 0 0 1-6-6z', '#F6D56A') + rect(48, 40, 64, 16, 6, '#FFFFFF') + [0, 1, 2].map(i => line(60 + i * 20, 42, 60 + i * 20, 54, '#D5DDDB', 2)).join('') + circ(80, 92, 16, '#FFFFFF') + [0, 45, 90, 135].map(a => line(80 - 12 * Math.cos(a * Math.PI / 180), 92 - 12 * Math.sin(a * Math.PI / 180), 80 + 12 * Math.cos(a * Math.PI / 180), 92 + 12 * Math.sin(a * Math.PI / 180), '#F2B544', 2.4)).join('') + circ(80, 92, 7, '#F2B544') + hi(62, 80, 3, 20, 0)));
console.log('art written:', fs.readdirSync(path.join(OUT, 'food')).length, 'food,', fs.readdirSync(path.join(OUT, 'meals')).length, 'meals,', fs.readdirSync(path.join(OUT, 'skin')).length, 'skin');
