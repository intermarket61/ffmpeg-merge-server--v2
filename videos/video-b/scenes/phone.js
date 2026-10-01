// 0:30 — a phone on the nightstand at 07:00, lighting up. params.end: the callback, dark
SCENES.phone=()=>{
  const end=!!P().end;
  stage.style.background='radial-gradient(ellipse at 62% 40%,#141a1e 0%,#070808 70%)';
  const table=el('div','abs'); Object.assign(table.style,{left:0,right:0,top:'700px',bottom:0,background:'linear-gradient(180deg,#1d1814 0%,#0d0b09 100%)'});
  const spill=el('div','abs'); Object.assign(spill.style,{left:'1000px',top:'560px',width:'900px',height:'420px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(170,215,235,.30),transparent 65%)'});
  const ph=el('div','abs'); Object.assign(ph.style,{left:'1240px',top:'250px',width:'380px',height:'700px',borderRadius:'56px',background:'#0b0c0d',
    boxShadow:'0 0 0 4px #24262a,0 50px 80px rgba(0,0,0,.7)',transform:'perspective(1600px) rotateX(34deg) rotateZ(-8deg)',transformOrigin:'50% 100%',overflow:'hidden'});
  const scr=el('div','fill',ph); scr.style.background='linear-gradient(170deg,#203a4a 0%,#0f1a24 70%)';
  scr.innerHTML=`<div style="text-align:center;margin-top:80px;font-weight:700;font-size:26px;color:#cfe3ea">Monday</div>
    <div class="mega" style="text-align:center;font-size:130px;margin-top:6px;color:#eef6f8">07:00</div>
    <div class="note" style="margin:60px 24px 0;padding:22px 24px;border-radius:24px;background:rgba(240,248,250,.16);color:#eef6f8">
      <div style="font-weight:700;font-size:20px;opacity:.75">MAIL · now</div>
      <div style="font-weight:900;font-size:26px;margin-top:6px">Re: Revised numbers for Q3</div>
      <div style="font-family:Newsreader,serif;font-size:24px;margin-top:4px;opacity:.85">I think this was meant for someone else?</div></div>`;
  const note=scr.querySelector('.note');
  let words;
  if(end){
    words=el('div','abs',null,'<div class="kicker">Monday · 07:00</div><div class="mega" style="font-size:120px;margin-top:18px">Nothing<br>went out.</div><div class="serif" style="font-size:44px;font-style:italic;color:#b9b0a4;margin-top:30px">Set it up before you connect anything.</div>');
  }else{
    words=el('div','abs',null,'<div class="kicker">Before you connect</div><div class="list" style="display:flex;gap:22px;margin-top:22px;font-weight:900;font-size:44px"></div><div class="mega head" style="font-size:104px;margin-top:60px">The worst<br>version of<br>your week.</div>');
  }
  Object.assign(words.style,{left:'150px',top:'250px'});
  const lit= end ? 1e9 : wordAt(0,'human');
  const wAt= end ? .6 : 0;
  const head=words.querySelector('.head'), hAt= end ? 0 : wordAt(0,'settings');
  const names= end ? [] : [['gmail','Gmail'],['slack','Slack'],['human','anything that reaches a person']].map(([w,txt])=>{
    const c=chip(words.querySelector('.list'),txt,'var(--amber)',{fontSize:'34px',padding:'12px 22px',background:'rgba(255,177,61,.12)'});return pop(c,wordAt(0,w)-.1,30)});
  return t=>{
    const k=ramp(t,lit,.35);
    scr.style.opacity=k; spill.style.opacity=k*(.85+.15*Math.sin(t*2));
    note.style.transform=`translateY(${(1-spring((t-lit-.4)/.7))*40}px)`; note.style.opacity=ramp(t,lit+.4,.3);
    ph.style.transform=`perspective(1600px) rotateX(34deg) rotateZ(-8deg) translateY(${k>0&&t<lit+.6?Math.sin((t-lit)*60)*3:0}px)`;
    words.style.opacity=ramp(t,wAt,.6); names.forEach(n=>n(t));
    if(head){head.style.opacity=ramp(t,hAt-.1,.5); head.style.transform=`translateY(${(1-outCubic((t-hAt+.1)/.8))*30}px)`;}
  };
};
