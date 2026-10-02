// The finished build as n8n nodes: Lead catcher (nine nodes) and Lead alarm (two).
// params.mode: (default) nodes appear across the narration · 'end' silent end card
SCENES.buildMap=()=>{
  theme('dark');
  const end=P().mode==='end';
  const grid=el('div','fill'); grid.style.backgroundImage='radial-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px)'; grid.style.backgroundSize='34px 34px';
  const hd= end ? null : heading('What we\'re building','Lead catcher <span style="color:var(--accent)">+ Lead alarm.</span>',200,70,80);
  const W=wires(), sz=130, dx=360;
  const A=[['hook','On form submission'],['edit','Tidy lead'],['sheet','Save lead'],['mail','Reply to lead'],['phone','Alert me'],
           ['clock','Wait until next working morning'],['sheet','Look up lead'],['branch','Still new?'],['phone','Remind me']];
  const pos=i=> i<5 ? [200+i*dx, end?260:290] : [200+(i-5+1)*dx, end?540:570];
  const nodes=A.map(([ic,n],i)=>{const [x,y]=pos(i); return node(null,x,y,ic,n,null,{size:sz})});
  const links=[];
  for(let i=0;i<8;i++){const [x1,y1]=pos(i),[x2,y2]=pos(i+1);
    links.push(i===4? W.line(x1+sz/2,y1+sz+70,x2+sz/2,y2-10,'#5b544c') : W.line(x1+sz,y1+sz/2,x2,y2+sz/2));}
  const lbl1=el('div','abs',null,'LEAD CATCHER · 9 NODES'); Object.assign(lbl1.style,{left:'200px',top:(end?200:240)+'px',fontWeight:700,fontSize:'22px',letterSpacing:'.16em',color:'#8d857b'});
  const ay=end?990:1000;
  const B=[node(null,200,ay-90,'alert','Error Trigger',null,{size:96,col:WARN}),node(null,440,ay-90,'phone','Telegram',null,{size:96,col:WARN})];
  const bl=W.line(296,ay-42,440,ay-42);
  const lbl2=el('div','abs',null,'LEAD ALARM · 2 NODES'); Object.assign(lbl2.style,{left:'200px',top:(ay-140)+'px',fontWeight:700,fontSize:'22px',letterSpacing:'.16em',color:WARN});
  let tail=null;
  if(end){tail=el('div','abs mega',null,'Build it tonight. <span style="color:var(--accent)">Then test your own form.</span>');
    Object.assign(tail.style,{left:'200px',top:'100px',fontSize:'64px',whiteSpace:'nowrap'});}
  const t1= end?.2: S.lines[1].t0, tB= end?.9: wordAt(1,'alarm');
  const at=A.map((_,i)=>t1+i*(end?.06:.22));
  return t=>{ if(hd) hd(t); if(tail) tail.style.opacity=ramp(t,.1,.5);
    nodes.forEach((n,i)=>{const k=spring((t-at[i])/.6); n.w.style.opacity=clamp((t-at[i])*4); n.w.style.transform=`translateY(${(1-k)*30}px)`; n.set(t>=at[i]+.2?1:0)});
    links.forEach((l,i)=>l(ramp(t,at[i+1]-.1,.3))); lbl1.style.opacity=ramp(t,t1,.4);
    B.forEach((n,i)=>{n.w.style.opacity=ramp(t,tB+i*.2,.3); n.set(t>=tB+i*.2+.2?1:0)}); bl(ramp(t,tB+.2,.3)); lbl2.style.opacity=ramp(t,tB,.3);
  };
};
