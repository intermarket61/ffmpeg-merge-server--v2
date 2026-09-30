// ================================================================== end card: reset, then 30 more days
SCENES.endCard=()=>{
  theme('dark');
  const num=el('div','abs mega'); Object.assign(num.style,{left:0,right:0,top:'250px',textAlign:'center',fontSize:'470px'});
  const lab=el('div','abs kicker',null,'Days unsupervised'); Object.assign(lab.style,{left:0,right:0,top:'760px',textAlign:'center',fontSize:'34px',letterSpacing:'.42em'});
  const end=el('div','fill'); end.style.background='radial-gradient(ellipse at 50% 30%,#241510 0%,#0c0b0a 65%)';
  end.innerHTML=`<div class="kicker" style="position:absolute;left:0;right:0;top:150px;text-align:center">Day one. Again.</div>
    <div class="mega" style="position:absolute;left:0;right:0;top:210px;text-align:center;font-size:190px">30 more days.</div>`;
  const names=[['Scout','#7fc4d6'],['Ridge','#ffb13d'],['Atlas','#8fd694']];
  const fixes=['Approvals → phone','Empty = valid','Briefs for amnesia','Tools · caps · cheap model'];
  const spine=el('div','abs',end); Object.assign(spine.style,{left:'260px',top:'520px',width:'1400px',display:'flex',justifyContent:'space-between',alignItems:'center'});
  spine.innerHTML=names.map(([n,c])=>`<div style="padding:26px 48px;border-radius:22px;background:#191714;box-shadow:0 0 0 2px ${c}66,0 0 40px ${c}33;font-weight:900;font-size:56px">${n}</div>`).join('<div style="flex:1;height:5px;margin:0 20px;background:var(--orange);box-shadow:0 0 14px var(--orange)"></div>');
  const chipRow=el('div','abs',end); Object.assign(chipRow.style,{left:'160px',right:'160px',top:'720px',display:'flex',justifyContent:'center',gap:'22px'});
  const chips=fixes.map((f,i)=>{const c=el('div','',chipRow,`<b style="color:var(--orange)">0${i+1}</b> ${f}`);Object.assign(c.style,{padding:'16px 26px',borderRadius:'16px',background:'#221f1b',fontWeight:900,fontSize:'28px',whiteSpace:'nowrap',boxShadow:'0 0 0 1px rgba(255,255,255,.08)'});return c});
  const tl=tally();
  return t=>{
    const reset=2.2;
    const day= t<reset ? Math.max(0,30-Math.floor(30*inOut(t/reset))) : 1;
    num.textContent=day; num.style.transform=`scale(${t>=reset?1+.15*(1-spring((t-reset)/.6)):1})`;
    num.style.color= t>=reset?'var(--orange)':'var(--cream)';
    const e=ramp(t,3.1,.6,inOut);
    end.style.clipPath=`circle(${e*120}% at 50% 45%)`;
    end.querySelector('.mega').style.transform=`scale(${lerp(1.1,1,e)})`;
    chips.forEach((c,i)=>{const s=3.6+i*.2; c.style.opacity=ramp(t,s,.3); c.style.transform=`translateY(${(1-spring((t-s)/.6))*40}px)`});
    tl(t);
  };
};
