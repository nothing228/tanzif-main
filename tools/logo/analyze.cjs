const sharp = require('sharp');
(async () => {
  const img = sharp('public/logo.png');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  let transparent = 0, whiteish = 0, colored = 0;
  const at = (x, y) => { const i = (y * W + x) * C; return [data[i], data[i+1], data[i+2], C === 4 ? data[i+3] : 255]; };
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const [r, g, b, a] = at(x, y);
      if (a < 16) { transparent++; continue; }
      // ink = anything noticeably darker/warmer than white
      if (r > 245 && g > 245 && b > 245) { whiteish++; continue; }
      colored++;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  console.log('bbox:', JSON.stringify({ minX, minY, maxX, maxY, w: maxX-minX, h: maxY-minY }));
  console.log('pixels(sampled):', JSON.stringify({ transparent, whiteish, colored }));
  // sample the gradient along the mark and the wordmark
  const probe = (x, y) => { const [r,g,b,a] = at(x, y); return `${x},${y} rgba(${r},${g},${b},${a})`; };
  console.log('--- vertical probes through the mark ---');
  for (const fy of [0.18, 0.28, 0.38, 0.5, 0.6]) {
    const y = Math.round(minY + (maxY - minY) * fy);
    // scan the row for the first inked pixel
    for (let x = minX; x < maxX; x++) {
      const [r,g,b,a] = at(x, y);
      if (a > 200 && !(r>245&&g>245&&b>245)) { console.log(probe(x, y)); break; }
    }
  }
  console.log('--- wordmark probes ---');
  for (const fy of [0.78, 0.84]) {
    const y = Math.round(minY + (maxY - minY) * fy);
    for (let x = minX; x < maxX; x++) {
      const [r,g,b,a] = at(x, y);
      if (a > 200 && !(r>245&&g>245&&b>245)) { console.log(probe(x, y)); break; }
    }
  }
})();
