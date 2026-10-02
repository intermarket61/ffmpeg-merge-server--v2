// ================================================================== screen recording
// A stretch of a screen recording (params.screen: {clip, from, to}; the engine
// fits it under the shot's narration), with a camera that eases into the part
// being talked about, highlight boxes, blurred secrets and setting call-outs.
// Coordinates are in a 1920x1080 reference frame (the recording is fitted into it).
// Until the recording exists the shot renders as a storyboard card, so stills
// show what to record.
// params:
//   tag      'STEP 03 · Google Sheets'  chip top-left, the whole shot
//   show     'what to do on screen'     storyboard text (and the recording guide)
//   zoom     [{at, x, y, w}]            camera rect (16:9, width w) from time `at`; [] = full frame
//   marks    [{at, until, x, y, w, h, label}]   highlight box (with a label tag)
//   blur     [{x, y, w, h, from, to}]   always blurred inside the window (tokens, secrets, emails)
//   notes    [{at, html}]               call-out card bottom-right: the setting just made
// `at`, `until`, `from`, `to`: seconds, or [line, word, nth?] spoken-word times.
SCENES.screen=()=>{
  theme('dark');
  const p=P();
  const T=a=>a==null?null:Array.isArray(a)?wAt(a):a;
  const cv=el('canvas','fill'); cv.width=1920; cv.height=1080; const g=cv.getContext('2d');
  const off=document.createElement('canvas'); off.width=1920; off.height=1080; const o=off.getContext('2d');
  // storyboard card for before the recording exists
  const board=el('div','fill'); board.style.background='repeating-linear-gradient(135deg,#141210 0 22px,#171513 22px 44px)';
  const bin=el('div','abs',board); Object.assign(bin.style,{left:'140px',right:'140px',top:'150px'});
  bin.innerHTML=`<div class="kicker" style="color:var(--blue)">Screen recording · ${p.screen&&p.screen.clip||S.key}</div>
    <div class="serif" style="font-size:54px;line-height:1.2;margin-top:26px;color:var(--cream)">${p.show||''}</div>`;
  const zooms=(p.zoom||[]).map(z=>({...z,t:T(z.at)})).sort((a,b)=>a.t-b.t);
  const marks=(p.marks||[]).map(m=>{const box=el('div','abs'); Object.assign(box.style,{border:'4px solid var(--accent)',borderRadius:'14px',
      boxShadow:'0 0 0 9999px rgba(0,0,0,.35),0 0 30px rgba(0,0,0,.4)',zIndex:5});
    let lab=null; if(m.label){lab=el('div','',box,m.label); Object.assign(lab.style,{position:'absolute',left:'-4px',bottom:'100%',marginBottom:'10px',whiteSpace:'nowrap',
      padding:'8px 16px',borderRadius:'10px',background:'var(--accent)',color:'var(--ink)',fontWeight:900,fontSize:'28px'});}
    return {...m,box,t0:T(m.at),t1:T(m.until)}});
  const blurs=(p.blur||[]).map(b=>({...b,t0:T(b.from),t1:T(b.to)}));
  let tag=null; if(p.tag){tag=el('div','abs',null,p.tag); Object.assign(tag.style,{left:'40px',top:'34px',padding:'12px 22px',borderRadius:'14px',zIndex:6,
    background:'rgba(12,11,10,.82)',boxShadow:'0 0 0 1px rgba(255,255,255,.1)',fontWeight:900,fontSize:'26px',letterSpacing:'.06em',color:'var(--accent)'});}
  const notes=(p.notes||[]).map(n=>{const d=el('div','abs',null,n.html); Object.assign(d.style,{right:'40px',bottom:'40px',maxWidth:'760px',padding:'20px 28px',borderRadius:'18px',zIndex:6,
      background:'rgba(12,11,10,.9)',boxShadow:'0 0 0 2px var(--accent),0 30px 60px rgba(0,0,0,.5)',fontSize:'32px',fontWeight:700,lineHeight:'1.3',color:'var(--cream)'});
    return {d,t:T(n.at)}});
  const full={x:0,y:0,w:1920};
  const rectAt=t=>{ // eased camera rect
    let prev=full, cur=full, t0=-1;
    for(const z of zooms){ if(t>=z.t){prev=cur; cur=(z.w?z:full); t0=z.t;} }
    const k=t0<0?1:inOut((t-t0)/.7);
    const r={x:lerp(prev.x||0,cur.x||0,k),y:lerp(prev.y||0,cur.y||0,k),w:lerp(prev.w||1920,cur.w||1920,k)};
    r.h=r.w*9/16; return r;
  };
  return t=>{
    const live=!!screenBitmap; board.style.display=live?'none':'block';
    const r=rectAt(t), s=1920/r.w;
    if(live){
      o.fillStyle='#0c0b0a'; o.fillRect(0,0,1920,1080);
      const bw=screenBitmap.width, bh=screenBitmap.height, f=Math.min(1920/bw,1080/bh);
      const dw=bw*f, dh=bh*f, dx=(1920-dw)/2, dy=(1080-dh)/2;
      o.filter='none'; o.drawImage(screenBitmap,dx,dy,dw,dh);
      for(const b of blurs){ if((b.t0!=null&&t<b.t0)||(b.t1!=null&&t>b.t1)) continue;
        o.save(); o.beginPath(); o.rect(b.x,b.y,b.w,b.h); o.clip(); o.filter='blur(18px)'; o.drawImage(screenBitmap,dx,dy,dw,dh); o.restore(); }
      g.drawImage(off,r.x,r.y,r.w,r.h,0,0,1920,1080);
    }
    for(const m of marks){ const on=t>=m.t0-.05 && (m.t1==null||t<m.t1);
      m.box.style.display=on?'block':'none'; if(!on) continue;
      const k=spring((t-m.t0)/.5);
      Object.assign(m.box.style,{left:((m.x-r.x)*s-8)+'px',top:((m.y-r.y)*s-8)+'px',width:(m.w*s+16)+'px',height:(m.h*s+16)+'px',
        opacity:live?clamp((t-m.t0)*6):0,transform:`scale(${lerp(1.06,1,clamp(k))})`});
    }
    let shown=null; notes.forEach(n=>{if(t>=n.t) shown=n});
    notes.forEach(n=>{const on=n===shown; n.d.style.opacity=on?ramp(t,n.t,.3):0; n.d.style.transform=`translateY(${on?(1-ramp(t,n.t,.4))*20:0}px)`;});
    if(tag) tag.style.opacity=ramp(t,0,.4);
  };
};
