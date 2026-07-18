const sharp = require('sharp');
(async () => {
  const { data, info } = await sharp('public/logo.png')
    .extract({ left: 1330, top: 850, width: 3247, height: 4207 })
    .raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const at = (x, y) => { const i = (y * W + x) * C; return [data[i], data[i+1], data[i+2], data[i+3]]; };

  // average colour of fully opaque pixels, bucketed by y (10 bands) and by x (10 bands)
  const bandY = Array.from({length:10}, () => ({r:0,g:0,b:0,n:0}));
  const bandX = Array.from({length:10}, () => ({r:0,g:0,b:0,n:0}));
  for (let y = 0; y < H; y += 3) {
    for (let x = 0; x < W; x += 3) {
      const [r,g,b,a] = at(x,y);
      if (a < 250) continue;
      const iy = Math.min(9, Math.floor(y / H * 10));
      const ix = Math.min(9, Math.floor(x / W * 10));
      bandY[iy].r += r; bandY[iy].g += g; bandY[iy].b += b; bandY[iy].n++;
      bandX[ix].r += r; bandX[ix].g += g; bandX[ix].b += b; bandX[ix].n++;
    }
  }
  const fmt = (b) => b.n ? `rgb(${Math.round(b.r/b.n)},${Math.round(b.g/b.n)},${Math.round(b.b/b.n)}) n=${b.n}` : 'empty';
  console.log('--- by Y (top→bottom) ---');
  bandY.forEach((b,i) => console.log(` y${i}:`, fmt(b)));
  console.log('--- by X (left→right) ---');
  bandX.forEach((b,i) => console.log(` x${i}:`, fmt(b)));
})();
