const WEDDING_DATE = "2026-11-11T21:00:00+05:30";

const opening = document.getElementById("opening");
const site = document.getElementById("site");
const openBtn = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");
document.body.classList.add("locked");

let musicWanted = false;
let musicStarted = false;

function setMusicIcon() {
  musicButton.textContent = music.paused ? "♪" : "♫";
  musicButton.setAttribute("aria-label", music.paused ? "Play music" : "Pause music");
}

async function tryStartMusic() {
  musicWanted = true;
  try {
    music.volume = 0.72;
    const promise = music.play();
    if (promise && typeof promise.then === "function") await promise;
    musicStarted = true;
    setMusicIcon();
    return true;
  } catch (err) {
    musicStarted = false;
    setMusicIcon();
    return false;
  }
}

openBtn.addEventListener("click", async () => {
  opening.classList.add("closed");
  site.classList.add("visible");
  site.setAttribute("aria-hidden","false");
  document.body.classList.remove("locked");

  // This click is a direct user gesture, so Android/Chrome normally permits playback here.
  const started = await tryStartMusic();

  // If playback was blocked, make the music control visibly available.
  musicButton.classList.toggle("needs-tap", !started);

  setTimeout(()=>document.getElementById("scratch").scrollIntoView({behavior:"smooth"}),3000);
});

musicButton.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (music.paused) {
    const started = await tryStartMusic();
    musicButton.classList.toggle("needs-tap", !started);
  } else {
    musicWanted = false;
    music.pause();
    setMusicIcon();
    musicButton.classList.remove("needs-tap");
  }
});

// If autoplay was blocked on the first attempt, use the next deliberate interaction
// anywhere on the invitation as another chance to start it.
document.addEventListener("pointerdown", async (e) => {
  if (!site.classList.contains("visible")) return;
  if (e.target.closest("#musicButton")) return;
  if (musicWanted && music.paused) {
    const started = await tryStartMusic();
    musicButton.classList.toggle("needs-tap", !started);
  }
}, {passive:true});

music.addEventListener("play", setMusicIcon);
music.addEventListener("pause", setMusicIcon);
music.addEventListener("error", () => {
  musicButton.classList.add("needs-tap");
  setMusicIcon();
});

document.querySelectorAll(".scroll-button").forEach(b=>{
  b.addEventListener("click",()=>document.getElementById(b.dataset.target).scrollIntoView({behavior:"smooth"}));
});

// Countdown
function updateCountdown(){
  const diff=Math.max(0,new Date(WEDDING_DATE).getTime()-Date.now());
  const values=[
    Math.floor(diff/86400000),
    Math.floor(diff/3600000)%24,
    Math.floor(diff/60000)%60,
    Math.floor(diff/1000)%60
  ];
  ["days","hours","minutes","seconds"].forEach((id,i)=>{
    document.getElementById(id).textContent=String(values[i]).padStart(2,"0");
  });
}
updateCountdown(); setInterval(updateCountdown,1000);

// Scratch card
const canvas=document.getElementById("scratchCanvas");
const ctx=canvas.getContext("2d");
let drawing=false;
let strokes=0;

function setupScratch(){
  const r=canvas.getBoundingClientRect();
  const d=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(r.width*d);
  canvas.height=Math.round(r.height*d);
  ctx.setTransform(d,0,0,d,0,0);

  const g=ctx.createLinearGradient(0,0,r.width,r.height);
  g.addColorStop(0,"#a9894a");
  g.addColorStop(.45,"#ead39a");
  g.addColorStop(1,"#8f7038");
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle=g;
  ctx.fillRect(0,0,r.width,r.height);

  ctx.fillStyle="rgba(28,45,37,.32)";
  ctx.textAlign="center";
  ctx.font="600 17px Cormorant Garamond,serif";
  ctx.fillText("✦  SCRATCH TO DISCOVER  ✦",r.width/2,r.height/2);

  // subtle foil speckles
  for(let i=0;i<220;i++){
    const x=Math.random()*r.width,y=Math.random()*r.height;
    ctx.fillStyle="rgba(255,255,255,.13)";
    ctx.fillRect(x,y,Math.random()*2+0.3,Math.random()*2+0.3);
  }
  ctx.globalCompositeOperation="destination-out";
  canvas.style.opacity="1";
  strokes=0;
}
function scratch(e){
  if(!drawing)return;
  e.preventDefault();
  const r=canvas.getBoundingClientRect();
  ctx.globalCompositeOperation="destination-out";
  ctx.beginPath();
  ctx.arc(e.clientX-r.left,e.clientY-r.top,24,0,Math.PI*2);
  ctx.fill();
  strokes++;
  if(strokes%10===0) checkScratch();
}
function checkScratch(){
  const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let transparent=0;
  for(let i=3;i<data.length;i+=16) if(data[i]<40) transparent++;
  if(transparent/(data.length/16)>.58){
    canvas.style.opacity="0";
    canvas.style.pointerEvents="none";
  }
}
canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratch(e)});
canvas.addEventListener("pointermove",scratch);
canvas.addEventListener("pointerup",()=>drawing=false);
canvas.addEventListener("pointercancel",()=>drawing=false);
document.getElementById("resetScratch").addEventListener("click",()=>{
  canvas.style.pointerEvents="auto";setupScratch();
});
window.addEventListener("resize",setupScratch);
setupScratch();

// Reveal sections as user scrolls
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("show")});
},{threshold:.16});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
