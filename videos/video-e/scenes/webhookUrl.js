// 1:51 — the webhook's address goes into the form tool's "send to URL" setting
SCENES.webhookUrl=()=>{
  theme('dark');
  const hd=heading('Step 01','Point the form <span style="color:var(--accent)">at n8n.</span>',420,70,80);
  const URL='https://your-n8n.example.com/webhook/new-lead';
  const L=panel(null,{left:'420px',top:'250px',width:'680px',padding:'34px 38px'});
  L.innerHTML=`<div style="display:flex;align-items:center;gap:18px;color:var(--accent)">${ico('hook',44)}<span style="font-weight:900;font-size:40px;color:var(--cream)">Webhook</span></div>
    <div style="margin-top:26px;font-weight:700;font-size:20px;letter-spacing:.2em;color:#8d857b">PRODUCTION URL</div>
    <div class="u" style="margin-top:10px;font-family:monospace;font-size:21px;white-space:nowrap;padding:16px 18px;border-radius:12px;background:#0f0e0c;color:var(--blue)">${URL}</div>`;
  const R=panel(null,{left:'1160px',top:'250px',width:'680px',padding:'34px 38px'});
  R.innerHTML=`<div style="font-weight:900;font-size:40px">Your form · Settings</div>
    <div style="margin-top:26px;font-weight:700;font-size:20px;letter-spacing:.2em;color:#8d857b">SEND EACH SUBMISSION TO URL</div>
    <div style="margin-top:10px;font-family:monospace;font-size:21px;white-space:nowrap;padding:16px 18px;border-radius:12px;background:#0f0e0c;min-height:62px;color:var(--cream)"><span class="typed"></span><span class="caret" style="color:var(--accent)">|</span></div>`;
  const typed=R.querySelector('.typed'), caret=R.querySelector('.caret');
  const out=panel(null,{left:'420px',top:'560px',width:'1420px',padding:'26px 38px'});
  const oh=el('div','',out,`<span style="font-weight:700;font-size:20px;letter-spacing:.2em;color:var(--accent)">✓ LEAD RECEIVED IN N8N</span>`);
  const f1=field(out,'name','"Dana Ruiz"'), f2=field(out,'email','"dana.ruiz@gmail.com"'), f3=field(out,'message','"Quote for a kitchen refit"');
  const tL=wordAt(0,'address'), tR=wordAt(1,'setting'), tP=wordAt(2,'paste'), tA=wordAt(2,'arrive');
  const camIn=cam(.2,220);
  return t=>{hd(t);
    L.style.opacity=ramp(t,tL-.6,.4); R.style.opacity=ramp(t,tR-.3,.4);
    const n=Math.round(clamp((t-tP)/1.2)*URL.length); typed.textContent=URL.slice(0,n); caret.style.opacity=(t>tR&&Math.floor(t*2)%2===0)?1:0;
    out.style.opacity=ramp(t,tA-.3,.4); out.style.transform=`translateY(${(1-spring((t-tA+.3)/.6))*40}px)`;
    camIn(t)};
};
