// 7:40 — every alarm passes, and the page is still about the wrong things
SCENES.shapeNotQuality=()=>{
  theme('dark');
  const hd=heading('What alarms can’t catch','Right shape. <span style="color:var(--accent)">Wrong things.</span>',420,70,80);
  const page=panel(null,{left:'420px',top:'280px',width:'760px',padding:'30px 36px'});
  page.innerHTML='<div class="kicker" style="font-size:20px;color:var(--mute)">This week’s page</div>'+[1,2,3,4,5].map(i=>`<div style="display:flex;gap:18px;align-items:center;height:76px;border-top:${i>1?'1px solid #2a2622':'0'}"><span style="font-weight:900;font-size:30px;color:var(--mute)">0${i}</span><span style="flex:1;height:14px;border-radius:7px;background:#3a342e"></span></div>`).join('');
  const checks=['5 items','all sourced','all dated','under budget'].map((c,i)=>{const d=el('div','abs',null,`<span style="color:var(--green)">✓</span> ${c}`);Object.assign(d.style,{left:'1260px',top:(300+i*90)+'px',fontWeight:900,fontSize:'44px'});return d});
  const wrong=el('div','abs serif',null,'…and still about <i>the wrong things.</i>'); Object.assign(wrong.style,{left:'1260px',top:'700px',fontSize:'48px',color:'var(--accent)',width:'600px'});
  const at=[wordAt(2,'five'),wordAt(2,'sourced'),wordAt(2,'dated'),wordAt(2,'budget')], tW=wordAt(2,'wrong');
  const a=pop(page,S.lines[1].t0,40);
  const camIn=cam(.2,240);
  return t=>{hd(t); a(t); checks.forEach((c,i)=>c.style.opacity=ramp(t,at[i]-.1,.3)); wrong.style.opacity=ramp(t,tW-.2,.4); camIn(t)};
};
