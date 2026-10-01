// 5:20 — six real actions, sorted live by three questions. params.ranked: the finished table, sorted
SCENES.threeQs=()=>{
  theme('dark');
  const ranked=!!P().ranked;
  const Q=['Reversible?','Visible to you?','Reaches nobody<br>who matters?'];
  const acts=[['Draft a reply',[1,1,1]],['Add a label',[1,1,1]],['Send an email',[0,0,0]],['Delete a thread',[0,0,1]],['Post to own channel',[1,1,1]],['Reply to a client',[0,0,0]]];
  const box=panel(null,{left:'400px',top:'150px',width:'1440px',height:'880px'});
  const qh=Q.map((q,i)=>{const d=el('div','abs',box,q);Object.assign(d.style,{left:(640+i*260)+'px',top:'30px',width:'240px',textAlign:'center',fontWeight:900,fontSize:'28px',lineHeight:'1.15',color:'var(--mute)'});return d});
  const RH=120, Y0=140;
  const rows=acts.map(([n,v],i)=>{const r=el('div','abs',box);Object.assign(r.style,{left:'30px',right:'30px',height:(RH-12)+'px',top:(Y0+i*RH)+'px',borderRadius:'18px',display:'flex',alignItems:'center',padding:'0 30px'});
    const nm=el('div','',r,n);Object.assign(nm.style,{width:'580px',fontWeight:900,fontSize:'40px'});
    const cells=v.map((ok,j)=>{const c=el('div','abs',r,ok?'✓':'✕');Object.assign(c.style,{left:(610+j*260)+'px',width:'240px',textAlign:'center',fontWeight:900,fontSize:'56px',color:ok?IN:OUT});return c});
    return {r,cells,v,safe:v.every(x=>x),i}});
  // when each cell fills
  const L=S.lines, fill=[];
  if(!ranked){
    const c0=[wordAt(1,'draft'),wordAt(1,'label'),wordAt(1,'send'),wordAt(1,'delete'),L[1].t1+.15,L[1].t1+.3];
    const span=(a,b,i)=>lerp(a,b,i/5);
    const c1=[0,1,2,3,4,5].map(i=>span(L[3].t0,L[3].t1-.5,i));
    const c2=[0,1,2,3].map(i=>span(L[5].t0,wordAt(5,'test')-.2,i)).concat([wordAt(5,'test'),wordAt(5,'client')]);
    rows.forEach((_,i)=>fill.push([c0[i],c1[i],c2[i]]));
  }
  const hAt=ranked?[0,0,0]:[L[0].t0,L[2].t0,L[4].t0];
  const order=[0,1,4,2,3,5];                       // safe on all three first
  const tSort=ranked?wordAt(0,'rank'):1e9, tSafe=ranked?wordAt(0,'safe'):1e9, tClick=ranked?wordAt(0,'click'):1e9;
  const safeL=el('div','abs kicker',null,'Safe on all three'), clickL=el('div','abs kicker',null,'Worth a click');
  [safeL,clickL].forEach((d,i)=>Object.assign(d.style,{left:'352px',width:i?'350px':'360px',textAlign:'center',color:i?OUT:IN,fontSize:'22px',whiteSpace:'nowrap',transformOrigin:'0 0',transform:'rotate(-90deg)'}));
  const camIn=cam(.2,240);
  return t=>{
    box.style.opacity=ranked?1:ramp(t,0,.4);
    qh.forEach((q,j)=>{const on=t>=hAt[j]; q.style.color=on?'var(--cream)':'var(--mute)';
      const cur=!ranked&&on&&(j===2||t<hAt[j+1]); q.style.textShadow=cur?'0 0 24px rgba(127,196,214,.8)':'none'});
    const s=ramp(t,tSort,1.0,inOut);
    rows.forEach(({r,cells,safe},i)=>{
      cells.forEach((c,j)=>{const at=ranked?-1:fill[i][j]; const k=spring((t-at)/.45); c.style.opacity=clamp((t-at)*6); c.style.transform=`scale(${lerp(.4,1,clamp(k))})`;});
      const y=lerp(Y0+i*RH, Y0+order.indexOf(i)*RH+(order.indexOf(i)>2?24:0), s); r.style.top=y+'px';
      r.style.background= s>0 ? (safe?`rgba(127,196,214,${.10*ramp(t,tSafe,.4)})`:`rgba(255,177,61,${.08*ramp(t,tClick,.4)})`) : 'transparent';
    });
    safeL.style.top=(150+Y0+3*RH)+'px'; safeL.style.opacity=ramp(t,tSafe,.4);
    clickL.style.top=(150+Y0+6*RH+24)+'px'; clickL.style.opacity=ramp(t,tClick,.4);
    camIn(t);
  };
};
