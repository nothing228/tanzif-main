const sharp = require('sharp');
(async () => {
  const { data, info } = await sharp('public/logo.png')
    .extract({ left: 1330, top: 850, width: 3247, height: 4207 })
    .raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const pts = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const i = (y * W + x) * C;
      if (data[i+3] < 250) continue;
      pts.push([x / W, y / H, data[i], data[i+1], data[i+2]]);
    }
  }
  // least squares: lum = a*u + b*v + c  → gradient direction (a,b)
  const lum = (r,g,b) => 0.2126*r + 0.7152*g + 0.0722*b;
  let Suu=0,Svv=0,Suv=0,Su=0,Sv=0,Sl=0,Sul=0,Svl=0,n=pts.length;
  for (const [u,v,r,g,b] of pts) {
    const l = lum(r,g,b);
    Suu+=u*u; Svv+=v*v; Suv+=u*v; Su+=u; Sv+=v; Sl+=l; Sul+=u*l; Svl+=v*l;
  }
  // solve 3x3 normal equations
  const A = [[Suu,Suv,Su],[Suv,Svv,Sv],[Su,Sv,n]];
  const B = [Sul,Svl,Sl];
  // gaussian elimination
  for (let i=0;i<3;i++){
    let p=i; for(let k=i+1;k<3;k++) if(Math.abs(A[k][i])>Math.abs(A[p][i])) p=k;
    [A[i],A[p]]=[A[p],A[i]]; [B[i],B[p]]=[B[p],B[i]];
    for(let k=i+1;k<3;k++){ const f=A[k][i]/A[i][i]; for(let j=i;j<3;j++) A[k][j]-=f*A[i][j]; B[k]-=f*B[i]; }
  }
  const x=[0,0,0];
  for(let i=2;i>=0;i--){ let s=B[i]; for(let j=i+1;j<3;j++) s-=A[i][j]*x[j]; x[i]=s/A[i][i]; }
  const [a,b] = x;
  const angle = Math.atan2(b, a) * 180 / Math.PI;
  console.log('gradient axis: du=%s dv=%s → angle %s°', a.toFixed(2), b.toFixed(2), angle.toFixed(1));

  // project points on the axis, take colour at the extremes
  const len = Math.hypot(a,b) || 1;
  const ax = a/len, ay = b/len;
  let tMin=Infinity, tMax=-Infinity;
  for (const [u,v] of pts) { const t = u*ax + v*ay; if(t<tMin)tMin=t; if(t>tMax)tMax=t; }
  const stops = 5;
  const acc = Array.from({length:stops},()=>({r:0,g:0,b:0,n:0}));
  for (const [u,v,r,g,bb] of pts) {
    const t = (u*ax + v*ay - tMin) / (tMax - tMin);
    const k = Math.min(stops-1, Math.floor(t*stops));
    acc[k].r+=r; acc[k].g+=g; acc[k].b+=bb; acc[k].n++;
  }
  const hex = (r,g,b) => '#' + [r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  console.log('--- stops along the axis ---');
  acc.forEach((s,i)=>{
    if(!s.n) return console.log(i, 'empty');
    console.log((i/(stops-1)).toFixed(2), hex(s.r/s.n, s.g/s.n, s.b/s.n), 'n='+s.n);
  });
  // gradient vector endpoints in viewBox space (0..1)
  console.log('axis unit:', ax.toFixed(3), ay.toFixed(3), '| tMin', tMin.toFixed(3), 'tMax', tMax.toFixed(3));
})();
