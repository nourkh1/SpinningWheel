const canvas = document.getElementById("wheel")
const ctx = canvas.getContext("2d")

let entries = []
let startAngle = 0
let spinning = false

const colors = [
"#ff3b3b",
"#ffd400",
"#00c853",
"#2979ff",
"#ff9100",
"#00bcd4"
]

function generateWheel(){

entries = document
.getElementById("entries")
.value
.split("\n")
.filter(x => x.trim() != "")

localStorage.setItem("toysWheel", JSON.stringify(entries))

drawWheel()

}

function drawWheel(){

ctx.clearRect(0,0,500,500)

if(entries.length === 0) return

let arc = (Math.PI*2) / entries.length

entries.forEach((entry,i)=>{

let angle = startAngle + i*arc

ctx.beginPath()
ctx.moveTo(250,250)
ctx.arc(250,250,250,angle,angle+arc)
ctx.fillStyle = colors[i % colors.length]
ctx.fill()

ctx.save()

ctx.translate(250,250)
ctx.rotate(angle + arc/2)

ctx.fillStyle = "white"
ctx.font = "18px Fredoka"
ctx.textAlign = "right"

ctx.fillText(entry,230,10)

ctx.restore()

})

}

function spin(){

if(spinning || entries.length === 0) return

spinning = true

let spinAngle = Math.random()*3000 + 3000
let duration = 4500

let start = null

function animate(timestamp){

if(!start) start = timestamp

let progress = timestamp - start

let ease = spinAngle * (1 - Math.pow(1-progress/duration,3))

startAngle = ease * Math.PI/180

drawWheel()

if(progress < duration){

requestAnimationFrame(animate)

}else{

finishSpin()

}

}

requestAnimationFrame(animate)

}

function finishSpin(){

let arc = (2*Math.PI) / entries.length

// convert to degrees
let degrees = startAngle * 180 / Math.PI + 90

let arcd = arc * 180 / Math.PI

// find winning index
let index = Math.floor((360 - (degrees % 360)) / arcd)

let winner = entries[index]

document.getElementById("result").innerHTML =
"🎉 Winner: " + winner + " 🎉"

launchConfetti()

spinning = false

}

function shuffleEntries(){

entries.sort(()=>Math.random()-0.5)

document.getElementById("entries").value = entries.join("\n")

drawWheel()

}

function resetWheel(){

entries = []

document.getElementById("entries").value = ""

ctx.clearRect(0,0,500,500)

document.getElementById("result").innerText = ""

localStorage.removeItem("toysWheel")

}

function launchConfetti(){

for(let i=0;i<80;i++){

let c = document.createElement("div")

c.className = "confetti-piece"

c.style.left = Math.random()*100+"%"

c.style.background =
colors[Math.floor(Math.random()*colors.length)]

c.style.animationDelay = Math.random()+"s"

document.body.appendChild(c)

setTimeout(()=>c.remove(),3000)

}

}

window.onload = function(){

let saved = localStorage.getItem("toysWheel")

if(saved){

entries = JSON.parse(saved)

document.getElementById("entries").value = entries.join("\n")

drawWheel()

}

}