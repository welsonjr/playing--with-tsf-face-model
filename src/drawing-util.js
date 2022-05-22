import { FACEMESH_LIPS } from "@mediapipe/face_mesh"

// Lower outer.
const lowerLipsOuter = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
// Upper outer(excluding corners).
const upperLipsOuter = [185, 40, 39, 37, 0, 267, 269, 270, 409];
// Lower inner.
const lowerLipsInner = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];
// Upper inner(excluding corners).
const upperLipsInner = [191, 80, 81, 82, 13, 312, 311, 310, 415];
// Lower semi - outer.
const lowerLipsSemiOuter = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306];
// Upper semi - outer(excluding corners).
const upperLipsSemiOuter = [184, 74, 73, 72, 11, 302, 303, 304, 408];
// Lower semi - inner.
const lowerLipsSemiInner = [62, 96, 89, 179, 86, 15, 316, 403, 319, 325, 292];
// Upper semi - inner(excluding corners).
const upperLipsSemiInner = [183, 42, 41, 38, 12, 268, 271, 272, 407];

const lowerLips = [
  ...lowerLipsInner,
  ...lowerLipsOuter,
  ...lowerLipsSemiInner,
  ...lowerLipsSemiOuter,
];

const upperLips = [
  ...upperLipsInner,
  ...upperLipsOuter,
  ...upperLipsSemiInner,
  ...upperLipsSemiOuter,
];

export const drawMouth = (ctx, predictions) => {
  for (let f = 0; f < predictions.length; f++) {
    const keypoints = predictions[f].keypoints;
    drawMouthCountour(ctx, keypoints);
    drawMouthPoints(ctx, keypoints);
  }
};

const drawMouthPoints = (ctx, keypoints) => {
  const lips = [...FACEMESH_LIPS].map((i) => keypoints[i[0]]);
  for (let i = 0; i < lips.length; i++) {
    ctx.beginPath();
    ctx.arc(lips[i].x, lips[i].y, 1.5 /* radius */, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
};

const drawMouthCountour = (ctx, keypoints) => {
  ctx.lineWidth = 1;
  FACEMESH_LIPS.forEach((p, i) => {
    const start = keypoints[p[0]];
    const end = keypoints[p[1]];
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "cyan";
    ctx.stroke();
  });
}
