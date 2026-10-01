// 6:25 — twenty minutes of composing against two seconds of sending, drawn to scale
SCENES.timeSplit=()=>{
  theme('dark');
  const X=300, W=1380, Y=470;                       // 1200 s of composing = W px
  const hd=heading('An agent that drafts and never sends','Most of the value. <span style="color:var(--blue)">None of the exposure.</span>',X,90,72);
  const comp=el('div','abs'); Object.assign(comp.style,{left:X+'px',top:Y+'px',height:'150px',borderRadius:'14px 0 0 14px',background:'linear-gradient(90deg,#3d7f92,var(--blue))',transformOrigin:'0 50%'});
  const sendW=Math.max(3,W*2/1200);
  const send=el('div','abs'); Object.assign(send.style,{left:(X+W+6)+'px',top:Y+'px',width:sendW+'px',height:'150px',background:'var(--amber)',boxShadow:'0 0 18px var(--amber)'});
  const cl=el('div','abs',null,'<div class="mega" style="font-size:80px;color:var(--ink)">20 min</div><div style="font-weight:700;font-size:28px;color:#10303a">composing · the agent does this</div>'); Object.assign(cl.style,{left:(X+40)+'px',top:(Y+22)+'px'});
  const sl=el('div','abs',null,'<div class="mega" style="font-size:80px;color:var(--amber)">2 s</div><div style="font-weight:700;font-size:28px;color:var(--cream)">pressing send</div>'); Object.assign(sl.style,{left:(X+W-260)+'px',top:(Y+200)+'px',textAlign:'right',width:'300px'});
  const tick=el('div','abs'); Object.assign(tick.style,{left:(X+W+6)+'px',top:(Y+150)+'px',width:'2px',height:'54px',background:'var(--amber)'});
  const keep=el('div','abs mega',null,'Keep the two seconds.'); Object.assign(keep.style,{left:X+'px',top:'800px',fontSize:'88px'});
  const track=el('div','abs'); Object.assign(track.style,{left:X+'px',top:Y+'px',width:W+'px',height:'150px',borderRadius:'14px',boxShadow:'inset 0 0 0 2px #2a2622'});
  const tVal=wordAt(0,'value'), tExp=wordAt(0,'exposure'), tTw=wordAt(0,'twenty'), tTwo=wordAt(0,'two'), tKeep=S.lines[1].t0;
  const camIn=cam(.2,220);
  return t=>{
    hd(t);
    track.style.opacity=ramp(t,.2,.5);
    const g=ramp(t,tVal-.2,1.6,inOut); comp.style.width=(W*g)+'px'; cl.style.opacity=ramp(t,tTw-.1,.4);
    const s=ramp(t,tExp,.3); send.style.opacity=s; tick.style.opacity=s; sl.style.opacity=ramp(t,tTwo-.1,.3);
    send.style.boxShadow=t>=tKeep?`0 0 ${20+20*Math.sin(t*5)}px var(--amber)`:'0 0 18px var(--amber)';
    keep.style.opacity=ramp(t,tKeep-.1,.4); keep.style.transform=`translateY(${(1-spring((t-tKeep+.1)/.6))*40}px)`;
    camIn(t);
  };
};
