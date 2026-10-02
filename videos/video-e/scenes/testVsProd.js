// 2:06 — test URL only listens while the editor is open; production URL + switched on
SCENES.testVsProd=()=>{
  theme('dark');
  const hd=heading('The trap everyone hits','Test URL vs <span style="color:var(--accent)">production URL.</span>',420,70,80);
  const rows=[['TEST URL','https://your-n8n.example.com/<b>webhook-test</b>/new-lead','Only listens while you watch the editor',WARN],
              ['PRODUCTION URL','https://your-n8n.example.com/<b>webhook</b>/new-lead','Put this one in your form',LEAD]];
  const ps=rows.map(([k,u,note,col],i)=>{const p=panel(null,{left:'420px',top:(260+i*250)+'px',width:'1420px',padding:'30px 38px'});
    p.innerHTML=`<div style="font-weight:700;font-size:22px;letter-spacing:.2em;color:${col}">${k}</div>
      <div style="margin-top:12px;font-family:monospace;font-size:30px;color:#cfc6b8">${u.replace('<b>',`<b style="color:${col}">`)}</div>
      <div class="n" style="margin-top:14px;font-family:Newsreader,serif;font-style:italic;font-size:32px;color:${col}">${note}</div>`;
    return p});
  const sw=el('div','abs'); Object.assign(sw.style,{left:'1480px',top:'780px',display:'flex',alignItems:'center',gap:'20px',fontWeight:900,fontSize:'34px'});
  sw.innerHTML='<span class="lbl">Workflow</span><span class="tr" style="width:110px;height:58px;border-radius:30px;background:#2f2a25;position:relative;display:inline-block"><span class="kn" style="position:absolute;top:7px;left:7px;width:44px;height:44px;border-radius:50%;background:#8d857b"></span></span><span class="st" style="color:#8d857b">off</span>';
  const tr=sw.querySelector('.tr'), kn=sw.querySelector('.kn'), st=sw.querySelector('.st');
  const tT=wordAt(1,'test'), tP=wordAt(1,'production'), tN0=S.lines[2].t0, tN1=S.lines[3].t0, tS=wordAt(3,'switched');
  const camIn=cam(.2,220);
  return t=>{hd(t);
    ps[0].style.opacity=ramp(t,tT-.2,.4); ps[1].style.opacity=ramp(t,tP-.2,.4);
    ps[0].querySelector('.n').style.opacity=ramp(t,tN0,.4); ps[1].querySelector('.n').style.opacity=ramp(t,tN1,.4);
    ps[0].style.filter= t>tN1? 'saturate(.4) brightness(.7)':'none';
    sw.style.opacity=ramp(t,tS-.6,.4); const on=ramp(t,tS,.3);
    kn.style.left=(7+on*52)+'px'; kn.style.background=on>.5?'var(--ink)':'#8d857b'; tr.style.background=on>.5?'var(--accent)':'#2f2a25';
    st.textContent=on>.5?'on':'off'; st.style.color=on>.5?'var(--accent)':'#8d857b';
    camIn(t)};
};
