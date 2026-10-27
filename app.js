(()=>{const hero=document.querySelector('.hero'),scene=document.getElementById('scene'),robot=document.getElementById('robot'),sprite=document.getElementById('robotSprite'),code=document.getElementById('codeOut'),codeCaret=document.querySelector('.code-caret'),preview=document.getElementById('previewBody'),serviceName=document.getElementById('serviceName'),status=document.getElementById('statusText'),label=document.getElementById('serviceLabel'),metricLabel=document.getElementById('metricLabel'),metricValue=document.getElementById('metricValue'),bars=document.getElementById('bars');let state='typing',cur=0,codeIndex=0,typeTimer,idleTimer,spriteTimer,frame=0;const services=[{name:'Web Development',short:'WEB DEVELOPMENT',metric:'Performance',value:'98%',preview:'web',bars:[35,52,46,70,84],code:['const site = build({','  fast: true,','  responsive: true,','  polished: true','});','','deploy(site);']},{name:'UI / UX Design',short:'UI / UX DESIGN',metric:'Usability',value:'94%',preview:'ui',bars:[45,58,64,72,88],code:['frame("Homepage");','grid.columns(12);','prototype.link("checkout");','','test.withUsers(12);']}];const cols=4,rows=3,totalFrames=12;const directionalStates=new Set(['look-left','look-right','look-up']);function showFrame(i){const c=i%cols,r=Math.floor(i/cols);sprite.style.backgroundPosition=`${c*(100/(cols-1))}% ${r*(100/(rows-1))}%`}function stopSprite(){clearInterval(spriteTimer)}function startTypingSprite(){stopSprite();frame=0;showFrame(frame);spriteTimer=setInterval(()=>{if(state!=='typing')return;frame=(frame+1)%totalFrames;showFrame(frame)},105)}function playDirectionalSprite(){stopSprite();frame=0;showFrame(frame);spriteTimer=setInterval(()=>{if(!directionalStates.has(state)){stopSprite();return}if(frame<totalFrames-1){frame++;showFrame(frame)}else{stopSprite();showFrame(totalFrames-1)}},105)}function type(reset=false){clearTimeout(typeTimer);if(reset){codeIndex=0;code.textContent=''}if(state!=='typing')return;const t=services[cur].code.join('\n');if(codeIndex>=t.length){typeTimer=setTimeout(()=>type(true),800);return}code.textContent+=t[codeIndex++];if(codeCaret){const before=t.slice(0,codeIndex).split('\n');const line=before.length-1;const col=before[before.length-1].length;codeCaret.style.top=(27+line*14)+'px';codeCaret.style.left=(11+col*5.2)+'px'}typeTimer=setTimeout(type,25+Math.random()*35)}function render(){const s=services[cur];if(preview){preview.classList.toggle('web-gif',s.preview==='web');preview.classList.toggle('uiux-figma',s.preview==='ui');}if(serviceName)serviceName.textContent=s.name;if(label)label.textContent=s.short;if(metricLabel)metricLabel.textContent=s.metric;if(metricValue)metricValue.textContent=s.value;if(bars)bars.innerHTML=s.bars.map(v=>`<i style="height:${v}%"></i>`).join('');if(preview)preview.innerHTML=(s.preview==='ui'?'<div class="figma-edit-layer"><i class="figma-box b1"></i><i class="figma-box b2"></i><i class="figma-box b3"></i></div>':'')+'<div class="live-site"><div class="site-nav"><span class="site-logo">DESKON</span><div class="site-links"><span>Home</span><span>Work</span><span>Contact</span></div></div><div class="site-hero"><div class="site-copy"><b>Build better digital experiences.</b><p>Fast, modern websites designed to help ambitious businesses move forward.</p><span class="site-btn">Start a project</span></div><div class="site-art"></div></div><div class="site-cards"><div class="site-card"><i></i><span></span><span></span></div><div class="site-card"><i></i><span></span><span></span></div><div class="site-card"><i></i><span></span><span></span></div></div></div>';type(true)}function setState(next){if(state===next){if(directionalStates.has(next)&&frame>=totalFrames-1)showFrame(totalFrames-1);return}state=next;robot.classList.toggle('typing',next==='typing');robot.classList.toggle('look-left',next==='look-left');robot.classList.toggle('look-right',next==='look-right');robot.classList.toggle('look-up',next==='look-up');robot.classList.toggle('tracking',next==='tracking');if(next==='typing'){if(status)status.textContent='Robot is building';startTypingSprite();type()}else if(next==='look-left'){clearTimeout(typeTimer);if(status)status.textContent='Looking left';playDirectionalSprite()}else if(next==='look-right'){clearTimeout(typeTimer);if(status)status.textContent='Looking right';playDirectionalSprite()}else if(next==='look-up'){clearTimeout(typeTimer);if(status)status.textContent='Looking up';playDirectionalSprite()}else{clearTimeout(typeTimer);stopSprite();if(status)status.textContent='Watching your cursor'}}function track(e){const rr=robot.getBoundingClientRect(),robotCenterX=rr.left+rr.width/2,robotCenterY=rr.top+rr.height/2;let next='tracking';if(e.clientY<robotCenterY-90)next='look-up';else if(e.clientX<robotCenterX-30)next='look-left';else if(e.clientX>robotCenterX+30)next='look-right';setState(next);clearTimeout(idleTimer);idleTimer=setTimeout(()=>setState('typing'),1000)}hero.addEventListener('mousemove',track);hero.addEventListener('mouseleave',()=>{clearTimeout(idleTimer);idleTimer=setTimeout(()=>setState('typing'),1000)});setInterval(()=>{cur=(cur+1)%services.length;render()},4000);render();startTypingSprite();})();


