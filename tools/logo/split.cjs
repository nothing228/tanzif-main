const sharp = require('sharp');
const fs = require('fs');
const CROP = { left: 1330, top: 850, width: 3247, height: 4207 };

(async () => {
  const { data, info } = await sharp('public/logo.png')
    .extract(CROP).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const ink = (i) => data[i] > 40;
  const label = new Int32Array(W * H).fill(-1);
  const stack = new Int32Array(W * H);
  const comps = [];
  for (let s = 0; s < W * H; s++) {
    if (!ink(s) || label[s] !== -1) continue;
    const id = comps.length;
    let sp = 0; stack[sp++] = s; label[s] = id;
    let minX=W,minY=H,maxX=-1,maxY=-1,n=0;
    while (sp > 0) {
      const p = stack[--sp]; const x = p % W, y = (p - x) / W; n++;
      if (x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y;
      for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
        if (!dx && !dy) continue;
        const nx=x+dx, ny=y+dy;
        if (nx<0||ny<0||nx>=W||ny>=H) continue;
        const q = ny*W+nx;
        if (label[q] === -1 && ink(q)) { label[q]=id; stack[sp++]=q; }
      }
    }
    comps.push({ id, minX, minY, maxX, maxY, cy: (minY+maxY)/2 });
  }

  // group by vertical position: mark / wordmark / tagline
  const groupOf = (c) => (c.cy < 2800 ? 'mark' : c.cy < 4000 ? 'word' : 'tag');
  const groups = { mark: [], word: [], tag: [] };
  comps.forEach(c => groups[groupOf(c)].push(c));
  const gid = new Int8Array(comps.length);
  comps.forEach(c => { gid[c.id] = groupOf(c) === 'mark' ? 0 : groupOf(c) === 'word' ? 1 : 2; });

  const out = {};
  for (const [name, list] of Object.entries(groups)) {
    const want = name === 'mark' ? 0 : name === 'word' ? 1 : 2;
    const minX = Math.min(...list.map(c=>c.minX)), maxX = Math.max(...list.map(c=>c.maxX));
    const minY = Math.min(...list.map(c=>c.minY)), maxY = Math.max(...list.map(c=>c.maxY));
    const w = maxX-minX+1, h = maxY-minY+1;
    // keep the original anti-aliased alpha, zero out other groups; negate for potrace
    const buf = Buffer.alloc(w*h, 255);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const p = y*W+x;
        if (label[p] !== -1 && gid[label[p]] === want) buf[(y-minY)*w + (x-minX)] = 255 - data[p];
      }
    }
    await sharp(buf, { raw: { width: w, height: h, channels: 1 } }).png().toFile(`mask-${name}.png`);
    out[name] = { minX, minY, maxX, maxY, w, h, comps: list.length };
    console.log(name, JSON.stringify(out[name]));
  }
  fs.writeFileSync('logo-boxes.json', JSON.stringify({ crop: CROP, groups: out }, null, 1));
})();
