// 15 yoga poses. Side-view mannequin, figure faces +x. See figure.js for the keyframe format.
(function () {
  var H = globalThis.HWPOSES = globalThis.HWPOSES || {};
  var J = function (o) { return Object.assign({ sp: 0, h: 0, F: 90, G: 90 }, o); };

  /* ---------- reusable keyframes for the sun salutation (all limbs IK) ---------- */
  var PRAYER = J({ p: [0, 0.508], t: 0, h: 0, A: [0.13, 0.68, -1], B: [0.15, 0.66, -1], L: [0, 0.02, 1], M: [0.05, 0.02, 1] });
  var ARMSUP = J({ p: [-0.02, 0.508], t: -6, sp: -8, h: -12, A: [-0.02, 1.11, -1], B: [0.0, 1.11, -1], L: [0, 0.02, 1], M: [0.05, 0.02, 1] });
  var FOLD = J({ p: [-0.12, 0.49], t: 158, h: 12, A: [0.12, 0.03, -1], B: [0.15, 0.03, -1], L: [0, 0.02, 1], M: [0.04, 0.02, 1] });
  var LUNGE = J({ p: [-0.10, 0.24], t: 75, h: -30, A: [0.22, 0.03, -1], B: [0.26, 0.03, -1], L: [0.26, 0.025, 1], M: [-0.50, 0.04, 1], G: 20 });
  var PLANK = J({ p: [0.0135, 0.242], t: 72.7, h: -20, A: [0.30, 0.03, -1], B: [0.33, 0.03, -1], L: [-0.45, 0.10, 1], M: [-0.45, 0.10, 1], F: 0, G: 0 });
  var COBRA = J({ p: [-0.12, 0.06], t: 42, sp: 10, h: -15, A: [0.20, 0.03, -1], B: [0.23, 0.03, -1], L: [-0.60, 0.035, 1], M: [-0.60, 0.035, 1], F: -90, G: -90 });
  var DOG = J({ p: [-0.05, 0.45], t: 133, h: 30, A: [0.40, 0.03, -1], B: [0.43, 0.03, -1], L: [-0.30, 0.03, 1], M: [-0.28, 0.03, 1] });
  function at(f, t, ph) { return Object.assign({ at: t, ph: ph }, f); }

  H.tadasana = { loop: 8, mat: true, thumb: 3.5, frames: [
    { at: 0, ph: 'in',   p: [0, 0.508], t: 0,  h: 0,  A: [6, 3],     L: [0, 0.02, 1] },
    { at: 3, ph: 'hold', p: [0, 0.508], t: -3, h: -8, A: [174, 178], L: [0, 0.02, 1] },
    { at: 5, ph: 'out',  p: [0, 0.508], t: -3, h: -8, A: [174, 178], L: [0, 0.02, 1] }
  ] };

  H.marjari = { loop: 6, mat: true, thumb: 0, frames: [
    { at: 0, ph: 'in',  s: [0.28, 0.34], t: 58,  sp: 52,  h: 40,  A: [0.28, 0.024, -1], L: [-0.27, 0.022, 1], F: -90 },
    { at: 3, ph: 'out', s: [0.28, 0.34], t: 102, sp: -40, h: -30, A: [0.28, 0.024, -1], L: [-0.27, 0.022, 1], F: -90 }
  ] };

  H.balasana = { loop: 8, mat: true, thumb: 3.5, frames: [
    J({ at: 0,   ph: 'in',  p: [-0.17, 0.07], t: 76, h: 35, A: [0.42, 0.03, 1], B: [0.44, 0.03, 1], L: [85, -90], M: [85, -90], F: -90, G: -90 }),
    J({ at: 3.5, ph: 'out', p: [-0.17, 0.07], t: 84, h: 35, A: [0.42, 0.03, 1], B: [0.44, 0.03, 1], L: [85, -90], M: [85, -90], F: -90, G: -90 })
  ] };

  var cob = { A: [0.10, 0.03, -1], B: [0.12, 0.03, -1], L: [-90, -90], M: [-90, -90], F: -90, G: -90 };
  H.bhujanga = { loop: 8, mat: true, thumb: 3.5, frames: [
    J(Object.assign({ at: 0,   ph: 'in',   p: [-0.15, 0.05], t: 78, h: 12 }, cob)),
    J(Object.assign({ at: 2.5, ph: 'hold', p: [-0.15, 0.05], t: 36, sp: 14, h: -12 }, cob)),
    J(Object.assign({ at: 5.5, ph: 'out',  p: [-0.15, 0.05], t: 36, sp: 14, h: -12 }, cob))
  ] };

  H.sukhasana = { loop: 8, mat: true, thumb: 0, props: [{ k: 'cushion', x: -0.2, w: 0.4, h: 0.05 }], frames: [
    { at: 0, ph: 'in',  p: [0, 0.12], t: 0,  sp: 0,  h: 0, A: [43, 43], L: [100, -75], M: [96, -100] },
    { at: 4, ph: 'out', p: [0, 0.12], t: -2, sp: -5, h: 0, A: [43, 43], L: [100, -75], M: [96, -100] }
  ] };

  H.surya = { loop: 15, mat: true, thumb: 1.5, frames: [
    at(PRAYER, 0, 'in'), at(ARMSUP, 1.5, 'out'), at(FOLD, 3, 'in'), at(LUNGE, 4.5, 'out'), at(PLANK, 6, 'hold'),
    at(COBRA, 7.5, 'in'), at(DOG, 9, 'out'), at(LUNGE, 10.5, 'in'), at(FOLD, 12, 'out'), at(ARMSUP, 13.5, 'in')
  ] };

  H.adho = { loop: 7, mat: true, thumb: 3.5, frames: [
    J({ at: 0,   ph: 'in',  p: [-0.05, 0.46], t: 132, h: 30, A: [0.40, 0.03, -1], B: [0.43, 0.03, -1], L: [-0.30, 0.03, 1], M: [-0.28, 0.03, 1] }),
    J({ at: 3.5, ph: 'out', p: [-0.05, 0.44], t: 134, h: 30, A: [0.40, 0.03, -1], B: [0.43, 0.03, -1], L: [-0.30, 0.03, 1], M: [-0.28, 0.03, 1] })
  ] };

  var w2 = { t: 0, h: 0, A: [90, 90], B: [-90, -90], L: [0.205, 0.025, 1], M: [-0.40, 0.02, 1] };
  H.vira2 = { loop: 8, mat: true, thumb: 3.5, frames: [
    J(Object.assign({ at: 0,   ph: 'in',   p: [-0.03, 0.34] }, w2)),
    J(Object.assign({ at: 3.5, ph: 'hold', p: [-0.03, 0.31] }, w2)),
    J(Object.assign({ at: 5.5, ph: 'out',  p: [-0.03, 0.31] }, w2))
  ] };

  var tri = { p: [0, 0.33], h: -55, A: [0.28, 0.10, -1], B: [180, 180], L: [0.38, 0.02, 1], M: [-0.38, 0.02, 1] };
  H.trikona = { loop: 8, mat: true, thumb: 3.5, frames: [
    J(Object.assign({ at: 0,   ph: 'in',   t: 70 }, tri)),
    J(Object.assign({ at: 3.5, ph: 'hold', t: 77 }, tri)),
    J(Object.assign({ at: 5.5, ph: 'out',  t: 77 }, tri))
  ] };

  var br = { A: [0.0, 0.03, -1], B: [0.03, 0.03, -1], L: [0.30, 0.025, 1], M: [0.32, 0.025, 1] };
  H.setu = { loop: 8, mat: true, thumb: 3, frames: [
    J(Object.assign({ at: 0, ph: 'up',   p: [0, 0.10], t: -92 }, br)),
    J(Object.assign({ at: 2, ph: 'hold', p: [0, 0.34], t: -128 }, br)),
    J(Object.assign({ at: 5, ph: 'down', p: [0, 0.34], t: -128 }, br))
  ] };

  var cr = { h: -45, A: [0.32, 0.03, -1], B: [0.35, 0.03, -1], L: [0.0, 0.17, 1], M: [0.03, 0.18, 1], F: 20, G: 20 };
  H.baka = { loop: 6, mat: true, thumb: 3, frames: [
    J(Object.assign({ at: 0, ph: 'in',  p: [0, 0.25], t: 76 }, cr)),
    J(Object.assign({ at: 3, ph: 'out', p: [0, 0.27], t: 82 }, cr))
  ] };

  var sp = { A: [0.30, 0.03, -1], B: [180, 180], L: [-0.45, 0.08, 1], M: [-0.47, 0.10, 1], h: -55 };
  H.vasistha = { loop: 8, mat: true, thumb: 3.5, frames: [
    J(Object.assign({ at: 0,   ph: 'in',   p: [0.0135, 0.23], t: 70 }, sp)),
    J(Object.assign({ at: 3.5, ph: 'hold', p: [0.0135, 0.255], t: 74 }, sp)),
    J(Object.assign({ at: 5.5, ph: 'out',  p: [0.0135, 0.255], t: 74 }, sp))
  ] };

  var hm = { p: [0, 0.45], t: 88, h: -55, A: [0.34, 0.14, -1], B: [180, 180], L: [0, 0.02, 1], G: 170 };
  H.ardha = { loop: 9, mat: true, thumb: 3, props: [{ k: 'block', x: 0.28, w: 0.14, h: 0.14 }], frames: [
    J(Object.assign({ at: 0,   ph: 'in',   M: [-30, -30] }, hm)),
    J(Object.assign({ at: 2.5, ph: 'hold', M: [-90, -90] }, hm)),
    J(Object.assign({ at: 5.5, ph: 'out',  M: [-90, -90] }, hm))
  ] };

  H.urdhva = { loop: 7, mat: true, thumb: 0, frames: [
    J({ at: 0,   ph: 'in',  p: [0, 0.47], t: 100, sp: 35, h: 25, A: [0.34, 0.03, -1], B: [0.37, 0.03, -1], L: [-0.15, 0.025, 1], M: [-0.13, 0.025, 1] }),
    J({ at: 3.5, ph: 'out', p: [0, 0.44], t: 104, sp: 30, h: 20, A: [0.34, 0.03, -1], B: [0.37, 0.03, -1], L: [-0.15, 0.025, 1], M: [-0.13, 0.025, 1] })
  ] };

  var hs = { A: [-0.04, 0.035, 1], B: [-0.02, 0.035, 1], L: [180, 180], M: [180, 180], F: 180, G: 180 };
  H.sirsa = { loop: 6, mat: true, thumb: 0, frames: [
    J(Object.assign({ at: 0, ph: 'hold', s: [0, 0.17], t: 177 }, hs)),
    J(Object.assign({ at: 3, ph: 'hold', s: [0, 0.17], t: 183 }, hs))
  ] };
})();
