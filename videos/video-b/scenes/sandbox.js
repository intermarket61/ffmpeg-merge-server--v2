// 6:15 — a separate address for week one; what the week buys you is a list
SCENES.sandbox=()=>{
  theme('dark');
  const box=panel(null,{left:'420px',top:'130px',width:'640px',padding:'34px 40px'});
  box.innerHTML=`<div class="kicker" style="font-size:20px;color:var(--mute)">Week one inbox</div>
    <div style="font-weight:900;font-size:38px;margin-top:10px;white-space:nowrap">agent-test@yourdomain</div>
    <div class="con" style="margin-top:14px"></div>
    ${['Draft: Re: your order','Draft: Thanks for the intro','Sent: to you (test)','Draft: Re: Friday'].map(s=>`<div class="m" style="height:84px;display:flex;align-items:center;border-top:1px solid #2a2622;font-size:30px;font-weight:700;color:#b9b0a4">${s}</div>`).join('')}`;
  const con=box.querySelector('.con'); const cc=chip(con,'connected','var(--blue)',{background:'rgba(127,196,214,.12)'});
  const ms=[...box.querySelectorAll('.m')];
  const worst=el('div','abs',null,'<div class="kicker" style="color:var(--mute)">Worst case</div><div class="mega" style="font-size:60px;margin-top:10px">An email<br>to yourself.</div>'); Object.assign(worst.style,{left:'420px',top:'720px'});
  const rt=el('div','abs',null,'<div class="kicker">What the week buys you</div><div class="serif" style="font-size:40px;font-style:italic;color:#8d857b;margin-top:12px">not safety —</div>'); Object.assign(rt.style,{left:'1160px',top:'130px'});
  const items=['replied to a newsletter','drafted in the wrong thread','signed off as “Assistant”','marked every receipt urgent','quoted the whole thread back'].map((x,i)=>{
    const d=el('div','abs',null,`<span style="color:var(--blue);margin-right:16px">☐</span>${x}`);Object.assign(d.style,{left:'1160px',top:(330+i*96)+'px',fontWeight:900,fontSize:'38px'});return d});
  const tSep=wordAt(0,'separate'), tCon=wordAt(0,'connect'), tWeek=wordAt(0,'week'), tSelf=wordAt(0,'yourself'), tBuy=wordAt(1,'buys'), tSafe=wordAt(1,'safety'), tList=wordAt(1,'list');
  const camIn=cam(.2,240);
  return t=>{
    box.style.opacity=ramp(t,tSep-.3,.4); cc.style.opacity=ramp(t,tCon,.3);
    ms.forEach((m,i)=>m.style.opacity=ramp(t,tWeek+i*.25,.3));
    worst.style.opacity=ramp(t,tSelf-.15,.4);
    rt.style.opacity=ramp(t,tBuy-.1,.4); rt.lastChild.style.opacity=ramp(t,tSafe-.1,.3);
    items.forEach((d,i)=>{const s=tList-.4+i*.3,k=spring((t-s)/.6); d.style.opacity=clamp((t-s)*5); d.style.transform=`translateX(${(1-k)*40}px)`});
    camIn(t);
  };
};
