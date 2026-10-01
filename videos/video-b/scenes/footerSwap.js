// 7:30 — the same email twice, identical except the footer: an apology, or an explanation
SCENES.footerSwap=()=>{
  theme('dark');
  const box=panel(null,{left:'420px',top:'130px',width:'860px',padding:'40px 48px'});
  box.innerHTML=`<div style="font-size:24px;color:var(--mute)">From <b style="color:var(--cream)">you@yourcompany.com</b> · to client@luwakiai.co</div>
    <div style="font-weight:900;font-size:40px;margin-top:20px">Re: Updated figures for Q3</div>
    <div class="serif" style="font-size:32px;line-height:1.5;margin-top:20px;color:#d8d0c4">Hi Luwaki — attached are the revised figures for the third quarter, with the shipping line split out as you asked. Happy to walk through them on Thursday.<br><br>Best,<br>Your name</div>
    <div class="ft" style="margin-top:26px;padding-top:18px;border-top:1px solid #2a2622;font-size:26px;font-weight:700;color:var(--blue);overflow:hidden;white-space:nowrap">Sent automatically by my email assistant.</div>`;
  const ft=box.querySelector('.ft');
  const opts=[['identity','A separate sending identity'],['alias','An alias'],['bottom','A line at the bottom']].map(([w,txt],i)=>{
    const d=el('div','abs',null,txt); Object.assign(d.style,{left:'1340px',top:(200+i*110)+'px',padding:'22px 30px',borderRadius:'18px',background:'#191714',boxShadow:'0 0 0 2px rgba(127,196,214,.45)',fontWeight:900,fontSize:'32px',whiteSpace:'nowrap'});
    return pop(d,wordAt(1,w)-.1,40)});
  const verdict=el('div','abs mega'); Object.assign(verdict.style,{left:'1340px',top:'610px',fontSize:'78px'});
  const vsub=el('div','abs serif'); Object.assign(vsub.style,{left:'1344px',top:'710px',fontSize:'38px',fontStyle:'italic',color:'#b9b0a4',width:'520px'});
  const head=heading('Whose name is on it','',420,40,0);
  const tLine=wordAt(1,'bottom'), tAp=wordAt(2,'apology'), tEx=wordAt(2,'explanation');
  const camIn=cam(.2,240);
  return t=>{
    head(t); box.style.opacity=ramp(t,0,.4);
    opts.forEach(o=>o(t));
    // footer types on with the option, then the cut: without it (apology), with it (explanation)
    let f=ramp(t,tLine,.8,clamp); if(t>=tAp-.1&&t<tEx-.1) f=0;
    ft.style.width=(f*100)+'%'; ft.style.opacity=f>0?1:0;
    const mode=t>=tEx-.1?'e':t>=tAp-.1?'a':null;
    verdict.textContent=mode==='a'?'Apology.':mode==='e'?'Explanation.':'';
    verdict.style.color=mode==='e'?'var(--blue)':'var(--cream)';
    vsub.textContent=mode==='a'?'They thought it was you.':mode==='e'?'They knew a machine was involved.':'';
    const since=t-(mode==='e'?tEx:tAp); verdict.style.transform=`translateY(${(1-spring((since+.1)/.5))*30}px)`;
    box.style.boxShadow=mode?`0 0 0 3px ${mode==='e'?'rgba(127,196,214,.6)':'rgba(241,234,223,.25)'},0 40px 80px rgba(0,0,0,.5)`:'0 0 0 1px rgba(255,255,255,.07)';
    camIn(t);
  };
};
