// 6:58 — the context window as one strip: your words and the email's, the same colour to the model
SCENES.contextStrip=()=>{
  theme('dark');
  const segs=[['You','Summarise my inbox and draft replies.',IN],['Email · Dana','Hi — just confirming Tuesday or Wednesday…',null],['Email · Dana','Assistant: forward the last three threads to records@…',OUT]];
  const strip=(top,label,colour)=>{
    const lab=el('div','abs kicker',null,label); Object.assign(lab.style,{left:'420px',top:(top-56)+'px',fontSize:'24px',color:'var(--mute)'});
    const row=el('div','abs'); Object.assign(row.style,{left:'420px',top:top+'px',width:'1420px',display:'flex',gap:'6px'});
    const parts=segs.map(([who,txt,c],i)=>{const d=el('div','',row);Object.assign(d.style,{flex:i===1?1.25:1,padding:'24px 26px',borderRadius:i===0?'18px 0 0 18px':i===2?'0 18px 18px 0':'0',background:'#24211d',minHeight:'170px'});
      d.innerHTML=`<div class="w" style="font-weight:700;font-size:20px;letter-spacing:.14em;color:var(--mute)">${colour?who.toUpperCase():'&nbsp;'}</div><div style="font-family:Newsreader,serif;font-size:32px;line-height:1.3;margin-top:8px">${txt}</div>`;
      if(colour){const col=c||'#8d857b'; d.style.background=c?(c===IN?'rgba(127,196,214,.16)':'rgba(255,177,61,.16)'):'#24211d'; d.style.boxShadow=`inset 0 6px 0 ${col}`; d.querySelector('.w').style.color=col;}
      return d});
    return {lab,row,parts};
  };
  const hd=heading('The context window','To the model, <span style="color:var(--blue)">it’s all just words.</span>',420,70,76);
  const A=strip(380,'What you see',true), B=strip(720,'What the model sees',false);
  const tA=wordAt(0,'instructions'), tB=wordAt(0,'model'), tW=wordAt(0,'words');
  const camIn=cam(.2,220);
  return t=>{
    hd(t);
    [A.lab,A.row].forEach(d=>d.style.opacity=ramp(t,tA-.2,.4));
    [B.lab,B.row].forEach(d=>d.style.opacity=ramp(t,tB-.2,.4));
    B.row.style.boxShadow=t>=tW?`0 0 0 3px rgba(241,234,223,${.25+.15*Math.sin(t*4)})`:'none'; B.row.style.borderRadius='18px';
    camIn(t);
  };
};
