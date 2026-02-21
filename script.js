const config = {
  celebrant: "Сүйікті Өмірзақ атамыздың",
  inviteLine: "Ағайын-туыс, бауырлар!",
  host: "Өмірзақ Әулеті",
  age: 80,


  eventISO: "2026-03-13T18:45:00+05:00",

  eventDateText: "2026 • 13 Наурыз",
  eventTimeText: "13 наурыз ауыз ашар уақыты",
  placeShort: "Банкет залы «Меруерт»",
  address: "Қызылорда қ., Ахмет Байтурсынұлы к-сі, 114 — банкет залы «Меруерт»",

  contactName: "Өмірзақ Әулеті",
  contactPhone: "+77076060046",
  mapsUrl: "https://www.google.com/maps/place/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD+%C2%AB%D0%9C%D0%B5%D1%80%D1%83%D0%B5%D1%80%D1%82%C2%BB/@44.8326597,65.5050802,17z/data=!3m1!4b1!4m6!3m5!1s0x41f7fde3022f378d:0xaa299154b7aeb758!8m2!3d44.8326598!4d65.5099511!16s%2Fg%2F11bxfx6_12?entry=tts&g_ep=EgoyMDI2MDIxOC4wIPu8ASoASAFQAw%3D%3D&skid=9305a6b9-3635-4bc2-ad66-6dd6a14d6976",


  mapEmbedUrl: "https://maps.google.com/maps?q=44.8326597,65.5050802&z=16&output=embed",

  whatsappNumber: "77076060046",

  audioSrc: "assets/audio/audio.mp3",
  audioTitle: "Әуен",
  audioEnabled: true,


  quote: "«Қариясы бар үйдің – қазынасы бар.»",

  effectsOn: true,
};

const $ = (sel) => document.querySelector(sel);

function setText(id, value){
  const el = $(id);
  if (el) el.textContent = value;
}

function applyConfig(){
  setText("#celebrantName", config.celebrant);
  setText("#inviteLine", config.inviteLine);
  setText("#ageNumber", String(config.age));
  setText("#eventDateText", config.eventDateText);
  setText("#eventTimeText", config.eventTimeText);
  setText("#eventPlaceShort", config.placeShort);
  setText("#eventAddress", config.address);
  setText("#contactName", config.contactName);
setText("#hostName", config.host);
  setText("#hostNameFooter", config.host);

  const phoneEl = $("#contactPhone");
  if (phoneEl){
    phoneEl.textContent = prettyPhone(config.contactPhone);
    phoneEl.href = `tel:${config.contactPhone}`;
  }

  const mapEl = $("#openMap");
  if (mapEl) mapEl.href = config.mapsUrl;

  const mapFrame = $("#mapFrame");
  if (mapFrame) mapFrame.src = config.mapEmbedUrl;

  $("#year").textContent = String(new Date().getFullYear());
}

function prettyPhone(raw){
  const s = String(raw).replace(/\s+/g, "");
  if (!s.startsWith("+7") || s.length !== 12) return raw;
  const a = s.slice(2,5), b = s.slice(5,8), c = s.slice(8,10), d = s.slice(10,12);
  return `+7 (${a}) ${b}-${c}-${d}`;
}

function pad2(n){ return String(n).padStart(2,"0"); }

function updateCountdown(){
  const target = new Date(config.eventISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const d = Math.floor(diff / (1000*60*60*24));
  diff -= d * (1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60));
  diff -= h * (1000*60*60);
  const m = Math.floor(diff / (1000*60));
  diff -= m * (1000*60);
  const s = Math.floor(diff / 1000);

  setText("#d", pad2(d));
  setText("#h", pad2(h));
  setText("#m", pad2(m));
  setText("#s", pad2(s));
}

function enableSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", (e)=>{
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
      history.replaceState(null, "", href);
    });
  });
}

function revealOnScroll(){
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if (ent.isIntersecting){
        ent.target.classList.add("show");
        io.unobserve(ent.target);
      }
    });
  }, {threshold: 0.14});
  els.forEach(el=>io.observe(el));
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("Көшірілді ✅");
  }catch{
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Көшірілді ✅");
  }
}

function toast(msg){
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add("show"));
  setTimeout(()=>{
    t.classList.remove("show");
    setTimeout(()=> t.remove(), 250);
  }, 1500);
}

