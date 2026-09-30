// ================================================================== approval queue, six days old
SCENES.approvalQueue=()=>{
  theme('dark');
  const world=el('div','fill'); world.style.transformOrigin='1520px 470px';
  const side=panel(world,{left:'80px',top:'80px',width:'300px',height:'920px',borderRadius:'24px'});
  side.innerHTML=['Home','Agents','Schedules','Needs attention','Library'].map((x,i)=>`<div style="padding:22px 30px;font-weight:700;font-size:26px;color:${i===3?'var(--cream)':'var(--mute)'};${i===3?'background:#26221e;border-radius:14px;margin:0 12px':''}">${x}${i===3?' <span style="background:var(--orange);color:#fff;border-radius:12px;padding:2px 10px;font-size:20px">1</span>':''}</div>`).join('');
  const main=panel(world,{left:'420px',top:'80px',width:'1420px',height:'920px',borderRadius:'24px',padding:'50px 60px'});
  main.innerHTML=`<div class="mega" style="font-size:72px">Needs attention</div><div style="color:var(--mute);font-size:26px;margin-top:10px">Runs paused until you decide</div>
   <div style="margin-top:50px;border-radius:20px;background:#221f1b;padding:34px 38px;display:flex;align-items:center;gap:26px">
     <span style="width:22px;height:22px;border-radius:50%;background:#ffb13d;box-shadow:0 0 20px #ffb13d;flex:none"></span>
     <div style="flex:1"><div style="font-weight:900;font-size:34px">Atlas wants to publish “AI launches, week 2”</div>
       <div class="chips" style="margin-top:14px;display:flex;gap:12px;font-size:22px;font-weight:700"></div></div>
     <div class="ts" style="font-weight:900;font-size:34px;color:#ffb13d;white-space:nowrap">just now</div></div>
   <div style="display:flex;gap:16px;margin-top:26px;margin-left:86px"><span style="padding:14px 30px;border-radius:14px;background:var(--cream);color:var(--ink);font-weight:900;font-size:26px">Approve</span><span style="padding:14px 30px;border-radius:14px;background:#2a2622;font-weight:900;font-size:26px">Deny</span></div>`;
  const chips=main.querySelector('.chips'), ts=main.querySelector('.ts');
  const chipEls=['Research ✓','Judgment ✓','Design ✓'].map(x=>{const c=el('span','',chips,x);Object.assign(c.style,{padding:'6px 14px',borderRadius:'10px',background:'rgba(143,214,148,.14)',color:'var(--green)',opacity:0});return c});
  const camIn=cam(.2,250); const tl=tally();
  const doneAt=S.lines[1].t0, sixAt=wordAt(2,'six');
  return t=>{
    world.style.opacity=ramp(t,0,.4);
    const days=Math.min(6,Math.floor(6*clamp(t/(sixAt+.1))));
    ts.textContent= days===0?'just now':days===1?'1 day ago':days+' days ago';
    chipEls.forEach((c,i)=>{c.style.opacity=ramp(t,doneAt+i*.18,.3)});
    const z=ramp(t,sixAt-.3,1.2,inOut);
    world.style.transform=`scale(${1+1.25*z})`;
    ts.style.textShadow=`0 0 ${30*z}px rgba(255,177,61,.8)`;
    camIn(t); tl(t);
  };
};
