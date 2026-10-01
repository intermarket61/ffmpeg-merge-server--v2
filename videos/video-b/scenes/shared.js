// 7:50 — three people, one agent, one connected account
SCENES.shared=()=>{
  theme('dark');
  const people=[['E','Editor',760],['V','VA',1130],['T','Teammate',1500]];
  const av=people.map(([i,n,x],k)=>{const d=el('div','abs');Object.assign(d.style,{left:(x-70)+'px',top:'120px',width:'140px',textAlign:'center'});
    d.innerHTML=`<div style="width:120px;height:120px;margin:0 auto;border-radius:50%;background:#2a2622;display:grid;place-items:center;font-weight:900;font-size:52px">${i}</div><div style="font-weight:700;font-size:26px;margin-top:12px">${n}</div><div class="own" style="font-size:20px;color:#6b645b;margin-top:4px;white-space:nowrap">their account: unused</div>`;
    return d});
  const svg=el('div','fill'); svg.innerHTML=`<svg width="1920" height="1080" style="position:absolute;inset:0">${people.map(([,,x])=>`<path d="M${x} 330 C ${x} 420, 1130 380, 1130 470" fill="none" stroke="var(--amber)" stroke-width="5" class="ln" stroke-dasharray="400" />`).join('')}</svg>`;
  const lines=[...svg.querySelectorAll('.ln')];
  const agent=panel(null,{left:'930px',top:'480px',width:'400px',height:'120px',display:'grid',placeItems:'center'}); agent.innerHTML='<div style="font-weight:900;font-size:44px">Shared agent</div>';
  const acct=panel(null,{left:'830px',top:'680px',width:'600px',padding:'28px 36px'});
  acct.innerHTML=`<div class="kicker" style="font-size:20px;color:var(--mute)">Your integrations · your permissions</div><div style="font-weight:900;font-size:40px;margin-top:10px">you@yourcompany.com</div>
    <div style="display:flex;gap:12px;margin-top:16px"><span style="padding:8px 16px;border-radius:10px;background:rgba(127,196,214,.14);color:var(--blue);font-weight:700;font-size:22px">read</span><span style="padding:8px 16px;border-radius:10px;background:rgba(127,196,214,.14);color:var(--blue);font-weight:700;font-size:22px">draft</span><span class="snd" style="padding:8px 16px;border-radius:10px;background:rgba(255,177,61,.16);color:var(--amber);font-weight:700;font-size:22px">send</span></div>`;
  const snd=acct.querySelector('.snd');
  const link=el('div','abs'); Object.assign(link.style,{left:'1128px',top:'600px',width:'5px',height:'80px',background:'var(--amber)'});
  const cap=el('div','abs serif',null,'Sharing the agent <i>is</i> handing over the account.'); Object.assign(cap.style,{left:'420px',top:'960px',fontSize:'44px'});
  const tAtt=wordAt(0,'integrations'), tNot=wordAt(0,'theirs'), tSend=wordAt(1,'send'), tFun=wordAt(1,'functionally');
  const camIn=cam(.2,240);
  return t=>{
    av.forEach((d,i)=>{const k=spring((t-.1-i*.15)/.6); d.style.opacity=clamp((t-.1-i*.15)*5); d.style.transform=`translateY(${(1-k)*-30}px)`;
      d.querySelector('.own').style.opacity=ramp(t,tNot-.1,.3);});
    lines.forEach((l,i)=>{l.style.strokeDashoffset=400*(1-ramp(t,.6+i*.15,.6))});
    agent.style.opacity=ramp(t,.6,.4); acct.style.opacity=ramp(t,tAtt-.2,.4); link.style.opacity=ramp(t,tAtt-.2,.4);
    const pulse=t>=tSend?.5+.5*Math.sin((t-tSend)*6):0; snd.style.boxShadow=`0 0 ${30*pulse}px rgba(255,177,61,.9)`;
    acct.style.boxShadow=t>=tSend?'0 0 0 3px rgba(255,177,61,.55),0 40px 80px rgba(0,0,0,.5)':'0 0 0 1px rgba(255,255,255,.07)';
    cap.style.opacity=ramp(t,tFun-.1,.4); camIn(t);
  };
};
