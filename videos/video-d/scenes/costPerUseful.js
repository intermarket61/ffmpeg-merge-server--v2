// 5:25 — cost per run falls while cost per useful page rises
SCENES.costPerUseful=()=>{
  theme('dark');
  const hd=heading('The number that matters','Cost per <span style="color:var(--accent)">useful</span> output.',420,70,80);
  const X0=470,Y0=900,W=1300,H=520, P=(f)=>[0,1,2,3,4,5].map(i=>`${X0+i*W/5},${Y0-H*f(i)}`).join(' ');
  const svg=el('div','fill'); svg.innerHTML=`<svg width="1920" height="1080" style="position:absolute;inset:0">
    <line x1="${X0}" y1="${Y0}" x2="${X0+W}" y2="${Y0}" stroke="#4a433b" stroke-width="3"/>
    <polyline class="a" points="${P(i=>.55-.07*i)}" fill="none" stroke="var(--blue)" stroke-width="7" stroke-linecap="round"/>
    <polyline class="b" points="${P(i=>.3+.022*i*i+.03*i)}" fill="none" stroke="var(--amber)" stroke-width="7" stroke-linecap="round"/></svg>`;
  const la=el('div','abs',null,'cost per run'); Object.assign(la.style,{left:(X0+W-260)+'px',top:(Y0-H*.2+30)+'px',width:'260px',textAlign:'right',whiteSpace:'nowrap',fontWeight:900,fontSize:'34px',color:'var(--blue)'});
  const lb=el('div','abs',null,'cost per page you’d send'); Object.assign(lb.style,{left:(X0+W-520)+'px',top:(Y0-H*1.02-60)+'px',width:'520px',textAlign:'right',whiteSpace:'nowrap',fontWeight:900,fontSize:'34px',color:'var(--amber)'});
  const pa=svg.querySelector('.a'), pb=svg.querySelector('.b'); [pa,pb].forEach(p=>{p.style.strokeDasharray=2000;});
  const tA=wordAt(1,'run'), tB=wordAt(1,'page');
  const camIn=cam(.2,220);
  return t=>{hd(t); pa.style.strokeDashoffset=2000*(1-ramp(t,tA-.3,1.2,inOut)); pb.style.strokeDashoffset=2000*(1-ramp(t,tB-.3,1.4,inOut));
    la.style.opacity=ramp(t,tA+.6,.3); lb.style.opacity=ramp(t,tB+.8,.3); camIn(t)};
};
