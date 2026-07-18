const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

const BBOX = { left: 1342, top: 862, width: 3222 + 1, height: 4182 + 1 };
const PAD = 12;

(async () => {
  // 1) crop to the artwork, use the alpha channel as the shape mask
  const crop = {
    left: BBOX.left - PAD,
    top: BBOX.top - PAD,
    width: BBOX.width + PAD * 2,
    height: BBOX.height + PAD * 2,
  };
  await sharp('public/logo.png')
    .extract(crop)
    .extractChannel(3)   // alpha: opaque = ink
    .negate()            // potrace traces dark areas → ink must be black
    .png()
    .toFile('mask.png');
  console.log('mask written', JSON.stringify(crop));

  // 2) trace
  const trace = new potrace.Potrace({
    threshold: 128,
    turdSize: 2,        // drop specks smaller than this
    optCurve: true,
    optTolerance: 0.2,
    alphaMax: 1,
    color: '#000000',
    background: 'transparent',
  });
  trace.loadImage('mask.png', (err) => {
    if (err) throw err;
    const svg = trace.getSVG();
    fs.writeFileSync('traced.svg', svg);
    const paths = (svg.match(/<path/g) || []).length;
    console.log('traced.svg written | bytes:', svg.length, '| paths:', paths);
    console.log(svg.slice(0, 200));
  });
})();
