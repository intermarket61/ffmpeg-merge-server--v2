// 2:55 — drop the junk: a hidden honeypot field and an empty-email check, before anything is written
SCENES.junkFilter=()=>{
  theme('dark');
  const hd=heading('Step 02 · If','Drop the junk <span style="color:var(--accent)">first.</span>',420,70,80);
  const W=wires();
  const form=panel(null,{left:'420px',top:'250px',width:'520px',padding:'30px 34px'});
  form.innerHTML=`<div style="font-weight:900;font-size:34px">Contact form</div>
    ${['Name','Email','Message'].map(f=>`<div style="margin-top:14px;font-size:22px;color:#8d857b">${f}</div><div style="height:46px;border-radius:10px;background:#0f0e0c;margin-top:6px"></div>`).join('')}
    <div class="hp" style="margin-top:14px;padding:12px 14px;border-radius:10px;border:2px dashed var(--amber)"><div style="font-size:22px;color:var(--amber)">website <span class="serif" style="font-style:italic">(hidden: people never see it)</span></div></div>`;
  const hp=form.querySelector('.hp');
  const ifp=panel(null,{left:'1020px',top:'330px',width:'380px',padding:'28px 32px'});
  ifp.innerHTML=`<div style="display:flex;gap:14px;align-items:center;color:var(--accent)">${ico('branch',40)}<span style="font-weight:900;font-size:36px;color:var(--cream)">If</span></div>
    <div style="margin-top:14px;font-family:monospace;font-size:24px;line-height:1.6"><span style="color:var(--blue)">website</span> <span style="color:#8d857b">is not empty</span><br><span class="c2"><span style="color:#8d857b">or</span> <span style="color:var(--blue)">email</span> <span style="color:#8d857b">is empty</span></span></div>`;
  const c2=ifp.querySelector('.c2');
  const stop=panel(null,{left:'1480px',top:'250px',width:'360px',padding:'24px 28px',boxShadow:`0 0 0 2px ${WARN},0 30px 60px rgba(0,0,0,.5)`});
  stop.innerHTML=`<div style="font-weight:900;font-size:34px;color:var(--amber)">Stop.</div><div class="serif" style="font-style:italic;font-size:26px;color:#cfc6b8;margin-top:6px">No reply. No alert.</div><div style="font-family:monospace;font-size:20px;color:#8d857b;margin-top:12px;white-space:nowrap">website: "cheap-seo.biz"</div>`;
  const go=panel(null,{left:'1480px',top:'560px',width:'360px',padding:'24px 28px',boxShadow:'0 0 0 2px var(--accent),0 30px 60px rgba(0,0,0,.5)'});
  go.innerHTML=`<div style="font-weight:900;font-size:34px;color:var(--accent)">Carry on.</div><div class="serif" style="font-style:italic;font-size:26px;color:#cfc6b8;margin-top:6px">A real lead: Dana Ruiz</div>`;
  const l1=W.line(940,440,1020,440), l2=W.line(1400,420,1480,320,'#5b544c'), l3=W.line(1400,480,1480,620,'#5b544c');
  const warn=el('div','abs serif',null,'<i>Every bot answered and alerted → you mute the alerts.</i>'); Object.assign(warn.style,{left:'1020px',top:'820px',fontSize:'34px',color:'#b9b0a4',width:'820px'});
  const tB=wordAt(1,'bots'), tH=wordAt(2,'hidden'), tI=wordAt(3,'if'), tS=wordAt(3,'stops'), tE=wordAt(4,'empty');
  const camIn=cam(.2,220);
  return t=>{hd(t); form.style.opacity=ramp(t,.1,.4);
    warn.style.opacity=ramp(t,tB,.4)*(1-ramp(t,tI-.3,.3));
    hp.style.opacity=ramp(t,tH-.1,.3); hp.style.boxShadow=t>tH&&t<tH+1.5?'0 0 30px rgba(255,177,61,.4)':'none';
    l1(ramp(t,tI-.2,.3)); ifp.style.opacity=ramp(t,tI-.2,.3); c2.style.opacity=ramp(t,tE-.2,.3);
    l2(ramp(t,tS-.2,.3)); stop.style.opacity=ramp(t,tS-.1,.3);
    l3(ramp(t,tS+.4,.3)); go.style.opacity=ramp(t,tS+.5,.3);
    camIn(t)};
};