;(()=> {
  const scene=document.getElementById('scene');
  const toggle=document.getElementById('editorToggle');
  const targetSelect=document.getElementById('editorTarget');
  const angleSlider=document.getElementById('angleSlider');
  const tiltXSlider=document.getElementById('tiltXSlider');
  const tiltYSlider=document.getElementById('tiltYSlider');
  const angleValue=document.getElementById('angleValue');
  const tiltXValue=document.getElementById('tiltXValue');
  const tiltYValue=document.getElementById('tiltYValue');
  const drawBtn=document.getElementById('drawLineBtn');
  const undoBtn=document.getElementById('undoLineBtn');
  const resetBtn=document.getElementById('resetLayoutBtn');
  const saveBtn=document.getElementById('saveLayoutBtn');
  const hint=document.getElementById('editorHint');
  const output=document.getElementById('layoutOutput');
  const outputText=document.getElementById('layoutOutputText');
  const copyBtn=document.getElementById('copyLayoutBtn');
  const closeOutput=document.getElementById('closeOutput');
  const network=scene?.querySelector('.power-network');
  if(!scene||!toggle||!network)return;

  const configs={
    code:{el:scene.querySelector('.code-screen'),rotateZ:-5,tiltX:0,tiltY:7,perspective:1100},
    browser:{el:scene.querySelector('.browser-screen'),rotateZ:-7,tiltX:0,tiltY:-6,perspective:1100},
    analytics:{el:scene.querySelector('.analytics-screen'),rotateZ:4,tiltX:0,tiltY:-5,perspective:1000},
    phone:{el:scene.querySelector('.phone-screen'),rotateZ:7,tiltX:0,tiltY:0,perspective:900}
  };

  const initial={};
  Object.entries(configs).forEach(([key,c])=>{
    const cs=getComputedStyle(c.el);
    initial[key]={
      left:parseFloat(cs.left)||0,
      top:parseFloat(cs.top)||0,
      rotateZ:c.rotateZ,
      tiltX:c.tiltX,
      tiltY:c.tiltY
    };
  });

  let active=false,selected='code',drag=null,drawing=false,drawPoints=[],customLines=[],originalsHidden=false;

  function applyTransform(key){
    const c=configs[key];
    c.el.style.setProperty(
      'transform',
      `perspective(${c.perspective}px) rotateX(${c.tiltX}deg) rotateY(${c.tiltY}deg) rotateZ(${c.rotateZ}deg)`,
      'important'
    );
  }

  function selectTarget(key){
    selected=key;
    targetSelect.value=key;
    Object.values(configs).forEach(c=>c.el.classList.remove('editor-selected'));
    const c=configs[key];
    c.el.classList.add('editor-selected');
    angleSlider.value=c.rotateZ;
    tiltXSlider.value=c.tiltX;
    tiltYSlider.value=c.tiltY;
    angleValue.textContent=c.rotateZ+'°';
    tiltXValue.textContent=c.tiltX+'°';
    tiltYValue.textContent=c.tiltY+'°';
    hint.textContent='Drag the screen directly. Rotate changes spin; Tilt X/Y changes its 3D direction.';
  }

  function setEditor(on){
    active=on;
    scene.classList.toggle('layout-editing',on);
    toggle.textContent=on?'Close Layout Editor':'Edit Hero Layout';
    if(on){
      Object.values(configs).forEach(c=>{
        c.el.style.animation='none';
        c.el.style.translate='0 0';
      });
      selectTarget(selected);
    }else{
      Object.values(configs).forEach(c=>c.el.classList.remove('editor-selected'));
      stopDrawing(false);
      drag=null;
    }
  }

  toggle.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    setEditor(!active);
  });
  targetSelect.addEventListener('change',()=>selectTarget(targetSelect.value));

  function screenKeyFromElement(el){
    for(const [key,c] of Object.entries(configs)) if(c.el===el) return key;
    return null;
  }

  scene.addEventListener('pointerdown',e=>{
    if(!active||drawing)return;
    if(e.target.closest?.('.layout-editor')||e.target.closest?.('.layout-output'))return;

    const screen=e.target.closest?.('.floating-screen');
    if(!screen)return;

    const key=screenKeyFromElement(screen);
    if(!key)return;

    e.preventDefault();
    e.stopPropagation();
    selectTarget(key);

    const cs=getComputedStyle(screen);
    drag={
      key,
      pointerId:e.pointerId,
      sx:e.clientX,
      sy:e.clientY,
      left:parseFloat(cs.left)||0,
      top:parseFloat(cs.top)||0
    };

    scene.setPointerCapture?.(e.pointerId);
    hint.textContent=`Moving ${key}…`;
  },true);

  scene.addEventListener('pointermove',e=>{
    if(!active||!drag||drawing)return;
    if(e.pointerId!==drag.pointerId)return;

    e.preventDefault();
    e.stopPropagation();

    const c=configs[drag.key];
    const nx=drag.left+(e.clientX-drag.sx);
    const ny=drag.top+(e.clientY-drag.sy);

    c.el.style.setProperty('left',nx.toFixed(1)+'px','important');
    c.el.style.setProperty('right','auto','important');
    c.el.style.setProperty('top',ny.toFixed(1)+'px','important');

    hint.textContent=`${drag.key}: left ${nx.toFixed(1)}px · top ${ny.toFixed(1)}px`;
  },true);

  function endDrag(e){
    if(!drag)return;
    if(e?.pointerId!=null&&e.pointerId!==drag.pointerId)return;
    try{scene.releasePointerCapture?.(drag.pointerId)}catch{}
    drag=null;
  }
  scene.addEventListener('pointerup',endDrag,true);
  scene.addEventListener('pointercancel',endDrag,true);

  /* stop the robot cursor tracker from fighting the editor */
  scene.addEventListener('mousemove',e=>{if(active)e.stopPropagation()},true);

  angleSlider.addEventListener('input',()=>{
    const c=configs[selected];
    c.rotateZ=parseFloat(angleSlider.value);
    angleValue.textContent=c.rotateZ+'°';
    applyTransform(selected);
  });
  tiltXSlider.addEventListener('input',()=>{
    const c=configs[selected];
    c.tiltX=parseFloat(tiltXSlider.value);
    tiltXValue.textContent=c.tiltX+'°';
    applyTransform(selected);
  });
  tiltYSlider.addEventListener('input',()=>{
    const c=configs[selected];
    c.tiltY=parseFloat(tiltYSlider.value);
    tiltYValue.textContent=c.tiltY+'°';
    applyTransform(selected);
  });

  function svgPoint(evt){
    const rect=network.getBoundingClientRect();
    return {
      x:(evt.clientX-rect.left)*(680/rect.width),
      y:(evt.clientY-rect.top)*(670/rect.height)
    };
  }

  function refreshTemp(){
    network.querySelectorAll('.editor-control-point,.editor-temp-line').forEach(n=>n.remove());
    drawPoints.forEach(p=>{
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('class','editor-control-point');
      dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);dot.setAttribute('r','5');
      network.appendChild(dot);
    });
    if(drawPoints.length>1){
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('class','editor-temp-line');
      let d=`M${drawPoints[0].x.toFixed(1)} ${drawPoints[0].y.toFixed(1)}`;
      if(drawPoints.length===2)d+=` L${drawPoints[1].x.toFixed(1)} ${drawPoints[1].y.toFixed(1)}`;
      if(drawPoints.length===3)d+=` Q${drawPoints[1].x.toFixed(1)} ${drawPoints[1].y.toFixed(1)} ${drawPoints[2].x.toFixed(1)} ${drawPoints[2].y.toFixed(1)}`;
      path.setAttribute('d',d);
      network.appendChild(path);
    }
  }

  function beginDrawing(){
    if(!active)setEditor(true);
    drawing=true;drag=null;
    scene.classList.add('drawing-line');
    drawPoints=[];
    if(!originalsHidden){
      network.querySelectorAll('.orbit-line:not(.editor-line)').forEach(p=>p.style.display='none');
      originalsHidden=true;
    }
    drawBtn.textContent='Drawing… click 4 points';
    hint.textContent='Click: start → curve 1 → curve 2 → end.';
    refreshTemp();
  }
  function stopDrawing(restoreHint=true){
    drawing=false;
    scene.classList.remove('drawing-line');
    drawPoints=[];refreshTemp();
    drawBtn.textContent='Draw web line';
    if(restoreHint&&active)hint.textContent='Drag screens or adjust Rotate / Tilt X / Tilt Y.';
  }
  drawBtn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    drawing?stopDrawing():beginDrawing();
  });

  scene.addEventListener('pointerdown',e=>{
    if(!active||!drawing)return;
    if(e.target.closest?.('.layout-editor')||e.target.closest?.('.layout-output'))return;
    e.preventDefault();e.stopPropagation();

    drawPoints.push(svgPoint(e));
    refreshTemp();
    hint.textContent=`Web line point ${drawPoints.length}/4`;

    if(drawPoints.length===4){
      const [a,b,c,d]=drawPoints;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('class','orbit-line strong editor-line');
      p.setAttribute('d',`M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${b.x.toFixed(1)} ${b.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${d.x.toFixed(1)} ${d.y.toFixed(1)}`);
      network.insertBefore(p,network.querySelector('.power-particles'));
      customLines.push(p);
      drawPoints=[];refreshTemp();
      hint.textContent='Curve added. Add another 4-point curve or stop drawing.';
    }
  },true);

  undoBtn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const line=customLines.pop();
    if(line)line.remove();
    hint.textContent=line?'Last custom web line removed.':'No custom web line to undo.';
  });

  function restoreOriginalLines(){
    network.querySelectorAll('.orbit-line:not(.editor-line)').forEach(p=>p.style.display='');
    originalsHidden=false;
  }

  resetBtn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    Object.entries(configs).forEach(([key,c])=>{
      const v=initial[key];
      c.rotateZ=v.rotateZ;c.tiltX=v.tiltX;c.tiltY=v.tiltY;
      c.el.style.setProperty('left',v.left+'px','important');
      c.el.style.setProperty('right','auto','important');
      c.el.style.setProperty('top',v.top+'px','important');
      applyTransform(key);
    });
    customLines.forEach(p=>p.remove());customLines=[];
    restoreOriginalLines();
    localStorage.removeItem('deskonHeroLayoutDraft');
    selectTarget('code');
    hint.textContent='Layout reset.';
  });

  function collect(){
    const screens={};
    Object.entries(configs).forEach(([key,c])=>{
      const cs=getComputedStyle(c.el);
      screens[key]={
        left:Math.round((parseFloat(cs.left)||0)*10)/10,
        top:Math.round((parseFloat(cs.top)||0)*10)/10,
        rotateZ:c.rotateZ,
        tiltX:c.tiltX,
        tiltY:c.tiltY
      };
    });
    const paths=(customLines.length?customLines:[...network.querySelectorAll('.orbit-line:not(.editor-line)')])
      .filter(p=>p.style.display!=='none'||customLines.length)
      .map(p=>p.getAttribute('d'));
    return {scene:{width:scene.clientWidth,height:scene.clientHeight},screens,webLines:paths};
  }

  saveBtn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    stopDrawing(false);
    const data=collect();
    localStorage.setItem('deskonHeroLayoutDraft',JSON.stringify(data));
    outputText.value=JSON.stringify(data,null,2);
    output.classList.add('open');
    console.log('DESKON HERO LAYOUT',data);
    hint.textContent='Saved locally. Copy the values and send them to me.';
  });

  copyBtn.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(outputText.value);
      copyBtn.textContent='Copied!';
      setTimeout(()=>copyBtn.textContent='Copy values',1200);
    }catch{
      outputText.select();
      document.execCommand('copy');
    }
  });
  closeOutput.addEventListener('click',()=>output.classList.remove('open'));

  const saved=localStorage.getItem('deskonHeroLayoutDraft');
  if(saved){
    try{
      const data=JSON.parse(saved);
      Object.entries(data.screens||{}).forEach(([key,v])=>{
        if(!configs[key])return;
        configs[key].rotateZ=v.rotateZ ?? v.angle ?? configs[key].rotateZ;
        configs[key].tiltX=v.tiltX ?? configs[key].tiltX;
        configs[key].tiltY=v.tiltY ?? configs[key].tiltY;
        configs[key].el.style.setProperty('left',v.left+'px','important');
        configs[key].el.style.setProperty('right','auto','important');
        configs[key].el.style.setProperty('top',v.top+'px','important');
        applyTransform(key);
      });
      if(Array.isArray(data.webLines)&&data.webLines.length){
        network.querySelectorAll('.orbit-line:not(.editor-line)').forEach(p=>p.style.display='none');
        originalsHidden=true;
        data.webLines.forEach(d=>{
          const p=document.createElementNS('http://www.w3.org/2000/svg','path');
          p.setAttribute('class','orbit-line strong editor-line');
          p.setAttribute('d',d);
          network.insertBefore(p,network.querySelector('.power-particles'));
          customLines.push(p);
        });
      }
    }catch{}
  }
})();
