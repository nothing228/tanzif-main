const fs = require('fs');
const P = JSON.parse(fs.readFileSync('logo-paths.json', 'utf8'));

// gradient measured from the PNG (least-squares fit): near-vertical axis, 101.6°
const AX = -0.202, AY = 0.979, T0 = -0.105, T1 = 0.959;
// stops nudged +3/+3/+6 so the rendered average matches the PNG exactly
const STOPS = [
  [0.00, '#e5c58e'],
  [0.25, '#e5c690'],
  [0.50, '#e5c68f'],
  [0.75, '#e8cc9a'],
  [1.00, '#e8ca98'],
];

function grad(id, w, h) {
  // reproduce the sampled axis in this piece's user space
  const x1 = T0 * AX * w, y1 = T0 * AY * h;
  const x2 = T1 * AX * w, y2 = T1 * AY * h;
  const stops = STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}">${stops}</linearGradient>`;
}

// --- mark only ---
{
  const { d, w, h } = P.mark;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none"><defs>${grad('g', w, h)}</defs><path d="${d}" fill="url(#g)" fill-rule="evenodd"/></svg>`;
  fs.writeFileSync('public/logo-mark.svg', svg);
  console.log('logo-mark.svg', svg.length, 'bytes');
}

// --- full lockup: mark + wordmark + tagline at their original offsets ---
{
  const X0 = 11, Y0 = 12;                 // lockup bbox origin inside the crop
  const W = 3234 - 11 + 1, H = 4194 - 12 + 1;
  const place = (k) => `<path d="${P[k].d}" fill="url(#g)" fill-rule="evenodd" transform="translate(${P[k].minX - X0} ${P[k].minY - Y0})"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none"><defs>${grad('g', W, H)}</defs>${place('mark')}${place('word')}${place('tag')}</svg>`;
  fs.writeFileSync('public/logo-full.svg', svg);
  console.log('logo-full.svg', svg.length, 'bytes | viewBox', W, H);
}

// --- wordmark only (for the header lockup) ---
{
  const { d, w, h } = P.word;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none"><defs>${grad('g', w, h)}</defs><path d="${d}" fill="url(#g)" fill-rule="evenodd"/></svg>`;
  fs.writeFileSync('public/logo-word.svg', svg);
  console.log('logo-word.svg', svg.length, 'bytes');
}
