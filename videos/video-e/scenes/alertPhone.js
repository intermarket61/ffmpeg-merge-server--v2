// 3:35 — the alert goes to your phone, with name, ask and a link to the row
SCENES.alertPhone=()=>{
  theme('dark');
  const hd=heading('Step 04','Where you’ll <span style="color:var(--accent)">actually see it.</span>',420,70,80);
  const list=el('div','abs'); Object.assign(list.style,{left:'420px',top:'280px',display:'flex',flexDirection:'column',gap:'18px'});
  const opts=['Slack','Telegram','A text message','Another email'].map((s,i)=>{const d=el('div','',list,s); Object.assign(d.style,{fontWeight:900,fontSize:'52px',color:i<3?'var(--cream)':'#6f685f'}); return d});
  const strike=el('div','abs'); Object.assign(strike.style,{left:'410px',top:'0px',height:'6px',background:WARN,borderRadius:'3px'});
  const ph=el('div','abs'); Object.assign(ph.style,{left:'1300px',top:'190px',width:'470px',height:'860px',borderRadius:'64px',background:'#0f0e0c',boxShadow:'0 0 0 10px #26221e,0 50px 90px rgba(0,0,0,.6)'});
  const clock=el('div','',ph,'21:14'); Object.assign(clock.style,{textAlign:'center',marginTop:'90px',fontWeight:900,fontSize:'96px',letterSpacing:'-.03em',color:'#e2dace'});
  const note=el('div','',ph); Object.assign(note.style,{margin:'50px 22px 0',padding:'24px 26px',borderRadius:'26px',background:'#24211d',boxShadow:'0 20px 40px rgba(0,0,0,.4)'});
  note.innerHTML=`<div style="display:flex;gap:12px;align-items:center;font-size:20px;color:#8d857b;font-weight:700;letter-spacing:.1em">${ico('bell',24,'#8fd694')} #NEW-LEADS · N8N</div>
    <div class="f1" style="font-weight:900;font-size:32px;margin-top:14px">New lead: Dana Ruiz</div>
    <div class="f2" style="font-size:26px;margin-top:6px;color:#cfc6b8">Kitchen refit quote · website form</div>
    <div class="f3" style="font-size:26px;margin-top:14px;font-weight:700;color:var(--accent)">Open row →</div>`;
  const f=['.f1','.f2','.f3'].map(s=>note.querySelector(s));
  const call=[['Name',0],['What they asked for',1],['Link to the row',2]].map(([s,i])=>{const d=el('div','abs',null,`${s} <span style="color:var(--accent)">→</span>`);
    Object.assign(d.style,{left:'760px',top:(560+i*80)+'px',width:'500px',textAlign:'right',fontWeight:900,fontSize:'34px'}); return d});
  const tN=S.lines[0].t0+.3, tO=[wordAt(1,'slack'),wordAt(1,'telegram'),wordAt(1,'text'),wordAt(1,'email')], tF=[wordAt(2,'name'),wordAt(2,'asked'),wordAt(2,'link')];
  const camIn=cam(.2,220);
  return t=>{hd(t);
    ph.style.opacity=ramp(t,tN-.2,.4); note.style.opacity=ramp(t,tN+.3,.3); note.style.transform=`translateY(${(1-spring((t-tN-.3)/.6))*-40}px)`;
    opts.forEach((d,i)=>{d.style.opacity=ramp(t,tO[i]-.15,.3)});
    const s=ramp(t,tO[3]+.3,.35); strike.style.top=(280+3*80+40)+'px'; strike.style.width=(s*440)+'px';
    f.forEach((e,i)=>{const on=t>=tF[i]-.1; e.style.textShadow=on?'0 0 24px rgba(143,214,148,.5)':'none'});
    call.forEach((d,i)=>{d.style.opacity=ramp(t,tF[i]-.1,.3)});
    camIn(t)};
};
