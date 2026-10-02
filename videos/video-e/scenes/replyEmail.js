// 3:02 — the instant reply: real address, short, honest, one useful question
SCENES.replyEmail=()=>{
  theme('dark');
  const hd=heading('Step 03 · Gmail','Short. <span style="color:var(--accent)">Honest.</span> In a minute.',420,70,80);
  const card=panel(null,{left:'420px',top:'250px',width:'930px',padding:'34px 42px'});
  const hdr=el('div','',card); hdr.innerHTML=`<div style="font-size:24px;color:#8d857b">From <b style="color:var(--cream)">Sam · sam@yourbusiness.com</b></div>
    <div style="font-size:24px;color:#8d857b;margin-top:6px">To <span style="color:#cfc6b8">dana.ruiz@gmail.com</span></div>
    <div style="font-weight:900;font-size:36px;margin-top:18px">Got your message, Dana</div>`;
  const body=el('div','serif',card); Object.assign(body.style,{fontSize:'31px',lineHeight:'1.4',color:'#e2dace',marginTop:'22px',borderTop:'1px solid #2a2622',paddingTop:'20px'});
  const P1=el('p','',body,'Thanks for getting in touch about your kitchen refit.');
  const P2=el('p','',body,'Here’s what happens next: I’ll look at what you sent and reply properly <b style="color:var(--accent)">by noon tomorrow</b>.'); P2.style.marginTop='14px';
  const P3=el('p','',body,'One quick question so that reply is useful: <b style="color:var(--accent)">when are you hoping to start?</b>'); P3.style.marginTop='14px';
  const sent=chip(null,'Sent 21:14 · 40 seconds after the form',LEAD,{position:'absolute',left:'420px',top:'960px',fontSize:'24px'});
  const notes=[['Your real address',0],['Short and honest',1],['What happens next, and when',2],['One useful question',3]].map(([s,i])=>{
    const d=el('div','abs',null,`<span style="color:var(--accent);margin-right:14px">✓</span>${s}`); Object.assign(d.style,{left:'1400px',top:(300+i*110)+'px',fontWeight:900,fontSize:'34px',width:'480px'}); return d});
  const at=[0,1,2,3].map(i=>S.lines[i].t0+.1);
  const camIn=cam(.2,220);
  return t=>{hd(t); card.style.opacity=ramp(t,.1,.4); sent.style.opacity=ramp(t,.6,.4);
    P1.style.opacity=ramp(t,at[1],.4); P2.style.opacity=ramp(t,at[2],.4); P3.style.opacity=ramp(t,at[3],.4);
    notes.forEach((d,i)=>{d.style.opacity=ramp(t,at[i],.3); d.style.transform=`translateX(${(1-ramp(t,at[i],.4))*30}px)`});
    camIn(t)};
};
