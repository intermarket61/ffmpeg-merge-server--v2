// The whole workflow as n8n nodes. params.mode: intro (one per line), recap (step per line + error branch), end (silent card)
SCENES.flowOverview=()=>{
  theme('dark');
  const mode=P().mode;
  const grid=el('div','fill'); grid.style.backgroundImage='radial-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px)'; grid.style.backgroundSize='34px 34px';
  const hd= mode==='end'?null: heading(mode==='intro'?'The whole workflow':'The fix',mode==='intro'?'Catch it. Answer it. <span style="color:var(--accent)">Never lose it.</span>':'Five steps. <span style="color:var(--accent)">One safety net.</span>',420,70,80);
  const W=wires();
  const N=[['hook','Webhook','catch it'],['edit','Edit Fields','tidy it'],['sheet','Google Sheets','write it down'],['mail','Gmail','reply'],['bell','Slack','tell a human'],['clock','Wait 24h','next day'],['branch','If','still new?']];
  const y=mode==='end'?300:mode==='intro'?440:360, x0=420, dx=205, sz=140;
  const nodes=N.map(([ic,n,s],i)=>node(null,x0+i*dx,y,ic,n,s,{size:sz}));
  const links=N.slice(1).map((_,i)=>W.line(x0+i*dx+sz,y+sz/2,x0+(i+1)*dx,y+sz/2));
  // step brackets above the nodes
  const groups=[[0,0],[1,2],[3,3],[4,4],[5,6]];
  const br=groups.map(([a,b],i)=>{const d=el('div','abs',null,`<span style="font-weight:900">${i+1}</span>`);
    Object.assign(d.style,{left:(x0+a*dx-6)+'px',top:(y-62)+'px',width:((b-a)*dx+sz+12)+'px',height:'40px',borderTop:'3px solid var(--accent)',borderLeft:'3px solid var(--accent)',borderRight:'3px solid var(--accent)',borderRadius:'12px 12px 0 0',
      textAlign:'center',fontSize:'26px',color:'var(--accent)',paddingTop:'2px'}); return d});
  // error branch (recap/end): Error Trigger -> alert
  const ey=y+330;
  const err=[node(null,x0+2*dx,ey,'alert','Error Trigger','if it breaks',{size:110,col:WARN}),node(null,x0+3*dx+30,ey,'phone','Telegram','tell me',{size:110,col:WARN})];
  const eLink=W.line(x0+2*dx+110,ey+55,x0+3*dx+30,ey+55,'#5b544c');
  const errLbl=el('div','abs',null,'A second, tiny workflow'); Object.assign(errLbl.style,{left:(x0+4*dx+20)+'px',top:(ey+30)+'px',fontWeight:700,fontSize:'26px',letterSpacing:'.12em',textTransform:'uppercase',color:WARN});
  let tail=null;
  if(mode==='end'){tail=el('div','abs mega',null,'Build it tonight. <span style="color:var(--accent)">Then test your own form.</span>');
    Object.assign(tail.style,{left:'420px',top:'140px',fontSize:'62px',whiteSpace:'nowrap'});}
  let nodeAt, brAt=[1e9,1e9,1e9,1e9,1e9], errAt=1e9;
  if(mode==='intro'){const L=S.lines; nodeAt=[L[1].t0,L[2].t0,L[3].t0,L[4].t0,L[5].t0,L[6].t0,L[6].t0+.5].map(x=>x-.1);}
  else if(mode==='recap'){nodeAt=N.map(()=>-1); const L=S.lines; brAt=[1,2,3,4,5].map(i=>L[i].t0-.1); errAt=L[6].t0-.1;}
  else {nodeAt=N.map((_,i)=>.2+i*.08); brAt=[.6,.7,.8,.9,1]; errAt=1.1;}
  const camIn= mode==='end'?()=>{}:cam(.2,220);
  return t=>{ if(hd) hd(t); if(tail) tail.style.opacity=ramp(t,.1,.5);
    nodes.forEach((n,i)=>{const lit= mode==='recap'? (()=>{const g=groups.findIndex(([a,b])=>i>=a&&i<=b); return t>=brAt[g]?1:0})() : (t>=nodeAt[i]?1:0);
      const k=spring((t-nodeAt[i])/.6); n.w.style.opacity=clamp((t-nodeAt[i])*4); n.w.style.transform=`translateY(${(1-k)*40}px)`; n.set(lit);});
    links.forEach((l,i)=>l(mode==='recap'?1:ramp(t,nodeAt[i+1]-.1,.4)));
    br.forEach((b,i)=>{b.style.opacity=ramp(t,brAt[i],.3)});
    err.forEach(n=>{n.w.style.opacity=ramp(t,errAt,.4); n.set(t>=errAt+.2?1:0)}); eLink(ramp(t,errAt+.1,.4)); errLbl.style.opacity=ramp(t,errAt+.3,.4);
    camIn(t)};
};
