// 2:40 — same agent, same tool call: one side with you at the desk, one at 07:00 with nobody
SCENES.splitDesk=()=>{
  theme('dark');
  const side=(x,label,sub)=>{
    const w=el('div','abs'); Object.assign(w.style,{left:x+'px',top:0,width:'960px',height:'1080px'});
    const h=el('div','abs',w,`<div class="kicker">${label}</div><div class="mega" style="font-size:64px;margin-top:10px">${sub}</div>`); Object.assign(h.style,{left:'70px',top:'90px'});
    const p=panel(w,{left:'70px',top:'300px',width:'820px',padding:'36px 40px'});
    p.innerHTML=`<div style="font-weight:700;font-size:24px;color:var(--mute)">Inbox agent · tool call</div>
      <div style="margin-top:20px;font-weight:900;font-size:44px;color:var(--amber)">send_email</div>
      <div class="args" style="margin-top:14px;font-size:28px;line-height:1.5;color:#b9b0a4">to: client@jojiai.co<br>subject: Updated figures for Q3</div>
      <div style="display:flex;gap:18px;margin-top:30px"><span class="stop" style="padding:16px 40px;border-radius:14px;background:var(--cream);color:var(--ink);font-weight:900;font-size:30px">Stop</span><span style="padding:16px 40px;border-radius:14px;background:#2a2622;font-weight:900;font-size:30px">Allow</span></div>`;
    return {w,p,args:p.querySelector('.args'),stop:p.querySelector('.stop')};
  };
  const L=side(0,'In a thread','You\'re watching.'), R=side(960,'Monday · 07:00','You\'re asleep.');
  const div=el('div','abs'); Object.assign(div.style,{left:'958px',top:'80px',width:'4px',height:'920px',background:'#2a2622'});
  const cur=el('div','abs',null,'<svg width="46" height="60" viewBox="0 0 23 30"><path d="M1 1 L1 24 L7 18 L11 28 L15 26 L11 17 L19 17 Z" fill="#fff" stroke="#15120f" stroke-width="1.5"/></svg>');
  const nobody=el('div','abs serif',null,'Nobody to press it.'); Object.assign(nobody.style,{left:'1030px',top:'800px',fontSize:'48px',fontStyle:'italic',color:'#b9b0a4'});
  const safety=el('div','abs serif',null,'You are the safety mechanism.'); Object.assign(safety.style,{left:'70px',top:'800px',fontSize:'48px',fontStyle:'italic'});
  const tSafe=wordAt(0,'safety'), tCall=wordAt(1,'tool'), tAbout=wordAt(1,'about'), tStop=wordAt(1,'stop'), tR=S.lines[2].t0, tNo=wordAt(2,'nothing');
  return t=>{
    const focusR=ramp(t,tR,.5);
    L.w.style.opacity=lerp(1,.35,focusR); R.w.style.opacity=lerp(.3,1,focusR);
    safety.style.opacity=ramp(t,tSafe-.1,.4)*lerp(1,.35,focusR);
    L.p.style.boxShadow=t>=tCall?'0 0 0 3px rgba(255,177,61,.5),0 40px 80px rgba(0,0,0,.5)':'0 0 0 1px rgba(255,255,255,.07)';
    L.args.style.color=t>=tAbout?'var(--cream)':'#b9b0a4';
    // cursor glides to Stop and clicks it
    const m=ramp(t,tAbout,.9,inOut); cur.style.left=lerp(700,180,m)+'px'; cur.style.top=lerp(860,640,m)+'px'; cur.style.opacity=ramp(t,.3,.4)*lerp(1,.35,focusR);
    const pressed=t>=tStop; L.stop.style.transform=`scale(${pressed&&t<tStop+.2?.92:1})`; L.stop.style.background=pressed?'var(--blue)':'var(--cream)';
    if(pressed) L.stop.textContent='Stopped';
    R.p.style.boxShadow=t>=tR?'0 0 0 3px rgba(255,177,61,.5),0 40px 80px rgba(0,0,0,.5)':'0 0 0 1px rgba(255,255,255,.07)';
    nobody.style.opacity=ramp(t,tNo,.5);
  };
};
