const sharp = require('sharp');
(async () => {
  const { data, info } = await sharp('public/logo.png')
    .extract({ left: 1330, top: 850, width: 3247, height: 4207 })
    .extractChannel(3)
    .raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const ink = (i) => data[i] > 40;
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  const stack = new Int32Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (!ink(s) || label[s] !== -1) continue;
    const id = comps.length;
    let sp = 0; stack[sp++] = s; label[s] = id;
    let minX=W,minY=H,maxX=-1,maxY=-1,n=0;
    while (sp > 0) {
      const p = stack[--sp];
      const x = p % W, y = (p - x) / W;
      n++;
      if (x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y;
      // 8-connectivity
      for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
        if (!dx && !dy) continue;
        const nx=x+dx, ny=y+dy;
        if (nx<0||ny<0||nx>=W||ny>=H) continue;
        const q = ny*W+nx;
        if (label[q] === -1 && ink(q)) { label[q]=id; stack[sp++]=q; }
      }
    }
    comps.push({ id, minX, minY, maxX, maxY, n, cy: (minY+maxY)/2 });
  }
  comps.sort((a,b)=>b.n-a.n);
  console.log('components:', comps.length);
  comps.slice(0, 25).forEach(c =>
    console.log(`  #${c.id} px=${c.n} y ${c.minY}..${c.maxY} (cy=${Math.round(c.cy)}) x ${c.minX}..${c.maxX}`));
})();
