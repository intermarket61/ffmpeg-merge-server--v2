// 0:12 — one enquiry, Tuesday night: a competitor answers in five minutes, you on Thursday
SCENES.leakTimeline=()=>{
  theme('dark');
  const hd=heading('One enquiry','Who answered <span style="color:var(--accent)">first?</span>',420,70,80);
  const W=wires();
  const y=540, x0=470, x1=1800;
  const axis=W.line(x0,y,x1,y,'#3a342e',6);
  const ev=[[x0,'Tue 9:14 pm','Form submitted','var(--cream)'],[700,'Tue 9:19 pm','Someone else replies',LEAD],[1640,'Thu 10:02 am','You reply',WARN]];
  const dots=ev.map(([x,when,what,col],i)=>{
    const d=el('div','abs'); Object.assign(d.style,{left:(x-18)+'px',top:(y-18)+'px',width:'36px',height:'36px',borderRadius:'50%',background:col,boxShadow:`0 0 30px ${i==1?'rgba(143,214,148,.6)':'rgba(0,0,0,.4)'}`});
    const l=el('div','abs',null,`<div style="font-weight:700;font-size:26px;letter-spacing:.12em;color:#8d857b">${when.toUpperCase()}</div><div style="font-weight:900;font-size:44px;margin-top:8px;color:${col}">${what}</div>`);
    Object.assign(l.style,{left:(i==2?x-360:x-18)+'px',top:(i==1?y+50:y-170)+'px',width:'420px',textAlign:i==2?'right':'left'});
    return {d,l};
  });
  const gap=el('div','abs serif',null,'<i>five minutes</i>'); Object.assign(gap.style,{left:'520px',top:(y-62)+'px',fontSize:'30px',color:LEAD});
  const late=el('div','abs serif',null,'<i>thirty-seven hours later</i>'); Object.assign(late.style,{left:'1000px',top:(y+40)+'px',fontSize:'34px',color:'#8d857b'});
  const lost=el('div','abs mega',null,'Lost to a <span style="color:var(--accent)">slower reply.</span>'); Object.assign(lost.style,{left:'420px',top:'860px',fontSize:'96px',whiteSpace:'nowrap'});
  const not=el('div','abs serif',null,'<i>Not to a better offer.</i>'); Object.assign(not.style,{left:'424px',top:'780px',fontSize:'44px',color:'#b9b0a4'});
  const at=[.1,wordAt(0,'five'),S.lines[1].t0-.1];
  const camIn=cam(.2,220);
  return t=>{hd(t); axis(ramp(t,0,.8)+0*t);
    dots.forEach(({d,l},i)=>{const k=spring((t-at[i])/.6); d.style.transform=`scale(${k})`; l.style.opacity=ramp(t,at[i],.35);});
    gap.style.opacity=ramp(t,at[1]+.2,.4); late.style.opacity=ramp(t,at[2]+.3,.4);
    not.style.opacity=ramp(t,S.lines[1].t0+.2,.4); lost.style.opacity=ramp(t,S.lines[2].t0-.1,.4);
    lost.style.transform=`translateY(${(1-ramp(t,S.lines[2].t0-.1,.6))*40}px)`; camIn(t)};
};
