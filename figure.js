/* HealthyWorld figure engine: a 2D side-view mannequin with keyframe animation.
   Runs in Node (build-time thumbnails) and in the browser (live simulations).

   WORLD: units are "body heights" (a standing figure is about 1.0 tall). x is to the right (the figure FACES +x),
   y is UP, the floor is y = 0. Every pose is drawn in this space; the camera fits itself to the figure.

   ANGLES (degrees)
     limbs  (arm/leg/foot): 0 = straight down, 90 = pointing forward (+x), 180 = straight up, -90 = backward.
     torso / head:          t = lean from vertical: 0 = upright, 90 = horizontal pointing forward (+x), 180 = hanging down,
                            negative = leaning back.

   A POSE is { loop: seconds, mat: bool, props: [...], frames: [...], thumb: seconds (optional) }.
   A FRAME (keyframe) is an object with these keys (all optional except `at` and one of p / s):
     at   : time in seconds (0 <= at < loop). The loop closes automatically back to the first frame.
     ph   : label for the segment that STARTS at this frame: 'in' | 'out' | 'hold' | 'down' | 'up' | 'rest' | 'switch'
     p    : [x,y] pelvis position.         s : [x,y] shoulder position (use p OR s, the same one in every frame of a pose)
     t    : torso lean (lower half).  sp : extra bend of the upper half of the torso (spine curve), default 0.
     h    : head tilt relative to the upper torso (+ = chin down / looking down, - = looking up). default 0.
     A    : near arm.  B : far arm (default = A).   M : far leg (default = L).   L : near leg.
            Each limb is EITHER  [a1, a2]  = forward kinematics (upper segment angle, lower segment angle)
            OR                   [x, y, b] = inverse kinematics, the wrist/ankle goes to world point (x,y);
                                 b = +1 bends the joint counter-clockwise from the line hip->ankle (knee forward for a
                                 standing leg), b = -1 the other way (elbow backward for an arm hanging down / pushing).
            A limb must use the same kind (FK or IK) in every frame of one pose.
     k    : body scale (default 1; a child is about 0.62). Positions you give are in world units, so scale p / targets yourself.
     F, G : near / far foot angle (default 90 = flat, toes forward; 0 = toes straight down, -90 = toes point backward)
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HWFig = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var R = Math.PI / 180;
  var LEN = { tor: 0.30, ua: 0.165, fa: 0.150, th: 0.245, sh: 0.245, ft: 0.10, nk: 0.045, hd: 0.062 };
  var WID = { tor: 0.095, ua: 0.046, fa: 0.040, th: 0.068, sh: 0.054, ft: 0.040, nk: 0.034 };
  var COL = { near: '#2B7A68', far: '#8DB5AA', ground: '#CDD5D3', mat: '#D5DFDC', prop: '#CBD3D1', propDark: '#B5BFBC', shadow: 'rgba(27,40,38,.09)', skin: '#EBCFB2', skinFar: '#D9BFA4', hair: '#38403E' };
  var DX = 0.016;          // far-side limbs are drawn a little forward so they peek out from behind
  var HAND = 0.026;

  function up(a) { return [Math.sin(a * R), Math.cos(a * R)]; }
  function dn(a) { return [Math.sin(a * R), -Math.cos(a * R)]; }
  function add(p, v, l) { return [p[0] + v[0] * l, p[1] + v[1] * l]; }
  function f3(n) { return (Math.round(n * 1000) / 1000).toString(); }

  function ik(o, tx, ty, l1, l2, b) {
    var dx = tx - o[0], dy = ty - o[1], d = Math.hypot(dx, dy) || 1e-6, base = Math.atan2(dy, dx);
    var max = (l1 + l2) * 0.9995, min = Math.abs(l1 - l2) + 1e-4, dc = Math.min(Math.max(d, min), max);
    var c = (l1 * l1 + dc * dc - l2 * l2) / (2 * l1 * dc), A = Math.acos(Math.max(-1, Math.min(1, c)));
    var a = base + (b >= 0 ? A : -A);
    var mid = [o[0] + l1 * Math.cos(a), o[1] + l1 * Math.sin(a)];
    var end = (d <= max && d >= min) ? [tx, ty] : [o[0] + dc * Math.cos(base), o[1] + dc * Math.sin(base)];
    return [mid, end];
  }
  function limb(o, l1, l2, s) {
    if (s.length === 3) return ik(o, s[0], s[1], l1, l2, s[2]);
    var m = add(o, dn(s[0]), l1);
    return [m, add(m, dn(s[1]), l2)];
  }
  function shiftSpec(s) { return s.length === 3 ? [s[0] + DX, s[1], s[2]] : s.slice(); }

  function norm(f) {
    var g = Object.assign({}, f);
    g.t = g.t || 0; g.sp = g.sp || 0; g.h = g.h || 0; g.k = g.k || 1;
    g.F = g.F == null ? 90 : g.F;
    g.A = g.A || [0, 0]; g.L = g.L || [0, 0.02, 1];
    g.B = g.B || shiftSpec(g.A); g.M = g.M || shiftSpec(g.L);
    g.G = g.G == null ? g.F : g.G;
    return g;
  }
  function prep(pose) {
    if (pose._p) return pose._p;
    var fr = pose.frames.map(norm).sort(function (a, b) { return a.at - b.at; });
    if (pose.closed !== false) { var c = Object.assign({}, fr[0]); c.at = pose.loop; fr.push(c); }
    pose._p = fr;
    return fr;
  }
  function lerp(a, b, e) {
    var o = {};
    Object.keys(a).forEach(function (k) {
      var x = a[k], y = b[k];
      if (typeof x === 'number' && typeof y === 'number') o[k] = x + (y - x) * e;
      else if (Array.isArray(x) && Array.isArray(y) && x.length === y.length) o[k] = x.map(function (v, i) { return v + (y[i] - v) * e; });
      else o[k] = x;
    });
    return o;
  }
  function sample(pose, tau) {
    var fr = prep(pose), L = pose.loop;
    tau = ((tau % L) + L) % L;
    var i = 0;
    while (i < fr.length - 2 && tau >= fr[i + 1].at) i++;
    var a = fr[i], b = fr[i + 1], span = (b.at - a.at) || 1, u = Math.min(1, Math.max(0, (tau - a.at) / span));
    var out = lerp(a, b, u * u * (3 - 2 * u));
    out.ph = a.ph || 'hold';
    return out;
  }

  function solve(f) {
    var k = f.k || 1, tor = LEN.tor * k, half = tor / 2, v1 = up(f.t), v2 = up(f.t + f.sp), P;
    var hr = LEN.hd * (k + (1 - k) * 0.45), nk = LEN.nk * k;
    if (f.s) P = [f.s[0] - (v1[0] + v2[0]) * half, f.s[1] - (v1[1] + v2[1]) * half];
    else P = f.p || [0, 0.51 * k];
    var M = add(P, v1, half), S = add(M, v2, half), hv = up(f.t + f.sp + f.h);
    var H = add(S, hv, nk + hr), N = add(S, hv, nk);
    var dx = DX * k, Sf = [S[0] + dx, S[1]], Pf = [P[0] + dx, P[1]];
    var armN = limb(S, LEN.ua * k, LEN.fa * k, f.A), armF = limb(Sf, LEN.ua * k, LEN.fa * k, f.B);
    var legN = limb(P, LEN.th * k, LEN.sh * k, f.L), legF = limb(Pf, LEN.th * k, LEN.sh * k, f.M);
    return {
      P: P, M: M, S: S, N: N, H: H, k: k, hr: hr, armN: armN, armF: armF, legN: legN, legF: legF,
      toeN: add(legN[1], dn(f.F), LEN.ft * k), toeF: add(legF[1], dn(f.G), LEN.ft * k)
    };
  }

  function pts(J) {
    return [J.P, J.M, J.S, J.H, J.armN[0], J.armN[1], J.armF[0], J.armF[1], J.legN[0], J.legN[1], J.legF[0], J.legF[1], J.toeN, J.toeF];
  }

  /* camera that fits the whole loop, with the floor kept in view; cached on the pose */
  function viewOf(pose) {
    if (pose.view) return pose.view;
    if (pose._v) return pose._v;
    var x0 = 1e9, x1 = -1e9, y0 = 0, y1 = -1e9, n = 36, i, k, p, J, fr;
    for (i = 0; i < n; i++) {
      fr = sample(pose, pose.loop * i / n); J = solve(fr);
      pts(J).forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); y0 = Math.min(y0, q[1]); });
      y1 = Math.max(y1, J.H[1] + LEN.hd);
    }
    (pose.props || []).forEach(function (pr) {
      if (pr.k === 'wall') { x1 = Math.max(x1, pr.x + 0.08); }
      if (pr.k === 'chair') { x0 = Math.min(x0, pr.x0); x1 = Math.max(x1, pr.x1); y1 = Math.max(y1, pr.h + (pr.back ? 0.35 : 0)); }
    });
    var pad = 0.12, aspect = 1.4;
    var w = Math.max(x1 - x0 + 2 * pad, 1.1), h = Math.max(y1 - Math.min(y0, 0) + 2 * pad, 0.85);
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    var cx = (x0 + x1) / 2, vx = cx - w / 2, floorPad = Math.min(0.16, h * 0.12);
    var vy = -(Math.max(y1 + pad, h - floorPad));       // top of view in svg coords (y flipped)
    var v = [vx, Math.min(vy, -(h - floorPad)), w, h];
    pose._v = v;
    return v;
  }

  function seg(a, b, w, c) {
    return '<path d="M' + f3(a[0]) + ' ' + f3(-a[1]) + 'L' + f3(b[0]) + ' ' + f3(-b[1]) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>';
  }
  function dot(p, r, c) { return '<circle cx="' + f3(p[0]) + '" cy="' + f3(-p[1]) + '" r="' + r + '" fill="' + c + '"/>'; }
  function rect(x, y, w, h, c, rx) { return '<rect x="' + f3(x) + '" y="' + f3(-(y + h)) + '" width="' + f3(w) + '" height="' + f3(h) + '" rx="' + (rx || 0) + '" fill="' + c + '"/>'; }

  function propsSvg(pose, v) {
    var s = '';
    (pose.props || []).forEach(function (pr) {
      if (pr.k === 'wall') s += rect(pr.x, 0, 0.12, v[3] + 0.3, COL.prop) + rect(pr.x, 0, 0.012, v[3] + 0.3, COL.propDark);
      else if (pr.k === 'chair') {
        var t = 0.035, lw = 0.03;
        s += rect(pr.x0, pr.h - t, pr.x1 - pr.x0, t, COL.propDark, 0.012);
        s += rect(pr.x0 + 0.01, 0, lw, pr.h - t, COL.prop) + rect(pr.x1 - lw - 0.01, 0, lw, pr.h - t, COL.prop);
        if (pr.back === 'left') s += rect(pr.x0, pr.h, 0.03, 0.34, COL.propDark, 0.012);
        if (pr.back === 'right') s += rect(pr.x1 - 0.03, pr.h, 0.03, 0.34, COL.propDark, 0.012);
      } else if (pr.k === 'cane') {
        s += seg([pr.x, 0.01], [pr.x, pr.h], 0.022, COL.propDark) + seg([pr.x, pr.h], [pr.x - 0.04, pr.h + 0.01], 0.022, COL.propDark);
      } else if (pr.k === 'cushion') s += rect(pr.x, 0, pr.w, pr.h, COL.propDark, pr.h / 2);
      else if (pr.k === 'block') s += rect(pr.x, 0, pr.w, pr.h, COL.propDark, 0.012);
    });
    return s;
  }

  function inner(fr, pose, v) {
    v = v || viewOf(pose);
    var J = solve(fr), s = '', k = J.k, wk = 0.55 + 0.45 * k, hs = J.hr / LEN.hd;
    s += '<path d="M' + f3(v[0] - 1) + ' 0H' + f3(v[0] + v[2] + 1) + '" stroke="' + COL.ground + '" stroke-width="0.014"/>';
    if (pose.mat) {
      var P = pts(J), mx0 = 1e9, mx1 = -1e9;
      P.forEach(function (q) { if (q[1] < 0.35) { mx0 = Math.min(mx0, q[0]); mx1 = Math.max(mx1, q[0]); } });
      mx0 = Math.min(mx0, (v[0] + v[2] / 2) - 0.45) - 0.12; mx1 = Math.max(mx1, (v[0] + v[2] / 2) + 0.45) + 0.12;
      if (pose.matRange) { mx0 = pose.matRange[0]; mx1 = pose.matRange[1]; }
      s += rect(mx0, -0.012, mx1 - mx0, 0.012, COL.mat, 0.006);
    }
    s += propsSvg(pose, v);
    var all = pts(J), minx = 1e9, maxx = -1e9;
    all.forEach(function (q) { minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); });
    var cx = (minx + maxx) / 2, rx = Math.min(0.62, Math.max(0.13, (maxx - minx) * 0.5));
    s += '<ellipse cx="' + f3(cx) + '" cy="0.004" rx="' + f3(rx) + '" ry="0.016" fill="' + COL.shadow + '"/>';
    function arm(a, c) { return seg(arguments[2], a[0], (WID.ua * wk), c) + seg(a[0], a[1], (WID.fa * wk), c) + dot(a[1], HAND * k, c === COL.far ? COL.skinFar : COL.skin); }
    function leg(l, toe, c) { return seg(arguments[3], l[0], (WID.th * wk), c) + seg(l[0], l[1], (WID.sh * wk), c) + seg(l[1], toe, (WID.ft * wk), c); }
    var Sf = [J.S[0] + DX * k, J.S[1]], Pf = [J.P[0] + DX * k, J.P[1]];
    s += arm(J.armF, COL.far, Sf);
    s += leg(J.legF, J.toeF, COL.far, Pf);
    s += '<path d="M' + f3(J.P[0]) + ' ' + f3(-J.P[1]) + 'L' + f3(J.M[0]) + ' ' + f3(-J.M[1]) + 'L' + f3(J.S[0]) + ' ' + f3(-J.S[1]) + '" stroke="' + COL.near + '" stroke-width="' + (WID.tor * wk) + '" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    var th = fr.t + fr.sp + fr.h, hv = up(th), fv = [Math.cos(th * R), -Math.sin(th * R)];
    s += seg(J.S, J.N, (WID.nk * wk), COL.skin);
    s += dot([J.H[0] - fv[0] * 0.008 + hv[0] * 0.008, J.H[1] - fv[1] * 0.008 + hv[1] * 0.008], 0.064 * hs, COL.hair);
    s += dot([J.H[0] + fv[0] * 0.010 - hv[0] * 0.004, J.H[1] + fv[1] * 0.010 - hv[1] * 0.004], 0.057 * hs, COL.skin);
    s += leg(J.legN, J.toeN, COL.near, J.P);
    s += arm(J.armN, COL.near, J.S);
    return s;
  }

  function svg(pose, tau, o) {
    o = o || {};
    var v = viewOf(pose), fr = sample(pose, tau == null ? (pose.thumb != null ? pose.thumb : 0) : tau);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + v.map(f3).join(' ') + '"' + (o.cls ? ' class="' + o.cls + '"' : '') +
      (o.label ? ' role="img" aria-label="' + String(o.label).replace(/"/g, '&quot;') + '"' : ' aria-hidden="true"') +
      ' preserveAspectRatio="xMidYMax meet"><g>' + inner(fr, pose, v) + '</g></svg>';
  }

  function validate(pose) {
    var errs = [];
    if (!(pose.loop > 0)) errs.push('loop missing');
    if (!pose.frames || pose.frames.length < 2) errs.push('need at least 2 frames');
    else {
      var last = -1, usesS = !!pose.frames[0].s, kinds = {};
      pose.frames.forEach(function (f, i) {
        if (f.at == null || f.at < 0 || f.at >= pose.loop) errs.push('frame ' + i + ' has bad at');
        if (f.at <= last) errs.push('frame ' + i + ' at not ascending');
        last = f.at;
        if (!f.p && !f.s) errs.push('frame ' + i + ' needs p or s');
        if (!!f.s !== usesS) errs.push('frame ' + i + ' mixes p and s');
        ['A', 'B', 'L', 'M'].forEach(function (k) {
          if (!f[k]) return;
          if (f[k].length !== 2 && f[k].length !== 3) errs.push('frame ' + i + ' limb ' + k + ' bad length');
          if (kinds[k] == null) kinds[k] = f[k].length; else if (kinds[k] !== f[k].length) errs.push('frame ' + i + ' limb ' + k + ' mixes FK/IK');
        });
      });
    }
    return errs;
  }

  /* browser: animated stage */
  function mount(el, pose, o) {
    o = o || {};
    var st = { pose: pose, t: 0, speed: o.speed || 1, playing: false, raf: 0, last: 0, loops: 0, lastPh: null, acc: 0 };
    var g;
    function build() {
      var v = viewOf(st.pose);
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + v.map(f3).join(' ') + '" preserveAspectRatio="xMidYMax meet" role="img" aria-label="' + (o.label || '').replace(/"/g, '&quot;') + '"><g></g></svg>';
      g = el.querySelector('g');
    }
    function draw() {
      var fr = sample(st.pose, st.t);
      g.innerHTML = inner(fr, st.pose);
      if (o.onphase && fr.ph !== st.lastPh) { st.lastPh = fr.ph; o.onphase(fr.ph); }
    }
    function tick(now) {
      if (!st.playing) return;
      var dt = Math.min(0.1, (now - st.last) / 1000); st.last = now;
      st.acc += dt;
      if (st.acc >= 1 / 40) {
        st.t += st.acc * st.speed; st.acc = 0;
        if (st.t >= st.pose.loop) { st.t -= st.pose.loop; st.loops++; if (o.onloop) o.onloop(st.loops); }
        draw();
      }
      st.raf = requestAnimationFrame(tick);
    }
    var api = {
      play: function () { if (st.playing) return; st.playing = true; st.last = performance.now(); st.raf = requestAnimationFrame(tick); if (o.onstate) o.onstate(true); },
      pause: function () { st.playing = false; cancelAnimationFrame(st.raf); if (o.onstate) o.onstate(false); },
      toggle: function () { st.playing ? api.pause() : api.play(); return st.playing; },
      speed: function (x) { st.speed = x; },
      set: function (p, label) { var was = st.playing; api.pause(); st.pose = p; st.t = 0; st.loops = 0; st.lastPh = null; if (label != null) o.label = label; build(); draw(); if (was || o.autoplay !== false) api.play(); },
      playing: function () { return st.playing; }
    };
    build(); draw();
    return api;
  }

  return { LEN: LEN, sample: sample, solve: solve, svg: svg, inner: inner, viewOf: viewOf, validate: validate, mount: mount, prep: prep, ik: ik };
});
