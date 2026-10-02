// 5:05 — a ceiling per run, and the alert at half
SCENES.spendBar=()=>{
  theme('dark');
  const hd=heading('Alarm 04 · spend per run','Alert at <span style="color:var(--accent)">half</span> the cap.',420,70,80);
  const X=420,W=1400,Y=440;
  const track=el('div','abs'); Object.assign(track.style,{left:X+'px',top:Y+'px',width:W+'px',height:'110px',borderRadius:'18px',background:'#221f1b',boxShadow:'inset 0 0 0 2px #2a2622'});
  const fill=el('div','abs'); Object.assign(fill.style,{left:X+'px',top:Y+'px',height:'110px',borderRadius:'18px 0 0 18px',background:'linear-gradient(90deg,#3d7f92,var(--blue))'});
  const mk=(x,txt,col)=>{const l=el('div','abs');Object.assign(l.style,{left:x+'px',top:(Y-40)+'px',width:'6px',height:'190px',background:col});
    const s=el('div','abs',null,txt);Object.assign(s.style,{left:(x-150)+'px',width:'306px',textAlign:'center',top:(Y+165)+'px',fontWeight:900,fontSize:'34px',color:col});return [l,s]};
  const half=mk(X+W/2,'alert here',FIRE), cap=mk(X+W-6,'the cap','#8d857b');
  const b=el('div','abs'); Object.assign(b.style,{left:(X+W/2-30)+'px',top:(Y-120)+'px'}); const bb=bell(b,60);
  const note=el('div','abs serif',null,'At the cap, the money is <i>already spent.</i>'); Object.assign(note.style,{left:X+'px',top:'800px',fontSize:'50px'});
  const tCeil=wordAt(0,'ceiling'), tHalf=wordAt(0,'half'), tNote=S.lines[1].t0;
  const camIn=cam(.2,240);
  return t=>{hd(t); track.style.opacity=ramp(t,.1,.4); cap.forEach(e=>e.style.opacity=ramp(t,tCeil-.1,.3)); half.forEach(e=>e.style.opacity=ramp(t,tHalf-.1,.3));
    const g=ramp(t,tCeil,(S.duration-tCeil)*.85,x=>clamp(x)); fill.style.width=(W*.72*g)+'px'; bb.set(g*.72>.5?1:0,t); b.style.opacity=ramp(t,tHalf,.3);
    note.style.opacity=ramp(t,tNote-.1,.4); camIn(t)};
};
