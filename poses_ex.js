// 15 home exercises. Side-view mannequin, figure faces +x. See figure.js for the keyframe format.
(function () {
  var H = globalThis.HWPOSES = globalThis.HWPOSES || {};
  var J = function (o) { return Object.assign({ sp: 0, h: 0, F: 90, G: 90 }, o); };

  /* shared plank geometry: hands at x .30, ankles at x -.45 */
  var PK_UP = { p: [0.0135, 0.242], t: 72.7 };
  var PK_DN = { p: [0.039, 0.125], t: 87.1 };
  var PK = { h: -12, A: [0.30, 0.03, -1], B: [0.32, 0.03, -1], L: [-0.45, 0.10, 1], M: [-0.45, 0.10, 1], F: 0, G: 0 };

  H.wallpush = { loop: 3.4, mat: false, thumb: 1.6, props: [{ k: 'wall', x: 0.60 }], frames: [
    J({ at: 0,   ph: 'down', p: [0.197, 0.495], t: 18, h: 0, A: [0.60, 0.78, -1], B: [0.62, 0.78, -1], L: [0.04, 0.03, 1], M: [0.07, 0.03, 1] }),
    J({ at: 1.6, ph: 'up',   p: [0.247, 0.474], t: 25, h: 0, A: [0.60, 0.78, -1], B: [0.62, 0.78, -1], L: [0.04, 0.03, 1], M: [0.07, 0.03, 1] })
  ] };

  H.squat = { loop: 4.2, mat: false, thumb: 1.8, frames: [
    J({ at: 0,   ph: 'down', p: [0, 0.508],     t: 0,  h: 0,   A: [15, 15], L: [0, 0.025, 1], M: [0.04, 0.025, 1] }),
    J({ at: 1.8, ph: 'hold', p: [-0.18, 0.30],  t: 36, h: -12, A: [90, 90], L: [0, 0.025, 1], M: [0.04, 0.025, 1] }),
    J({ at: 2.4, ph: 'up',   p: [-0.18, 0.30],  t: 36, h: -12, A: [90, 90], L: [0, 0.025, 1], M: [0.04, 0.025, 1] })
  ] };

  var gl = { A: [0.0, 0.03, -1], B: [0.03, 0.03, -1], L: [0.30, 0.025, 1], M: [0.32, 0.025, 1] };
  H.glute = { loop: 5, mat: true, thumb: 2, frames: [
    J(Object.assign({ at: 0,   ph: 'up',   p: [0, 0.10], t: -92 }, gl)),
    J(Object.assign({ at: 1.6, ph: 'hold', p: [0, 0.34], t: -128 }, gl)),
    J(Object.assign({ at: 2.6, ph: 'down', p: [0, 0.34], t: -128 }, gl))
  ] };

  H.march = { loop: 2, mat: false, thumb: 0, frames: [
    { at: 0,   ph: 'up',   p: [0, 0.51], t: 2, h: 0, A: [-25, 10], B: [60, 40], L: [88, 5], M: [0, 0], F: 70 },
    { at: 0.5, ph: 'rest', p: [0, 0.51], t: 0, h: 0, A: [5, 15],   B: [5, 15],  L: [0, 0],  M: [0, 0] },
    { at: 1,   ph: 'up',   p: [0, 0.51], t: 2, h: 0, A: [60, 40],  B: [-25, 10], L: [0, 0], M: [88, 5], G: 70 },
    { at: 1.5, ph: 'rest', p: [0, 0.51], t: 0, h: 0, A: [5, 15],   B: [5, 15],  L: [0, 0],  M: [0, 0] }
  ] };

  var kp = { h: -20, A: [0.30, 0.03, -1], B: [0.33, 0.03, -1], L: [-49, -112], M: [-49, -112], F: -90, G: -90 };
  H.kneeplank = { loop: 5, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0, ph: 'hold', s: [0.30, 0.33], t: 62 }, kp)),
    J(Object.assign({ at: 2.5, ph: 'hold', s: [0.30, 0.33], t: 60 }, kp))
  ] };

  H.pushup = { loop: 3.6, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0,   ph: 'down' }, PK_UP, PK)),
    J(Object.assign({ at: 1.5, ph: 'hold' }, PK_DN, PK)),
    J(Object.assign({ at: 1.8, ph: 'up' }, PK_DN, PK))
  ] };

  var lg = { t: 0, h: 0, A: [10, 25], B: [-5, 15], L: [0.20, 0.025, 1], M: [-0.34, 0.04, 1], G: 30 };
  H.lunge = { loop: 3.6, mat: true, thumb: 1.5, frames: [
    J(Object.assign({ at: 0,   ph: 'down', p: [-0.04, 0.43] }, lg)),
    J(Object.assign({ at: 1.5, ph: 'hold', p: [-0.04, 0.27] }, lg)),
    J(Object.assign({ at: 2.0, ph: 'up',   p: [-0.04, 0.27] }, lg))
  ] };

  H.plank = { loop: 4, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0, ph: 'hold', p: [0.0135, 0.242], t: 72.7 }, PK)),
    J(Object.assign({ at: 2, ph: 'hold', p: [0.0135, 0.246], t: 73.4 }, PK))
  ] };

  var mc = { p: PK_UP.p, t: PK_UP.t, h: -12, A: PK.A, B: PK.B, F: 0, G: 0 };
  H.climber = { loop: 1.6, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0,   ph: 'switch', L: [0.05, 0.12, 1], M: [-0.45, 0.10, 1] }, mc)),
    J(Object.assign({ at: 0.8, ph: 'switch', L: [-0.45, 0.10, 1], M: [0.07, 0.12, 1] }, mc))
  ] };

  var dp = { h: 0, A: [-0.21, 0.42, -1], B: [-0.19, 0.42, -1], L: [0.12, 0.03, 1], M: [0.14, 0.03, 1] };
  H.dip = { loop: 3.6, mat: false, thumb: 0, props: [{ k: 'chair', x0: -0.58, x1: -0.18, h: 0.42, back: 'left' }], frames: [
    J(Object.assign({ at: 0,   ph: 'down', p: [-0.10, 0.43], t: 0 }, dp)),
    J(Object.assign({ at: 1.5, ph: 'hold', p: [-0.10, 0.21], t: 0 }, dp)),
    J(Object.assign({ at: 1.8, ph: 'up',   p: [-0.10, 0.21], t: 0 }, dp))
  ] };

  var bp = function (o) { return J(Object.assign({ L: [0, 0.025, 1], M: [0.04, 0.025, 1] }, o)); };
  H.burpee = { loop: 6, mat: true, thumb: 0, frames: [
    bp({ at: 0,   ph: 'down',   p: [0, 0.508], t: 0, h: 0, A: [0.03, 0.52, -1], B: [0.0, 0.50, -1] }),
    bp({ at: 0.9, ph: 'switch', p: [-0.14, 0.25], t: 75, h: -30, A: [0.28, 0.03, -1], B: [0.31, 0.03, -1] }),
    J({ at: 1.7, ph: 'hold', p: PK_UP.p, t: PK_UP.t, h: -12, A: PK.A, B: PK.B, L: [-0.45, 0.10, 1], M: [-0.45, 0.10, 1], F: 0, G: 0 }),
    J({ at: 2.4, ph: 'switch', p: PK_UP.p, t: PK_UP.t, h: -12, A: PK.A, B: PK.B, L: [-0.45, 0.10, 1], M: [-0.45, 0.10, 1], F: 0, G: 0 }),
    bp({ at: 3.3, ph: 'up',     p: [-0.14, 0.25], t: 75, h: -30, A: [0.28, 0.03, -1], B: [0.31, 0.03, -1] }),
    bp({ at: 4.3, ph: 'up',     p: [0, 0.76], t: 0, h: -10, A: [-0.02, 1.12, -1], B: [0.0, 1.12, -1], L: [0, 0.29, 1], M: [0.03, 0.30, 1], F: 40, G: 40 }),
    bp({ at: 5.2, ph: 'rest',   p: [0, 0.508], t: 0, h: 0, A: [0.03, 0.52, -1], B: [0.0, 0.50, -1] })
  ] };

  var jq = function (o) { return J(Object.assign({ L: [0, 0.025, 1], M: [0.04, 0.025, 1] }, o)); };
  H.jumpsquat = { loop: 3.4, mat: false, thumb: 1.55, frames: [
    jq({ at: 0,    ph: 'down', p: [0, 0.508],    t: 0,  h: 0,   A: [15, 15] }),
    jq({ at: 1.2,  ph: 'hold', p: [-0.18, 0.30], t: 36, h: -12, A: [-30, -20] }),
    jq({ at: 1.55, ph: 'up',   p: [0, 0.78],     t: 0,  h: -10, A: [165, 170], L: [0, 0.30, 1], M: [0.03, 0.31, 1], F: 40, G: 40 }),
    jq({ at: 2.0,  ph: 'down', p: [-0.10, 0.38], t: 20, h: -8,  A: [60, 60] }),
    jq({ at: 2.6,  ph: 'rest', p: [0, 0.508],    t: 0,  h: 0,   A: [15, 15] })
  ] };

  var pk = { h: 0, A: [0.32, 0.03, -1], B: [0.35, 0.03, -1], L: [-0.28, 0.03, 1], M: [-0.26, 0.03, 1] };
  H.pike = { loop: 3.6, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0,   ph: 'down', p: [-0.06, 0.47], t: 150 }, pk)),
    J(Object.assign({ at: 1.5, ph: 'hold', p: [0.02, 0.40], t: 145, h: 25 }, pk)),
    J(Object.assign({ at: 1.8, ph: 'up',   p: [0.02, 0.40], t: 145, h: 25 }, pk))
  ] };

  var hl = { A: [-110, -110], B: [-105, -105], L: [112, 112], M: [112, 112], F: 180, G: 180 };
  H.hollow = { loop: 8, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0, ph: 'hold', p: [0, 0.06], t: -60, h: 30 }, hl)),
    J(Object.assign({ at: 4, ph: 'hold', p: [0, 0.06], t: -55, h: 32, L: [108, 108], M: [108, 108] }, { A: hl.A, B: hl.B, F: 180, G: 180 }))
  ] };

  var sq = { t: 5, h: 0, A: [20, 25], B: [10, 20], L: [0.20, 0.025, 1], M: [-0.36, 0.46, 1], G: -85 };
  H.split = { loop: 4, mat: false, thumb: 1.6, props: [{ k: 'chair', x0: -0.62, x1: -0.30, h: 0.42 }], frames: [
    J(Object.assign({ at: 0,   ph: 'down', p: [-0.02, 0.47] }, sq)),
    J(Object.assign({ at: 1.6, ph: 'hold', p: [-0.03, 0.28] }, sq)),
    J(Object.assign({ at: 2.1, ph: 'up',   p: [-0.03, 0.28] }, sq))
  ] };
})();
