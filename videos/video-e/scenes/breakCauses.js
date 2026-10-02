// 5:07 — the boring causes, and the seven-day Google sign-in
SCENES.breakCauses=()=>{
  theme('dark');
  const hd=heading('Why it breaks','The causes are <span style="color:var(--accent)">boring.</span>',420,70,80);
  const C=[['Google connection expired','sheet'],['Form field renamed','edit'],['Sheet column deleted','sheet']];
  const cards=C.map(([s,ic],i)=>{const p=panel(null,{left:(420+i*480)+'px',top:'270px',width:'440px',height:'250px',padding:'30px 32px'});
    p.innerHTML=`<div style="color:var(--amber)">${ico(ic,48)}</div><div style="font-weight:900;font-size:36px;margin-top:18px;line-height:1.1">${s}</div>`; return p});
  const big=panel(null,{left:'420px',top:'580px',width:'1420px',padding:'32px 40px',boxShadow:`0 0 0 2px ${WARN},0 30px 60px rgba(0,0,0,.5)`});
  big.innerHTML=`<div style="font-weight:700;font-size:22px;letter-spacing:.16em;color:var(--amber)">THE ONE THAT CATCHES PEOPLE</div>
    <div style="font-weight:900;font-size:40px;margin-top:14px;white-space:nowrap">Google app in <span style="color:var(--amber)">testing mode</span> → sign-in expires in <span style="color:var(--amber)">7 days</span></div>
    <div class="fx" style="font-size:34px;margin-top:16px;color:#cfc6b8">Fix: <b style="color:var(--accent)">publish the app</b>, or reconnect every week.</div>`;
  const fx=big.querySelector('.fx');
  const at=[wordAt(1,'google'),wordAt(1,'renamed'),wordAt(1,'deleted')], tT=wordAt(2,'testing'), tP=wordAt(2,'publish');
  const camIn=cam(.2,220);
  return t=>{hd(t); cards.forEach((p,i)=>{p.style.opacity=ramp(t,at[i]-.2,.3); p.style.transform=`translateY(${(1-spring((t-at[i]+.2)/.6))*40}px)`;
      p.style.boxShadow= i===0&&t>tT? `0 0 0 3px ${WARN},0 40px 80px rgba(0,0,0,.5)`:'0 0 0 1px rgba(255,255,255,.07),0 40px 80px rgba(0,0,0,.5)'});
    big.style.opacity=ramp(t,tT-.3,.4); fx.style.opacity=ramp(t,tP-.2,.3);
    camIn(t)};
};
