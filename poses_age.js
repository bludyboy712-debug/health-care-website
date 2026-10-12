// Still "portrait" figures for the six age groups (used as card art; they could be animated too).
globalThis.HWPOSES = Object.assign(globalThis.HWPOSES || {}, {
  // child: smaller, bigger head, cheering
  age1: { loop: 4, thumb: 1, frames: [
    { at: 0, k: 0.62, p: [0, 0.31], t: 0, h: -6, A: [150, 160], B: [128, 140], L: [-0.02, 0.02, 1], M: [0.07, 0.02, 1] },
    { at: 2, k: 0.62, p: [0, 0.31], t: -2, h: -8, A: [168, 172], B: [146, 152], L: [-0.02, 0.02, 1], M: [0.07, 0.02, 1] }
  ] },
  // teen: relaxed, one hand toward pocket
  age2: { loop: 4, thumb: 0, frames: [
    { at: 0, k: 0.88, p: [0, 0.447], t: -1, h: 0, A: [-6, 55], B: [10, 18], L: [0, 0.02, 1], M: [0.05, 0.02, 1] },
    { at: 2, k: 0.88, p: [0, 0.447], t: -2, h: 2, A: [-6, 55], B: [8, 14], L: [0, 0.02, 1], M: [0.05, 0.02, 1] }
  ] },
  // young adult: mid-stride walking
  age3: { loop: 4, thumb: 0, frames: [
    { at: 0, k: 0.97, p: [0, 0.482], t: 3, h: 0, A: [-30, -14], B: [34, 22], L: [0.11, 0.02, 1], M: [-0.11, 0.05, 1], F: 90, G: 55 },
    { at: 2, k: 0.97, p: [0, 0.482], t: 3, h: 0, A: [-30, -14], B: [34, 22], L: [0.11, 0.02, 1], M: [-0.11, 0.05, 1], F: 90, G: 55 }
  ] },
  // adult: calm, upright
  age4: { loop: 4, thumb: 0, frames: [
    { at: 0, k: 1, p: [0, 0.505], t: 0, h: 0, A: [10, 4], B: [-8, 2], L: [0, 0.02, 1], M: [0.04, 0.02, 1] },
    { at: 2, k: 1, p: [0, 0.505], t: 0, h: 0, A: [12, 6], B: [-6, 4], L: [0, 0.02, 1], M: [0.04, 0.02, 1] }
  ] },
  // mature adult: hand on hip
  age5: { loop: 4, thumb: 0, frames: [
    { at: 0, k: 0.99, p: [0, 0.5], t: 2, h: 0, A: [-38, 82], B: [6, 2], L: [0, 0.02, 1], M: [0.05, 0.02, 1] },
    { at: 2, k: 0.99, p: [0, 0.5], t: 3, h: 0, A: [-38, 82], B: [8, 4], L: [0, 0.02, 1], M: [0.05, 0.02, 1] }
  ], props: [] },
  // senior: gentle stoop with a cane
  age6: { loop: 4, thumb: 0, props: [{ k: 'cane', x: 0.2, h: 0.45 }], frames: [
    { at: 0, k: 0.95, p: [-0.02, 0.463], t: 14, sp: 6, h: 8, A: [0.2, 0.46, -1], B: [12, 8], L: [0, 0.02, 1], M: [-0.04, 0.02, 1] },
    { at: 2, k: 0.95, p: [-0.02, 0.463], t: 15, sp: 6, h: 8, A: [0.2, 0.46, -1], B: [10, 6], L: [0, 0.02, 1], M: [-0.04, 0.02, 1] }
  ] }
});
