const sharp = require('sharp');
const OUT = "C:/Users/Pro/AppData/Local/Temp/claude/C--Users-Pro-Desktop-dilshod-aka/5f1b96cf-705e-40bb-ae93-76f718451713/scratchpad";
(async () => {
  const SIZE = 900;
  // original lockup, cropped to the same bbox as logo-full.svg
  const orig = await sharp('public/logo.png')
    .extract({ left: 1330 + 11, top: 850 + 12, width: 3224, height: 4183 })
    .resize(SIZE, null, { fit: 'inside' })
    .flatten({ background: '#ffffff' })
    .png().toBuffer();
  const svg = await sharp('public/logo-full.svg', { density: 300 })
    .resize(SIZE, null, { fit: 'inside' })
    .flatten({ background: '#ffffff' })
    .png().toBuffer();
  const a = sharp(orig), b = sharp(svg);
  const ma = await a.metadata(), mb = await b.metadata();
  console.log('orig', ma.width + 'x' + ma.height, '| svg', mb.width + 'x' + mb.height);

  // side by side
  const H = Math.max(ma.height, mb.height);
  await sharp({ create: { width: ma.width + mb.width + 30, height: H, channels: 3, background: '#ffffff' } })
    .composite([{ input: orig, left: 0, top: 0 }, { input: svg, left: ma.width + 30, top: 0 }])
    .png().toFile(`${OUT}/logo-compare.png`);

  // pixel diff on the alpha silhouette
  const ra = await sharp(orig).greyscale().resize(600, 778, { fit: 'fill' }).raw().toBuffer();
  const rb = await sharp(svg).greyscale().resize(600, 778, { fit: 'fill' }).raw().toBuffer();
  let diff = 0, inkPx = 0;
  const dbuf = Buffer.alloc(600 * 778 * 3, 255);
  for (let i = 0; i < ra.length; i++) {
    const d = Math.abs(ra[i] - rb[i]);
    if (ra[i] < 240 || rb[i] < 240) inkPx++;
    if (d > 60) { diff++; dbuf[i*3] = 255; dbuf[i*3+1] = 0; dbuf[i*3+2] = 0; }
    else if (ra[i] < 240) { dbuf[i*3] = dbuf[i*3+1] = dbuf[i*3+2] = 200; }
  }
  await sharp(dbuf, { raw: { width: 600, height: 778, channels: 3 } }).png().toFile(`${OUT}/logo-diff.png`);
  console.log('ink pixels:', inkPx, '| mismatched:', diff, '=', (diff / inkPx * 100).toFixed(2) + '% of ink');
})();
