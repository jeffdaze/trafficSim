function createCanvas(){
  let canvasCreate = document.createElement("canvas");
  canvasCreate.style.position = "absolute";
  canvasCreate.style.left     = "0px";
  canvasCreate.style.top      = "0px";
  canvasCreate.style.zIndex   = 1;
  document.body.appendChild(canvasCreate);
  return canvasCreate;
}

function sizeCanvas(canvas){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function gameloop(canvas){

  //init some game stuff here...
  let cars = new Array();
  const carCount = 20;

  //make some cars...
  for(let i=0;i<carCount;i++){
    cars.push(buildCar(randInt(0, 800), i*50, randInt(4, 10), randInt(120, 255), randInt(120, 255), randInt(120, 255)));
  }

  function update(){

      render(canvas, cars)
      requestAnimationFrame(update);
  }
  //kick off the game loop...
  requestAnimationFrame(update);

}

function render(canvas, cars){
  let ctx = canvas.getContext('2d');

  //clear...
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  for(let i=0;i<cars.length;i++){

    //move our cars...
    cars[i].x += cars[i].speed;
    if(cars[i].x > parseInt(canvas.width)){
      cars[i].x = 0;
    }

    //render the car...
    ctx.fillStyle = cars[i].color;
    ctx.fillRect(cars[i].x, cars[i].y, 60, 30);

  }

  //play some music?
  //if(this.tick === undefined){
  //  this.tick = 0;
  //}

  /*
  if(randInt(1, 192) > 190){
    let noteval = randInt(5, 30);
    if(noteval%2){
      //playNote(noteval, 'sawtooth', randInt(5, 20));
      playNote(noteval, 'sine', randInt(5, 20));
      //playNote(noteval, 'triangle', randInt(5, 20));
      //playNote(noteval, 'square', randInt(5, 20));
    }
  }
  */


}

//trash model here...
function buildCar(x, y, speed, r, g, b){
  return{
    x: x,
    y: y,
    speed: speed,
    color: `rgb(${r}, ${g}, ${b})`
  }
}

//music stuff?

//type is one of:
//
//  sine
//  square
//  triangle
//  sawtooth
//

function playNote(frequency, type, sustain) {

  //main audio context...
  if(this.context === undefined){
    this.context = new AudioContext();
  }

  o = this.context.createOscillator();
  g = this.context.createGain();
  o.type = type;
  o.connect(g);
  o.frequency.value = 988/1.06**frequency;

  //may not need this with the analyzer connected...
  g.connect(context.destination);
  o.start(0);
  //this eliminates the annoying 'click' when playing a note...
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + sustain);
}



function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function init(){

  let canvas = createCanvas();

  window.addEventListener("resize", function(){ sizeCanvas(canvas) });
  //initially make the canvas the size of the whole window space...
  sizeCanvas(canvas);

  gameloop(canvas);

}

init();
