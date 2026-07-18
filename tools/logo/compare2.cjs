const sharp = require('sharp');
const OUT = "C:/Users/Pro/AppData/Local/Temp/claude/C--Users-Pro-Desktop-dilshod-aka/5f1b96cf-705e-40bb-ae93-76f718451713/scratchpad";
const W = 900, H = 1168;
(async () => {
  // silhouettes (alpha), no flatten — compare shape coverage
  const origA = await sharp('public/logo.png')
    .extract({ left: 1341, top: 862, width: 3224, height: 4183 })
    .resize(W, H, { fit: 'fill' }).extractChannel(3).raw().toBuffer();
  const svgA = await sharp('public/logo-full.svg', { density: 220, limitInputPixels: false })
    .resize(W, H, { fit: 'fill' }).ensureAlpha().extractChannel(3).raw().toBuffer();

  let onlyOrig = 0, onlySvg = 0, both = 0;
  const d = Buffer.alloc(W*H*3, 255);
  for (let i = 0; i < W*H; i++) {
    const a = origA[i] > 128, b = svgA[i] > 128;
    if (a && b) { both++; d[i*3]=d[i*3+1]=d[i*3+2]=210; }
    else if (a && !b) { onlyOrig++; d[i*3]=255; d[i*3+1]=0; d[i*3+2]=0; }   // lost
    else if (!a && b) { onlySvg++; d[i*3]=0; d[i*3+1]=110; d[i*3+2]=255; }  // added
  }
  const ink = both + onlyOrig;
  console.log('ink px (orig):', ink);
  console.log('matched      :', both, (both/ink*100).toFixed(2) + '%');
  console.log('lost (red)   :', onlyOrig, (onlyOrig/ink*100).toFixed(2) + '%');
  console.log('added (blue) :', onlySvg, (onlySvg/ink*100).toFixed(2) + '%');
  await sharp(d, { raw: { width: W, height: H, channels: 3 } }).png().toFile(`${OUT}/logo-diff.png`);

  // colour check: average ink colour of each, on white
  const avg = async (buf) => {
    const { data, info } = await sharp(buf).flatten({ background:'#fff' }).raw().toBuffer({ resolveWithObject: true });
    let r=0,g=0,b=0,n=0;
    for (let i=0;i<data.length;i+=info.channels) {
      if (data[i]>250 && data[i+1]>250 && data[i+2]>250) continue;
      r+=data[i]; g+=data[i+1]; b+=data[i+2]; n++;
    }
    return `rgb(${Math.round(r/n)},${Math.round(g/n)},${Math.round(b/n)}) n=${n}`;
  };
  const oBuf = await sharp('public/logo.png').extract({ left: 1341, top: 862, width: 3224, height: 4183 }).resize(W,H,{fit:'fill'}).png().toBuffer();
  const sBuf = await sharp('public/logo-full.svg', { density: 220, limitInputPixels: false }).resize(W,H,{fit:'fill'}).png().toBuffer();
  console.log('avg ink colour orig:', await avg(oBuf));
  console.log('avg ink colour svg :', await avg(sBuf));
})();
