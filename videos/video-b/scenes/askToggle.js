// 3:20 — the toggle itself, full frame; then what still runs free and what stops to ask
SCENES.askToggle=()=>{
  theme('dark'); coolGlow('50%','45%');
  const top=el('div','abs'); Object.assign(top.style,{left:0,right:0,top:'300px',display:'flex',flexDirection:'column',alignItems:'center',transformOrigin:'50% 0'});
  const lab=el('div','mega',top,'Ask first before<br>external writes'); Object.assign(lab.style,{fontSize:'110px',textAlign:'center'});
  const row=el('div','',top); row.style.marginTop='60px'; const sw=toggle(row,300,160);
  sw.el.style.boxShadow='0 0 0 4px rgba(255,255,255,.08)';
  const cols=[[ 'Still free',IN,[['research','Research as much as it likes'],['read','Read what it\'s been given'],['write','Write inside its own thread']]],
              [ 'Stops and asks you',OUT,[['send','Send'],['post','Post'],['change','Change a connected app']]]];
  const items=[];
  cols.forEach(([h,c,list],ci)=>{
    const col=el('div','abs'); Object.assign(col.style,{left:(ci?1180:400)+'px',top:'470px',width:'720px'});
    const hh=el('div','kicker',col,h); hh.style.color=c; hh.style.fontSize='28px';
    items.push({d:hh,s:wordAt(1,list[0][0])-.3});
    list.forEach(([w,txt])=>{const d=el('div','',col,`<span style="color:${c};margin-right:18px">${ci?'●':'✓'}</span>${txt}`);
      Object.assign(d.style,{fontWeight:900,fontSize:'40px',marginTop:'34px',whiteSpace:'nowrap'}); items.push({d,s:wordAt(1,w)})});
  });
  const asks=el('div','abs mega',null,'It stops and asks you.'); Object.assign(asks.style,{left:'1180px',top:'900px',fontSize:'52px',color:'var(--amber)'});
  const tOn=wordAt(0,'ask')+.15, tUp=S.lines[1].t0+.2, tAsk=wordAt(1,'asks');
  const camIn=cam(.2,240);
  return t=>{
    top.style.opacity=ramp(t,0,.5);
    const k=ramp(t,tOn,.35); sw.set(k,'var(--blue)');
    sw.el.style.boxShadow=`0 0 0 4px rgba(255,255,255,.08),0 0 ${80*k}px rgba(127,196,214,${.5*k})`;
    const u=ramp(t,tUp,.8,inOut); top.style.transform=`translateY(${-220*u}px) scale(${lerp(1,.55,u)})`;
    items.forEach(({d,s})=>{const kk=spring((t-s)/.6); d.style.opacity=clamp((t-s)*5); d.style.transform=`translateY(${(1-kk)*40}px)`});
    asks.style.opacity=ramp(t,tAsk-.1,.4);
    camIn(t);
  };
};
