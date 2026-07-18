const potrace = require('potrace');
const fs = require('fs');
const boxes = JSON.parse(fs.readFileSync('logo-boxes.json', 'utf8'));

const traceOne = (name) => new Promise((res, rej) => {
  const t = new potrace.Potrace({
    threshold: 128, turdSize: 1, optCurve: true, optTolerance: 0.15, alphaMax: 1,
    color: '#000000', background: 'transparent',
  });
  t.loadImage(`mask-${name}.png`, (err) => {
    if (err) return rej(err);
    const svg = t.getSVG();
    const m = svg.match(/<path[^>]*\sd="([^"]+)"/);
    if (!m) return rej(new Error('no path for ' + name));
    res({ name, d: m[1], svg });
  });
});

(async () => {
  const out = {};
  for (const name of ['mark', 'word', 'tag']) {
    const { d, svg } = await traceOne(name);
    const g = boxes.groups[name];
    out[name] = { d, w: g.w, h: g.h, minX: g.minX, minY: g.minY };
    fs.writeFileSync(`traced-${name}.svg`, svg);
    console.log(`${name}: viewBox 0 0 ${g.w} ${g.h} | d length ${d.length}`);
  }
  fs.writeFileSync('logo-paths.json', JSON.stringify(out));
  console.log('total path bytes:', Object.values(out).reduce((s, o) => s + o.d.length, 0));
})();
