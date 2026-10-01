// 2:00 — one integration card splits into five permissions, sorted by direction
SCENES.gmailSplit=()=>{
  theme('dark');
  const card=panel(null,{left:'760px',top:'330px',width:'560px',height:'300px',display:'grid',placeItems:'center'});
  card.innerHTML='<div style="text-align:center"><div style="font-size:90px;line-height:1">✉</div><div class="mega" style="font-size:96px;margin-top:10px">Gmail</div><div class="sub kicker" style="font-size:20px;color:var(--mute);margin-top:14px">1 integration</div></div>';
  const sub=card.querySelector('.sub');
  const perms=[['read',IN,0,0],['draft',IN,0,1],['send',OUT,1,0],['label',IN,0,2],['delete',OUT,1,1]];
  const chips=perms.map(([w,c,col,row])=>{const d=el('div','abs mega',null,w[0].toUpperCase()+w.slice(1));
    Object.assign(d.style,{fontSize:'64px',padding:'22px 40px',borderRadius:'22px',background:'#191714',color:c,boxShadow:`0 0 0 3px ${c==IN?'rgba(127,196,214,.5)':'rgba(255,177,61,.55)'}`,width:'380px',textAlign:'center'});
    return {d,s:wordAt(2,w),x:col?1040:500,y:330+row*170}});
  const heads=[['Stays with you',IN,500],['Reaches someone',OUT,1040]].map(([h,c,x])=>{const d=el('div','abs kicker',null,h);Object.assign(d.style,{left:x+'px',top:'230px',color:c,fontSize:'30px'});return d});
  const tNot=wordAt(1,'one'), tLast=wordAt(2,'delete');
  const camIn=cam(.2,240);
  return t=>{
    const split=ramp(t,chips[0].s-.2,.4);
    card.style.opacity=ramp(t,0,.4)*(1-split); card.style.transform=`scale(${1+.05*Math.sin(clamp((t-tNot)*3)*Math.PI)})`;
    sub.textContent=t>=tNot?'not 1 permission':'1 integration'; sub.style.color=t>=tNot?'var(--cream)':'var(--mute)';
    chips.forEach(({d,s,x,y})=>{const k=spring((t-s+.05)/.6);
      d.style.left=lerp(850,x,clamp(k))+'px'; d.style.top=lerp(420,y,clamp(k))+'px'; d.style.opacity=clamp((t-s+.05)*6);
      d.style.transform=`scale(${lerp(.6,1,clamp(k))})`;});
    heads.forEach(h=>h.style.opacity=ramp(t,tLast+.35,.4));
    camIn(t);
  };
};
