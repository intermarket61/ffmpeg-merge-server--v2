// ================================================================== stills
// Full-frame stills (engine/images.py) with a slow camera move on each and a
// soft cross-dissolve between them. Each still starts at its `at` word, else
// the shots' sentences are shared out evenly. A still not generated yet shows
// its prompt on a dark card, so layout can be reviewed before paying.
//   images: [{src, prompt, at: [line, word, nth?], move: in|out|left|right}]
//   params.notes: [[line, word, html, nth?]]  small paper label, lower left
function stillStarts(imgs){
  const n=imgs.length, nl=S.lines.length;
  return imgs.map((im,i)=>{
    if(i===0) return 0;
    if(im.at) return wAt(im.at);
    if(n<=nl) return S.lines[Math.floor(i*nl/n)].t0-.25;
    return i*S.duration/n;
  });
}
function stillLayer(im,parent){
  const d=el('div','fill',parent); d.style.overflow='hidden';
  if(im.src){
    const img=el('img','fill',d); img.src=im.src;
    Object.assign(img.style,{width:'100%',height:'100%',objectFit:'cover'});
  }else{
    d.style.background='#2a2520';
    const t=el('div','abs serif',d,'not generated yet<br><br>'+im.prompt);
    Object.assign(t.style,{left:'160px',right:'160px',top:'300px',fontSize:'34px',lineHeight:1.35,color:'#b9ad9a'});
  }
  return d;
}
function kenBurns(d,move,k){
  // 100% -> 106% (or back), or a gentle drift across at 106%
  const e=inOut(k), m=move||'in';
  if(m==='in') d.style.transform=`scale(${1+.06*e})`;
  else if(m==='out') d.style.transform=`scale(${1.06-.06*e})`;
  else{const dir=m==='left'?-1:1; d.style.transform=`scale(1.06) translateX(${dir*(-1.6+3.2*e)}%)`}
}
function noteLabels(list){
  return (list||[]).map(([ln,w,h,nth])=>{
    const n=el('div','note serif','',h); n.style.opacity=0;
    return [wordAt(ln,w,nth||0),n];
  });
}
function runNotes(notes,t){
  notes.forEach(([s,n],i)=>{
    const end=i+1<notes.length?notes[i+1][0]:S.duration;
    const k=Math.min(ramp(t,s,.6),1-ramp(t,end-.5,.4));
    n.style.opacity=k; n.style.transform=`translateY(${(1-outCubic(k))*18}px) rotate(-1.2deg)`;
  });
}
SCENES.still=()=>{
  stage.style.background='#1b1814';
  const imgs=(S.images||[]).length?S.images:[{src:null,prompt:'(no images on this shot)'}];
  const starts=stillStarts(imgs), XF=1.0;
  const moves=['in','left','out','right'];
  const seed=[...S.key].reduce((a,c)=>a+c.charCodeAt(0),0);
  const layers=imgs.map((im,i)=>({d:stillLayer(im),s:starts[i],e:i+1<imgs.length?starts[i+1]:S.duration,
                                  move:im.move||moves[(seed+i)%4]}));
  const notes=noteLabels(P().notes);
  return t=>{
    layers.forEach((L,i)=>{
      const a= i===0?1:ramp(t,L.s-XF/2,XF,inOut);
      const gone= i+1<layers.length && t>layers[i+1].s+XF/2;
      L.d.style.opacity=gone?0:a;
      kenBurns(L.d,L.move,(t-L.s+XF/2)/(L.e-L.s+XF));
    });
    runNotes(notes,t);
  };
};
// ================================================================== chapter
// A numbered section card: the number and title painted onto warm paper,
// over a still if the shot has one.  params: {n, title}
SCENES.chapter=()=>{
  stage.style.background='#efe5d2';
  let bg=null;
  if((S.images||[]).length){bg=stillLayer(S.images[0]); bg.style.filter='saturate(.8) brightness(.55)'}
  const onImg=!!bg, ink=onImg?'#f6efe2':'#3b2f24';
  const num=el('div','abs serif',null,String(P().n??''));
  Object.assign(num.style,{left:0,right:0,top:'250px',textAlign:'center',fontSize:'300px',fontStyle:'italic',
    color:onImg?'#e7c48a':'#b9772f',lineHeight:1});
  const rule=el('div','abs'); Object.assign(rule.style,{left:'50%',top:'600px',width:'220px',height:'3px',
    marginLeft:'-110px',background:onImg?'#e7c48a':'#b9772f',transformOrigin:'center'});
  const title=el('div','abs serif',null,P().title||'');
  Object.assign(title.style,{left:'200px',right:'200px',top:'650px',textAlign:'center',fontSize:'64px',
    lineHeight:1.15,color:ink});
  const tAt=P().titleAt?wAt(P().titleAt):.7;
  return t=>{
    if(bg) kenBurns(bg,'in',t/S.duration);
    const a=ramp(t,.15,.9); num.style.opacity=a; num.style.transform=`translateY(${(1-a)*24}px)`;
    rule.style.transform=`scaleX(${ramp(t,.45,.8,inOut)})`;
    const b=ramp(t,tAt,.8); title.style.opacity=b; title.style.transform=`translateY(${(1-b)*16}px)`;
  };
};
