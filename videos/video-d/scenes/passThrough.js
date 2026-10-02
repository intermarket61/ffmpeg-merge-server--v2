// 3:10 — count in and out of a filtering step: 5 in, 5 out, three weeks running
SCENES.passThrough=()=>{
  theme('dark');
  const hd=heading('Alarm 02 · pass-through rate','In vs out. <span style="color:var(--accent)">Every run.</span>',420,70,80);
  const weeks=['Week 1','Week 2','Week 3'];
  const rows=weeks.map((w,i)=>{const r=el('div','abs');Object.assign(r.style,{left:'420px',top:(300+i*170)+'px',width:'1420px',height:'140px',display:'flex',alignItems:'center',gap:'34px'});
    r.innerHTML=`<span style="width:200px;font-weight:900;font-size:40px">${w}</span><span style="font-size:32px;color:#b9b0a4">in</span><span class="mega" style="font-size:72px;color:var(--blue)">5</span>
      <span style="flex:1;height:8px;border-radius:4px;background:#3a342e;position:relative"><span class="bar" style="position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--accent)"></span></span>
      <span style="font-size:32px;color:#b9b0a4">out</span><span class="mega" style="font-size:72px;color:var(--accent)">5</span><span class="pct" style="font-weight:900;font-size:36px;width:140px;text-align:right">100%</span>`;
    return r});
  const cap=el('div','abs serif',null,'Not filtering. <i>Formatting.</i>'); Object.assign(cap.style,{left:'420px',top:'840px',fontSize:'56px'});
  const tIn=S.lines[0].t0, tF=wordAt(1,'formatting'), tW=S.lines[2].t0;
  const camIn=cam(.2,240);
  return t=>{hd(t);
    rows.forEach((r,i)=>{const s= i===0?tIn+.3 : tW+(i-1)*1.2+.4; r.style.opacity=ramp(t,s,.4); r.querySelector('.bar').style.width=(100*ramp(t,s+.2,.8,inOut))+'%'});
    cap.style.opacity=ramp(t,tF-.1,.4); camIn(t)};
};
