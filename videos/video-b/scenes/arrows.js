// 1:35 — inbound arrows land harmlessly; outbound ones leave frame and don't come back
SCENES.arrows=()=>{
  theme('dark');
  const AX=960, AY=500;
  const agent=panel(null,{left:(AX-150)+'px',top:(AY-90)+'px',width:'300px',height:'180px',display:'grid',placeItems:'center'});
  agent.innerHTML='<div style="text-align:center"><div style="font-weight:900;font-size:52px">Agent</div><div class="kicker" style="font-size:18px;color:var(--mute)">one run</div></div>';
  const lab=(x,html,col)=>{const d=el('div','abs',null,html);Object.assign(d.style,{left:x+'px',top:'90px'});d.firstChild.style.color=col;return d};
  const inL=lab(330,'<div class="kicker">In</div><div class="mega" style="font-size:72px;margin-top:10px">Recoverable.</div>',IN);
  const outL=lab(1190,'<div class="kicker">Out</div><div class="mega" style="font-size:72px;margin-top:10px">A person.</div>',OUT);
  const inItems=['thread','channel','document'].map((w,i)=>{const c=chip(null,'reads a '+w,IN,{position:'absolute',left:'330px',top:(330+i*120)+'px',fontSize:'32px',padding:'14px 24px',background:'rgba(127,196,214,.1)'});return {c,s:wordAt(1,w),y:330+i*120+30}});
  const cost=el('div','abs serif',null,'Worst case: <i>a wasted run and some tokens.</i>'); Object.assign(cost.style,{left:'330px',top:'720px',fontSize:'40px',color:'#b9b0a4'});
  const verbs=['sending','posting','replying','inviting','deleting','changing','updating'];
  const vLabel={changing:'changing a calendar',updating:'updating a record'};
  const outItems=verbs.map((w,i)=>{const c=chip(null,vLabel[w]||w,OUT,{position:'absolute',left:'1240px',top:(250+i*92)+'px',fontSize:'30px',padding:'12px 22px',background:'rgba(255,177,61,.1)'});
    const dot=el('div','abs'); Object.assign(dot.style,{width:'60px',height:'6px',borderRadius:'3px',background:OUT,boxShadow:'0 0 14px var(--amber)',top:(250+i*92+26)+'px'});
    return {c,dot,s:wordAt(2,w)}});
  const flow=[0,1,2].map(()=>[0,1,2].map(()=>{const d=el('div','abs');Object.assign(d.style,{width:'14px',height:'14px',borderRadius:'50%',background:IN,boxShadow:'0 0 12px var(--blue)'});return d}));
  const camIn=cam(.2,240);
  const tIn=S.lines[0].t0, tOut=S.lines[2].t0;
  return t=>{
    agent.style.opacity=ramp(t,0,.4);
    inL.style.opacity=ramp(t,tIn,.4); outL.style.opacity=ramp(t,tOut-.1,.4);
    inItems.forEach(({c,s,y},i)=>{const k=ramp(t,s-.1,.3); c.style.opacity=k;
      flow[i].forEach((d,j)=>{const ph=((t-s)*.7+j/3)%1; const x=lerp(650,AX-150,ph), yy=lerp(y,AY,ph);
        d.style.left=x+'px'; d.style.top=(yy-7)+'px'; d.style.opacity=t>s?k*(1-ph*.6):0;});});
    cost.style.opacity=ramp(t,wordAt(1,'wasted')-.1,.4);
    outItems.forEach(({c,dot,s})=>{const k=spring((t-s)/.5); c.style.opacity=clamp((t-s)*5); c.style.transform=`translateX(${(1-k)*-60}px)`;
      const f=ramp(t,s+.15,1.1,x=>clamp(x)*clamp(x)); dot.style.left=lerp(1240+c.offsetWidth+20,2000,f)+'px'; dot.style.opacity=t>s+.15&&f<1?1:0;});
    camIn(t);
  };
};