function wireButtons(){
  const copy = ()=> copyText(window.location.href);

  $("#copyLink")?.addEventListener("click", copy);
  $("#copyLink2")?.addEventListener("click", copy);

  $("#copyAddress")?.addEventListener("click", ()=>{
    copyText(config.address);
  });

  $("#shareBtn")?.addEventListener("click", async ()=>{
    const data = {
      title: "Қазақи шақырту",
      text: `${config.celebrant} — ${config.age} жас мерейтойына шақырту`,
      url: window.location.href,
    };
    if (navigator.share){
      try{ await navigator.share(data); }
      catch{ /* ignore */ }
    } else {
      copy();
    }
  });

  $("#toggleFx")?.addEventListener("click", (e)=>{
    config.effectsOn = !config.effectsOn;
    e.currentTarget.setAttribute("aria-pressed", String(config.effectsOn));
    e.currentTarget.textContent = config.effectsOn ? "✨" : "💤";
    if (!config.effectsOn) confetti.stop();
    else confetti.start();
  });
  $("#rsvpForm")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") || "").toString().trim();
    const guests = (fd.get("guests") || "").toString();
    const note = (fd.get("note") || "").toString().trim();

    const msg =
`Ассалаумағалейкүм! Қатысуды растаймын ✅%0A
Аты-жөнім: ${encodeURIComponent(name)}%0A
Қонақ саны: ${encodeURIComponent(guests)}%0A
Ескертпе: ${encodeURIComponent(note || "-")}%0A%0A
Шақырту сілтемесі: ${encodeURIComponent(window.location.href)}`;

    const wa = `https://wa.me/${config.whatsappNumber}?text=${msg}`;
    window.open(wa, "_blank", "noopener");
  });
}

/* =======================
   Confetti canvas (subtle, ethnо palette)
   ======================= */
const confetti = (() => {
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  let w=0, h=0, raf=0, running=false;
  let pieces = [];

  function resize(){
    w = canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
    h = canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  function rnd(min,max){ return Math.random()*(max-min)+min; }

  function spawn(n=70){
    const colors = [
      "rgba(212,160,23,.65)", // gold
      "rgba(140,27,27,.55)",  // red
      "rgba(15,76,92,.45)",   // teal
    ];
    pieces = Array.from({length:n}, ()=>({
      x: rnd(0,w),
      y: rnd(-h, 0),
      s: rnd(6,11)*devicePixelRatio,
      vx: rnd(-.25,.25)*devicePixelRatio,
      vy: rnd(1.0, 2.1)*devicePixelRatio,
      a: rnd(0, Math.PI*2),
      va: rnd(-.08,.08),
      c: colors[Math.floor(rnd(0, colors.length))]
    }));
  }

  function drawDiamond(p){
    const s = p.s;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s, 0);
    ctx.closePath();
    ctx.fillStyle = p.c;
    ctx.fill();
  }

  function tick(){
    if (!running) return;
    ctx.clearRect(0,0,w,h);
    for (const p of pieces){
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;

      if (p.y > h + 40*devicePixelRatio){
        p.y = rnd(-160*devicePixelRatio, -10*devicePixelRatio);
        p.x = rnd(0,w);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      drawDiamond(p);
      ctx.restore();
    }
    raf = requestAnimationFrame(tick);
  }

  function start(){
    if (running) return;
    running = true;
    resize();
    spawn(70);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function stop(){
    running = false;
    cancelAnimationFrame(raf);
    ctx.clearRect(0,0,w,h);
  }

  window.addEventListener("resize", ()=> {
    if (!running) return;
    resize();
    spawn(70);
  });

  return { start, stop };
})();

/* Toast styles injected */
(function injectToastCSS(){
  const css = `
  .toast{
    position:fixed;
    left:50%;
    bottom:24px;
    transform: translate(-50%, 12px);
    opacity:0;
    z-index:20;
    padding:10px 14px;
    border-radius: 14px;
    background: rgba(246,239,227,.92);
    border:1px solid rgba(140,27,27,.18);
    backdrop-filter: blur(10px);
    box-shadow: 0 18px 50px rgba(43,26,18,.18);
    color: rgba(43,26,18,.92);
    font-weight:800;
    transition: opacity .22s ease, transform .22s ease;
  }
  .toast.show{ opacity:1; transform: translate(-50%, 0); }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();

/* Init */
applyConfig();
initAudio();
enableSmoothAnchors();
revealOnScroll();
updateCountdown();
setInterval(updateCountdown, 1000);
wireButtons();

if (config.effectsOn) confetti.start();

function initAudio(){
  const btn = $("#toggleAudio");
  const audio = $("#bgAudio");
  if (!btn || !audio || !config.audioEnabled) {
    if (btn) btn.style.display = "none";
    return;
  }

  // Browsers often block autoplay; we only play after user click.
  let isOn = false;
  btn.setAttribute("aria-pressed", "false");
  btn.textContent = "🎵";

  const setState = (on) => {
    isOn = on;
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? "🔊" : "🎵";
  };

  btn.addEventListener("click", async ()=>{
    try{
      if (!isOn){
        // iOS/Safari autoplay-ды бұғаттайды — тек осы click ішінде play() жұмыс істейді.
        // Егер сіз mp3 емес m4a/mp4 қолдансаңыз да, HTML ішіндегі <source> арқылы fallback бар.
        if (config.audioSrc) audio.src = config.audioSrc;
        audio.loop = true;
        audio.volume = 0.35;
        await audio.play();
        setState(true);
        toast("Әуен қосылды");
      } else {
        audio.pause();
        setState(false);
        toast("Әуен өшірілді");
      }
    } catch (err){
      toast("Әуен қосылмады.");
      console.warn(err);
      setState(false);
    }
  });
}


