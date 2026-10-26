(() => {
  const scene = document.getElementById('scene');
  const robot = document.getElementById('robot');
  const head = document.getElementById('svgHead');
  const face = document.getElementById('faceFeatures');
  const pupils = [...document.querySelectorAll('.tracking-pupil')];
  const codeOutput = document.getElementById('codeOutput');
  const preview = document.getElementById('previewCanvas');
  const phone = document.getElementById('phoneScreen');
  const serviceName = document.getElementById('serviceName');
  const robotStatus = document.getElementById('robotStatus');
  const metricLabel = document.getElementById('metricLabel');
  const metricValue = document.getElementById('metricValue');
  const bars = document.getElementById('bars');
  const label = document.querySelector('.service-label');

  let current = 0;
  let cursorTimer;
  let typingTimer;
  let codeIndex = 0;
  let isTracking = false;

  const services = [
    {
      name:'Web Development',
      short:'WEB DEVELOPMENT',
      metric:'Performance',
      value:'98%',
      code:[
        'const experience = {',
        '  speed: "fast",',
        '  design: "responsive",',
        '  users: "delighted"',
        '};',
        '',
        'deploy(experience);'
      ],
      preview:'web',
      bars:[34,52,45,68,82]
    },
    {
      name:'UI / UX Design',
      short:'UI / UX DESIGN',
      metric:'Usability',
      value:'94%',
      code:[
        'frame("Homepage");',
        'grid.columns(12);',
        'button.variant("primary");',
        'prototype.link("checkout");',
        '',
        'test.withUsers(12);'
      ],
      preview:'ui',
      bars:[48,62,56,76,88]
    },
    {
      name:'Cybersecurity',
      short:'CYBERSECURITY',
      metric:'Threat score',
      value:'0.02',
      code:[
        '$ scan --production',
        'checking ssl ........ ok',
        'checking headers .... ok',
        'checking auth ....... ok',
        'checking api ........ ok',
        '',
        '0 critical threats'
      ],
      preview:'security',
      bars:[78,28,46,18,12]
    },
    {
      name:'AI Automation',
      short:'AI AUTOMATION',
      metric:'Tasks automated',
      value:'87%',
      code:[
        'trigger("new_lead")',
        '  .enrich(company)',
        '  .qualify(score)',
        '  .route(owner)',
        '  .notify(slack);',
        '',
        'workflow.run();'
      ],
      preview:'ai',
      bars:[30,50,63,75,90]
    },
    {
      name:'Mobile Apps',
      short:'MOBILE APPS',
      metric:'App health',
      value:'99%',
      code:[
        '<MobileApp>',
        '  <FastNavigation />',
        '  <OfflineCache />',
        '  <PushAlerts />',
        '  <SecureAuth />',
        '</MobileApp>'
      ],
      preview:'mobile',
      bars:[45,58,72,84,92]
    }
  ];

  function setBars(values){
    bars.innerHTML = values.map((v,i)=>
      '<i style="height:'+v+'%;animation-delay:'+(i*.14)+'s"></i>'
    ).join('');
  }

  function setPhone(type){
    const icons =
      type === 'security' ? ['✓','⌁','⚿','✓','◉','⚡'] :
      type === 'ai' ? ['AI','↗','◌','⚙','✦','↻'] :
      type === 'ui' ? ['◫','◩','◧','◨','✦','⌁'] :
      type === 'mobile' ? ['⌂','◉','✉','★','⚙','↗'] :
      ['⌘','◫','↗','☁','✓','◉'];

    phone.innerHTML = icons.map(x =>
      '<i style="display:grid;place-items:center;color:white;font-style:normal;font-size:9px">'+x+'</i>'
    ).join('');
  }

  function renderPreview(type){
    if(type === 'web'){
      preview.innerHTML =
        '<div class="preview-web">'+
          '<div class="navline"></div>'+
          '<div class="hero-block"></div>'+
          '<div class="cards"><i></i><i></i><i></i></div>'+
        '</div>';
    } else if(type === 'ui'){
      preview.innerHTML =
        '<div class="preview-ui">'+
          '<div class="ux-top"></div>'+
          '<div class="ux-grid"><i></i><i></i><i></i></div>'+
        '</div>';
    } else if(type === 'security'){
      preview.innerHTML = '<div class="preview-security"></div>';
    } else if(type === 'ai'){
      preview.innerHTML =
        '<div class="preview-ai">'+
          '<svg viewBox="0 0 300 150" aria-hidden="true">'+
            '<line x1="55" y1="78" x2="120" y2="48"/>'+
            '<line x1="138" y1="50" x2="225" y2="86"/>'+
          '</svg>'+
          '<i class="node n1"></i><i class="node n2"></i><i class="node n3"></i>'+
        '</div>';
    } else {
      preview.innerHTML = '<div class="preview-mobile"><div class="appcard"></div></div>';
    }
  }

  function typeCode(reset=false){
    clearTimeout(typingTimer);

    if(reset){
      codeIndex = 0;
      codeOutput.textContent = '';
    }

    if(isTracking) return;

    const text = services[current].code.join('\n');

    if(codeIndex >= text.length){
      typingTimer = setTimeout(() => typeCode(true), 900);
      return;
    }

    codeOutput.textContent += text.charAt(codeIndex++);
    typingTimer = setTimeout(typeCode, 22 + Math.random()*38);
  }

  function activateService(index){
    current = index % services.length;
    const s = services[current];

    scene.classList.add('switching');
    setTimeout(() => scene.classList.remove('switching'), 470);

    serviceName.textContent = s.name;
    label.textContent = s.short;
    metricLabel.textContent = s.metric;
    metricValue.textContent = s.value;

    if(!isTracking){
      robotStatus.textContent = 'Robot is building';
    }

    setBars(s.bars);
    renderPreview(s.preview);
    setPhone(s.preview);
    typeCode(true);
  }

  function beginTracking(clientX, clientY){
    const r = scene.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, ((clientX-r.left)/r.width-.5)*2));
    const ny = Math.max(-1, Math.min(1, ((clientY-r.top)/r.height-.5)*2));

    document.documentElement.style.setProperty('--mx', (nx*7).toFixed(2)+'px');
    document.documentElement.style.setProperty('--my', (ny*7).toFixed(2)+'px');

    head.style.transform =
      'translate('+(nx*9).toFixed(1)+'px,'+(ny*5).toFixed(1)+'px) rotate('+(nx*3.2).toFixed(1)+'deg)';

    face.style.transform =
      'translate('+(nx*11).toFixed(1)+'px,'+(ny*6).toFixed(1)+'px)';

    pupils.forEach(p => {
      p.style.transform =
        'translate('+(nx*10).toFixed(1)+'px,'+(ny*6).toFixed(1)+'px)';
    });

    if(!isTracking){
      isTracking = true;
      robot.classList.remove('typing');
      robot.classList.add('tracking');
      robotStatus.textContent = 'Watching your cursor';
      clearTimeout(typingTimer);
    }

    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(stopTracking, 700);
  }

  function stopTracking(){
    if(!isTracking) return;

    isTracking = false;
    robot.classList.remove('tracking');
    robot.classList.add('typing');
    robotStatus.textContent = 'Robot is building';

    head.style.transform = '';
    face.style.transform = '';
    pupils.forEach(p => p.style.transform = '');

    document.documentElement.style.setProperty('--mx','0px');
    document.documentElement.style.setProperty('--my','0px');

    typeCode();
  }

  function initNetwork(){
    const svgNS = 'http://www.w3.org/2000/svg';
    const motions = [
      'path("M38 270 C135 94,286 112,350 196 S590 170,831 62")',
      'path("M13 522 C180 641,344 560,427 475 S691 407,877 554")',
      'path("M259 61 C385 -9,534 22,602 104 S735 264,886 203")',
      'path("M106 448 C257 365,404 403,486 331 S689 286,834 321")'
    ];

    const g = document.querySelector('.nodes');

    motions.forEach((motion,i) => {
      const c = document.createElementNS(svgNS,'circle');
      c.setAttribute('r', i === 1 ? 6 : 5);
      c.setAttribute('class','pulse-dot p'+(i+1));
      c.style.offsetPath = motion;
      c.style.offsetRotate = '0deg';
      g.appendChild(c);
    });
  }

  scene.addEventListener('mousemove', e => beginTracking(e.clientX,e.clientY));
  scene.addEventListener('mouseleave', () => {
    clearTimeout(cursorTimer);
    stopTracking();
  });

  scene.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if(t) beginTracking(t.clientX,t.clientY);
  }, {passive:true});

  initNetwork();
  activateService(0);
  setInterval(() => activateService(current+1), 4000);
})();