// The four alarms as tiles. params.mode: intro (pop in through the lines), recap (one per line),
// close (one per line, then the closing line), end (silent end card)
SCENES.alarmPanel=()=>{
  theme('dark');
  const mode=P().mode;
  const hd= mode==='end' ? null : heading(mode==='intro'?'Four alarms':'The four',mode==='close'?'Four sentences.':mode==='intro'?'Then stop watching.':'Every run, automatically.',420,70,80);
  const tiles=ALARMS.map(([a,b],i)=>{
    const p=panel(null,{left:(420+(i%2)*720)+'px',top:(mode==='end'?330:300)+Math.floor(i/2)*260+'px',width:'690px',height:'230px',padding:'34px 40px'});
    const row=el('div','',p); Object.assign(row.style,{display:'flex',alignItems:'center',gap:'24px'});
    const b1=bell(row,58); const n=el('div','mega',row,'0'+(i+1)); Object.assign(n.style,{fontSize:'64px',color:'#4a433b'});
    const h=el('div','',p,a); Object.assign(h.style,{fontWeight:900,fontSize:'46px',marginTop:'22px'});
    const s=el('div','serif',p,b); Object.assign(s.style,{fontSize:'30px',fontStyle:'italic',color:'#b9b0a4',marginTop:'4px'});
    return {p,b1,n};
  });
  let at;
  if(mode==='intro'){const s=S.lines[2].t0, e=S.lines[2].t1; at=[0,1,2,3].map(i=>lerp(s,e,i/4));}
  else if(mode==='end'){at=[.3,.5,.7,.9];}
  else {at=[1,2,3,4].map(i=>S.lines[i].t0-.1);}
  let tail=null;
  if(mode==='close'||mode==='end'){
    tail=el('div','abs mega',null,mode==='end'?'Write them down. <span style="color:var(--accent)">Then stop watching.</span>':'Then <span style="color:var(--accent)">stop watching it.</span>');
    Object.assign(tail.style,{left:'420px',top:mode==='end'?'180px':'880px',fontSize:mode==='end'?'66px':'64px',whiteSpace:'nowrap'});
  }
  const tAt= mode==='close'?wordAt(5,'stop'): mode==='end'?.2:1e9;
  const camIn= mode==='end'?()=>{}:cam(.2,240);
  return t=>{
    if(hd) hd(t);
    tiles.forEach(({p,b1,n},i)=>{const k=spring((t-at[i])/.6); p.style.opacity=clamp((t-at[i])*5); p.style.transform=`translateY(${(1-k)*40}px)`;
      const lit= ramp(t,at[i]+.2,.3); b1.set(lit,t); n.style.color=lit>.5?'var(--accent)':'#4a433b';});
    if(tail) {tail.style.opacity=ramp(t,tAt-.1,.5);}
    camIn(t);
  };
};
