const sharp = require('sharp');
(async () => {
  const { data, info } = await sharp('public/logo.png')
    .extract({ left: 1330, top: 850, width: 3247, height: 4207 })
    .raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const rowInk = new Array(H).fill(0);
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (data[(y*W+x)*C+3] > 40) n++;
    rowInk[y] = n;
  }
  const gaps = [];
  let start = -1;
  for (let y = 0; y < H; y++) {
    if (rowInk[y] === 0) { if (start < 0) start = y; }
    else if (start >= 0) { if (y - start > 20) gaps.push([start, y - 1, y - start]); start = -1; }
  }
  if (start >= 0) gaps.push([start, H-1, H-start]);
  console.log('H =', H);
  console.log('empty bands:'); gaps.forEach(g => console.log('  ', JSON.stringify(g)));
  const segs = [];
  let prev = 0;
  for (const [s,e] of gaps) { if (s > prev) segs.push([prev, s-1]); prev = e+1; }
  if (prev < H) segs.push([prev, H-1]);
  console.log('ink segments:');
  for (const [y0,y1] of segs) {
    let minX=W, maxX=-1;
    for (let y=y0;y<=y1;y++) for (let x=0;x<W;x++) if (data[(y*W+x)*C+3] > 40) { if(x<minX)minX=x; if(x>maxX)maxX=x; }
    console.log(`   y ${y0}..${y1} (h=${y1-y0+1})  x ${minX}..${maxX} (w=${maxX-minX+1})`);
  }
})();
