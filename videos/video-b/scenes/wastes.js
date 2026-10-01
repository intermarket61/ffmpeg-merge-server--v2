// 0:15 — "wastes a run", "wastes a paragraph" in grey; the third lands in full contrast
SCENES.wastes=()=>{
  theme('dark');
  const hd=heading('When it gets it wrong','',160,90,0);
  const rows=[['Research agent','wastes a run',0],['Writing agent','wastes a paragraph',1],['Send access','in front of a client',2]].map(([who,cost,i])=>{
    const r=el('div','abs'); Object.assign(r.style,{left:'160px',top:(230+i*175)+'px',display:'flex',alignItems:'baseline',gap:'60px'});
    r.innerHTML=`<div style="width:520px;font-weight:700;font-size:44px;color:var(--mute)">${who}</div><div class="mega" style="font-size:${i<2?96:112}px">${cost}</div>`;
    return {r,s:S.lines[i].t0-.1,last:i===2};
  });
  const tailRow=el('div','abs serif'); Object.assign(tailRow.style,{left:'740px',top:'760px',display:'flex',gap:'26px',fontSize:'56px',fontStyle:'italic'});
  const tail=['in their inbox ·','timestamped ·','no undo'].map(w=>el('div','',tailRow,w));
  const tAt=[wordAt(2,'inbox'),wordAt(2,'timestamped'),wordAt(2,'undo')];
  const camIn=cam(.2,250);
  return t=>{
    hd(t);
    rows.forEach(({r,s,last},i)=>{const k=spring((t-s)/.7); r.style.opacity=clamp((t-s)*5); r.style.transform=`translateY(${(1-k)*50}px)`;
      // the first two settle to grey as soon as the next lands
      const next=i<2?rows[i+1].s:1e9; r.querySelector('.mega').style.color= last?'#fff':`rgba(241,234,223,${lerp(1,.32,ramp(t,next,.5))})`;});
    tail.forEach((d,i)=>{d.style.opacity=ramp(t,tAt[i]-.1,.35); d.style.color=i===2?'var(--amber)':'var(--cream)'});
    camIn(t);
  };
};
