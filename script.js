const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let entries = [];
let startAngle = 0;
let spinning = false;

const colors = ["#ff3b3b","#ffd400","#00c853","#2979ff","#ff9100","#00bcd4"];

function drawWheel() {
  if(entries.length === 0) return;

  const size = Math.min(window.innerWidth*0.9, 500);
  canvas.width = size;
  canvas.height = size;
  const radius = size / 2;
  const arc = (2 * Math.PI) / entries.length;

  ctx.clearRect(0,0,size,size);

  entries.forEach((entry,i)=>{
    const angle = startAngle + i*arc;

    // Slice
    ctx.beginPath();
    ctx.moveTo(radius,radius);
    ctx.arc(radius,radius,radius,angle,angle+arc);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    // Text
    ctx.save();
    ctx.translate(radius,radius);
    ctx.rotate(angle + arc/2);
    ctx.fillStyle = "white";
    ctx.font = `${Math.max(12,radius/12)}px Fredoka`;
    ctx.textAlign = "right";
    ctx.fillText(entry, radius - 15, 0);
    ctx.restore();
  });
}

function spin() {
  if(spinning || entries.length === 0) return;
  spinning = true;

  let spinAngle = Math.random()*3000 + 3000;
  let duration = 4500;
  let start = null;

  function animate(timestamp){
    if(!start) start = timestamp;
    let progress = timestamp - start;
    let ease = spinAngle * (1 - Math.pow(1 - progress/duration,3));
    startAngle = ease * Math.PI/180;
    drawWheel();
    if(progress < duration) requestAnimationFrame(animate);
    else finishSpin();
  }

  requestAnimationFrame(animate);
}

function finishSpin() {
  const arc = (2*Math.PI)/entries.length;
  const degrees = startAngle * 180/Math.PI + 90;
  const arcd = arc * 180/Math.PI;
  const index = Math.floor(((360 - (degrees % 360)) % 360) / arcd);
  const winner = entries[index];
  document.getElementById("result").innerHTML = `🎉 Winner: ${winner} 🎉`;
  launchConfetti();
  spinning = false;
}

function launchConfetti() {
  for(let i=0;i<80;i++){
    let c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.left = Math.random()*100+"%";
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDelay = Math.random()+"s";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3000);
  }
}