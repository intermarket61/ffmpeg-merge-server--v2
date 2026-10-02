// 4:04 — Wait 24 hours, then look the lead up again and read the status
SCENES.waitNode=()=>{
  theme('dark');
  const hd=heading('Step 05','Wait a day. <span style="color:var(--accent)">Look again.</span>',420,70,80);
  const W=wires();
  const wp=panel(null,{left:'420px',top:'280px',width:'560px',padding:'34px 40px'});
  wp.innerHTML=`<div style="display:flex;gap:16px;align-items:center;color:var(--accent)">${ico('clock',44)}<span style="font-weight:900;font-size:40px;color:var(--cream)">Wait</span></div>
    <div style="margin-top:20px;font-size:26px;color:#8d857b">Resume</div><div style="font-size:30px;font-weight:700">After time interval</div>
    <div style="margin-top:14px;font-size:26px;color:#8d857b">Amount</div><div class="mega" style="font-size:96px;color:var(--accent);margin-top:6px">24 hours</div>`;
  const dial=el('div','abs'); Object.assign(dial.style,{left:'1040px',top:'330px',width:'220px',height:'220px',borderRadius:'50%',boxShadow:'0 0 0 6px #2f2a25'});
  const hand=el('div','',dial); Object.assign(hand.style,{position:'absolute',left:'107px',top:'20px',width:'6px',height:'90px',borderRadius:'3px',background:'var(--accent)',transformOrigin:'3px 90px'});
  const sp=panel(null,{left:'1320px',top:'280px',width:'520px',padding:'34px 40px'});
  sp.innerHTML=`<div style="display:flex;gap:16px;align-items:center;color:var(--accent)">${ico('sheet',44)}<span style="font-weight:900;font-size:40px;color:var(--cream)">Google Sheets</span></div>
    <div style="margin-top:20px;font-size:26px;color:#8d857b">Get row · email =</div><div style="font-family:monospace;font-size:26px;color:var(--blue);margin-top:6px">dana.ruiz@gmail.com</div>
    <div class="st" style="margin-top:26px;font-family:monospace;font-size:44px"><span style="color:var(--blue)">status</span> <span style="color:var(--amber)">"new"</span></div>`;
  const st=sp.querySelector('.st');
  const link=W.line(980,420,1040,440), link2=W.line(1260,440,1320,420);
  const tW=wordAt(0,'twenty'), tL=wordAt(1,'look'), tS=wordAt(1,'status');
  const camIn=cam(.2,220);
  return t=>{hd(t); wp.style.opacity=ramp(t,.1,.4); dial.style.opacity=ramp(t,tW-.3,.4); link(ramp(t,tW-.3,.4));
    hand.style.transform=`rotate(${ramp(t,tW,Math.max(.5,tL-tW-.2),inOut)*720}deg)`;
    sp.style.opacity=ramp(t,tL-.2,.4); link2(ramp(t,tL-.2,.4)); st.style.opacity=ramp(t,tS-.1,.3);
    camIn(t)};
};
