(function(){
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  // ticker
  var items=["Ransomware sequestra empresas a cada 11 segundos","81% das invasões começam com senha fraca ou roubada","Phishing continua sendo a porta de entrada nº 1","Atualização pendente é convite aberto","Dupla verificação bloqueia a maioria dos ataques automatizados","Quem vigia dorme tranquilo"];
  var h=items.map(function(t){return "<span>"+t+"</span>"}).join("");
  document.getElementById("tk").innerHTML=h+h;
  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll(".rv").forEach(function(el,i){el.style.transitionDelay=(i%6)*70+"ms";io.observe(el)});
  // glow + eye
  var glow=document.getElementById("glow"),pup=document.getElementById("pupilwrap");
  addEventListener("pointermove",function(e){
    glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";
    var r=document.getElementById("eye").getBoundingClientRect();
    var cx=r.left+r.width/2,cy=r.top+r.height/2;
    var dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy)||1,m=Math.min(38,d/8);
    pup.setAttribute("transform","translate("+(dx/d*m)+" "+(dy/d*m*.55)+")");
  });
  // rain
  var c=document.getElementById("rain"),x=c.getContext("2d"),cols,drops,fs=16;
  var chars="01アイウエオカキクケコ▲◆◈⌬ΣΩλ∴".split("");
  function size(){c.width=innerWidth;c.height=innerHeight;cols=Math.floor(c.width/fs);drops=Array.from({length:cols},function(){return Math.random()*c.height/fs})}
  size();addEventListener("resize",size);
  function draw(){
    x.fillStyle="rgba(5,3,8,.1)";x.fillRect(0,0,c.width,c.height);
    x.fillStyle="#9d4dff";x.font=fs+"px monospace";
    for(var i=0;i<cols;i++){
      x.fillText(chars[Math.floor(Math.random()*chars.length)],i*fs,drops[i]*fs);
      if(drops[i]*fs>c.height&&Math.random()>.975)drops[i]=0;
      drops[i]+=.6;
    }
  }
  if(!reduce)setInterval(draw,60);
  // password lab
  var pw=document.getElementById("pw"),fill=document.getElementById("fill"),v=document.getElementById("verdict");
  pw.addEventListener("input",function(){
    var s=pw.value,n=s.length;
    if(!n){fill.style.width="0";v.textContent="Aguardando entrada…";return}
    var pool=0;
    if(/[a-z]/.test(s))pool+=26;if(/[A-Z]/.test(s))pool+=26;if(/[0-9]/.test(s))pool+=10;if(/[^a-zA-Z0-9]/.test(s))pool+=32;
    var bits=n*Math.log2(pool||1);
    if(/^(.)\1+$/.test(s)||/(123456|senha|password|qwerty|abcdef)/i.test(s))bits=Math.min(bits,18);
    var pct=Math.min(100,bits/80*100),col,msg;
    if(bits<28){col="#ff3d6e";msg="Cai em segundos. O vazio nem precisou tentar."}
    else if(bits<45){col="#ff9d3d";msg="Fraca. Um ataque automatizado resolve em minutos ou horas."}
    else if(bits<64){col="#c58bff";msg="Razoável. Aumente o tamanho e misture palavras imprevisíveis."}
    else{col="#6dffb0";msg="Forte. Esse cofre aguenta a escuridão."}
    fill.style.width=pct+"%";fill.style.background=col;v.textContent=msg+" (~"+Math.round(bits)+" bits)";
  });
  // contadores
  var st=document.getElementById("stats");
  new IntersectionObserver(function(es,ob){if(!es[0].isIntersecting)return;ob.disconnect();
    st.querySelectorAll("b").forEach(function(b){var n=+b.dataset.n,d=+b.dataset.d||0,t0=performance.now();
      (function tick(t){var p=Math.min(1,(t-t0)/1600);b.textContent=(n*(1-Math.pow(1-p,3))).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g,d?"":".");if(p<1)requestAnimationFrame(tick)})(t0)})
  },{threshold:.4}).observe(st);
  // mapa de ataques
  var mc=document.getElementById("map"),mx=mc.getContext("2d"),live=document.getElementById("live"),pts=[],W=0,H=0,atk=[],blocked=0;
  var land=[[.22,.30,.12,.17],[.34,.12,.04,.07],[.30,.66,.06,.17],[.50,.26,.06,.08],[.52,.55,.08,.19],[.70,.32,.17,.15],[.66,.50,.03,.07],[.82,.72,.06,.07]];
  function mapSize(){var r=mc.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=r.height;mc.width=W*d;mc.height=H*d;mx.setTransform(d,0,0,d,0,0);pts=[];
    var g=Math.max(8,Math.round(W/90));
    for(var y=g/2;y<H;y+=g)for(var x=g/2;x<W;x+=g){var u=x/W,v=y/H;for(var i=0;i<land.length;i++){var e=land[i],dx=(u-e[0])/e[2],dy=(v-e[1])/e[3];if(dx*dx+dy*dy<1){pts.push([x,y]);break}}}
    drawDots()}
  function drawDots(){mx.clearRect(0,0,W,H);mx.fillStyle="rgba(157,77,255,.4)";pts.forEach(function(p){mx.fillRect(p[0]-1,p[1]-1,2,2)})}
  function spawn(){if(pts.length)atk.push({a:pts[Math.random()*pts.length|0],b:pts[Math.random()*pts.length|0],t:0})}
  function mframe(){drawDots();
    atk=atk.filter(function(k){k.t+=.012;var t=Math.min(k.t,1),cx=(k.a[0]+k.b[0])/2,cy=Math.min(k.a[1],k.b[1])-60;
      mx.strokeStyle="rgba(197,139,255,"+Math.max(.2,1-k.t*.6)+")";mx.lineWidth=1.2;mx.beginPath();mx.moveTo(k.a[0],k.a[1]);
      for(var s=1;s<=20;s++){var u=t*s/20;mx.lineTo((1-u)*(1-u)*k.a[0]+2*(1-u)*u*cx+u*u*k.b[0],(1-u)*(1-u)*k.a[1]+2*(1-u)*u*cy+u*u*k.b[1])}
      mx.stroke();
      if(k.t>=1){mx.strokeStyle="rgba(109,255,176,"+Math.max(0,1-(k.t-1)*3)+")";mx.beginPath();mx.arc(k.b[0],k.b[1],(k.t-1)*70,0,6.28);mx.stroke();
        if(!k.done){k.done=1;blocked++;live.textContent="● ao vivo · simulação · bloqueados: "+blocked}}
      return k.t<1.35});
    requestAnimationFrame(mframe)}
  mapSize();addEventListener("resize",mapSize);
  if(!reduce){setInterval(spawn,650);mframe()}
  // terminal
  var tout=document.getElementById("tout"),tin=document.getElementById("tin");
  function pr(t){tout.textContent+=t+"\n";tout.scrollTop=tout.scrollHeight}
  pr("VOIDLOCK OS v1.0. Digite “ajuda” para começar.\n");
  var cmds={
    ajuda:function(){pr("comandos: scan · produtos · sobre · senha · vazio · limpar")},
    produtos:function(){pr("chaves FIDO2 · pentest · vigília 24/7 · cofre de senhas · anti-phishing · VPN")},
    sobre:function(){pr("VOIDLOCK: a loja que tranca o seu mundo digital. Segurança não é brincadeira.")},
    senha:function(){pr("regra de ouro: longa, única e com verificação em duas etapas.")},
    vazio:function(){pr("o vazio olha de volta.")},
    limpar:function(){tout.textContent=""},
    scan:function(){var L=["iniciando varredura…","[+] portas abertas: 0 (suspeito, ninguém é tão limpo)","[+] firewall: ativo","[!] 1 humano clicando em link duvidoso detectado","varredura concluída. fale com a gente."];L.forEach(function(l,i){setTimeout(function(){pr(l)},i*600)})},
    sudo:function(){pr("nice try. este incidente foi reportado ao vazio.")}
  };
  tin.addEventListener("keydown",function(e){if(e.key!=="Enter")return;var c=tin.value.trim().toLowerCase();tin.value="";if(!c)return;pr("$ "+c);
    var f=cmds[c.split(" ")[0]];f?f():pr("comando não encontrado. tente “ajuda”.")});
  // quiz
  var Q=[
    {f:"seguranca@bancc0.com",m:"URGENTE: sua conta será bloqueada em 2 horas. Clique aqui para confirmar seus dados.",a:1,e:"Pressa + domínio com zero no lugar do “o”. Phishing clássico."},
    {f:"BANCO",m:"Seu código de login é 482913. Se não foi você, ignore e troque sua senha. Nunca compartilhe este código.",a:0,e:"Sem link e sem pressa, e manda você agir pelo app oficial. Tudo certo."},
    {f:"+55 61 9xxxx-xxxx (“Seu chefe”)",m:"Oi, estou em reunião. Preciso que compre 5 cartões-presente agora e me mande os códigos. Depois eu te reembolso.",a:1,e:"Golpe do falso chefe: urgência, sigilo e pedido de códigos. Confirme por outro canal."},
    {f:"Correios-Rastreio",m:"Sua encomenda está retida. Pague a taxa de R$ 4,90 neste link para liberar a entrega.",a:1,e:"Taxa por link é o golpe da encomenda falsa. Consulte o rastreio no site oficial."}
  ],qi=0,score=0,qm=document.getElementById("qmsg"),qb=document.getElementById("qbtns"),qf=document.getElementById("qfb");
  function showQ(){var q=Q[qi];qm.innerHTML="<small>De: "+q.f+" · mensagem "+(qi+1)+"/"+Q.length+"</small>"+q.m;qf.textContent="";qb.style.display="flex"}
  qb.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var q=Q[qi],ok=+b.dataset.a===q.a;if(ok)score++;
    qb.style.display="none";qf.innerHTML=(ok?"✔ Acertou. ":"✖ Caiu. ")+q.e+" <br><br><button class=\"btn fill\" id=\"qn\">"+(qi<Q.length-1?"Próxima":"Ver resultado")+"</button>";
    document.getElementById("qn").onclick=function(){qi++;if(qi<Q.length)return showQ();
      qm.innerHTML="Resultado: "+score+" de "+Q.length+". "+(score===Q.length?"Você é um firewall humano.":score>=2?"Quase lá. O golpista conta com o seu descuido.":"Cuidado: você seria um alvo fácil.");qf.innerHTML="<button class=\"btn\" id=\"qr\">Tentar de novo</button>";
      document.getElementById("qr").onclick=function(){qi=0;score=0;showQ()}}});
  showQ();
})();
