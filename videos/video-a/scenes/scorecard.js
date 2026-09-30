// 1:40 — orange scorecard: 4 PAGES struck, what actually arrived
SCENES.scorecard=()=>{
  stage.style.background='var(--orange)';
  const big=el('div','abs mega'); Object.assign(big.style,{left:0,right:0,top:'150px',textAlign:'center',fontSize:'250px',color:'var(--ink)'});
  big.textContent='4 PAGES';
  const slash=el('div','abs'); Object.assign(slash.style,{left:'430px',top:'265px',height:'26px',width:'1060px',background:'#fff',transformOrigin:'left center',borderRadius:'13px'});
  const stats=[['2','pages','pages'],['1','empty run','empty'],['1','unusable','use']].map(([n,l,w],i)=>{
    const d=el('div','abs',null,`<div class="mega" style="font-size:230px;color:#fff">${n}</div><div style="font-weight:900;font-size:46px;color:var(--ink);margin-top:12px;letter-spacing:-.01em">${l}</div>`);
    Object.assign(d.style,{left:(300+i*480)+'px',top:'470px',width:'420px',textAlign:'center'});
    return [wordAt(0,w),d]});
  const bill=el('div','abs serif',null,'…and a bill that didn’t match any of it.');
  Object.assign(bill.style,{left:0,right:0,top:'930px',textAlign:'center',fontSize:'56px',fontStyle:'italic',color:'#2a130a'});
  const tl=tally(0); const camIn=cam(.2);
  const billAt=wordAt(0,'bill');
  return t=>{
    big.style.opacity=ramp(t,0,.25); big.style.transform=`scale(${lerp(1.15,1,ramp(t,0,.5,outExpo))})`;
    const sk=ramp(t,.55,.35,outExpo); slash.style.transform=`rotate(-4deg) scaleX(${sk})`;
    const up=ramp(t,1.2,.6,inOut);
    big.style.top=(150-up*60)+'px'; big.style.color=up>0?`rgba(21,18,15,${1-.55*up})`:'var(--ink)';
    slash.style.top=(265-up*60)+'px'; slash.style.opacity=1-.4*up;
    for(const [s,d] of stats){const k=spring((t-s+.1)/.7); d.style.opacity=clamp((t-s+.1)*5); d.style.transform=`translateY(${(1-k)*90}px)`;}
    bill.style.opacity=ramp(t,billAt,.5);
    tl(t); camIn(t);
  };
};
