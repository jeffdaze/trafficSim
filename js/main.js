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

//game globals... need maybe can find a better way to do this...
let lightTick = 0;


function gameloop(canvas){

  //init some game stuff here...
  let cars = new Array();
  const carCount = 20;

  let lights = new Array();
  const yOffset = 100;
  const laneNum = 5;

  const dispositionStates = [
    "timid",
    "normal",
    "aggressive"
  ]

  //make some cars...
  for(let i=0;i<carCount;i++){
    cars.push(
      buildCar(
        randInt(20, 40), // width
        randInt(10, 12), // height
        randInt(0, 800), // starting x
        ((i % laneNum )*15) + yOffset, // starting y
        randInt(4, 10), // speed
        dispositionStates[Math.floor(Math.random() * dispositionStates.length)], //disposition
        'accellerate', //state
        randInt(120, 255), // R
        randInt(120, 255), // G
        randInt(120, 255)  // B
      )
    );
  }

  //make some lights...
  for(let i=0;i<laneNum;i++){
    lights.push(
      buildLight(
        8,
        8,
        700,
        (i*15) + yOffset,
        "green"
      )
    )
  }

  //kick off the actual loop...
  function update(){
      render(canvas, cars, lights, lightTick)
      requestAnimationFrame(update);
  }
  //kick off the game loop...
  requestAnimationFrame(update);

}

function render(canvas, cars, lights){
  let ctx = canvas.getContext('2d');

  //clear...
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lightTick++;

  //handle lights...
  for (let i=0;i<lights.length;i++){

    if(lightTick > 2500){
      lightTick = 0;
    }
    if(lightTick <= 1500){
      lights[i].color = 'green';
    }
    if(lightTick > 1500 && lightTick <= 1700){
      lights[i].color = 'yellow';
    }
    if(lightTick >= 1700){
      lights[i].color = 'red'
    }


    //render the lights...
    ctx.shadowBlur = 10;
    //ctx.shadowColor = lights[i].color;
    ctx.shadowColor = "white";

    ctx.fillStyle = lights[i].color;
    ctx.fillRect(lights[i].x, lights[i].y, lights[i].w, lights[i].h,);
  }

  //handle cars...
  for(let i=0;i<cars.length;i++){

    //move our cars from left to right...
    // need to add stopping factor here; maybe isolate this separately...

    //regular speed;
    // higher than 1 is accellerating
    // lower than 1 is decellerating (braking)
    let accel = 1;
    //detect light state...
    //broadphase
    if(broadphase(cars[i].x, cars[i].y)){
      if(lights[0].color == 'yellow'){
        //handle different driver dispositions for yellow lights...
        if(cars[i].disposition == "normal"){
          accel = 0.1;
        }

        if(cars[i].disposition == "timid"){
          accel = 0.01;
        }

        if(cars[i].disposition == "aggressive"){
          accel = 1.1;
        }

      }
      if(lights[0].color == 'red'){
        accel = 0.001;
      }
    }

    cars[i].x += cars[i].speed * accel;

    //test wrapping...
    if(cars[i].x > parseInt(canvas.width || cars[i].x < 0)){
      cars[i].x = 0;
    }

    //render the car...
    ctx.shadowBlur = 0;
    //ctx.shadowColor = car[i].color;
    ctx.fillStyle = cars[i].color;
    ctx.fillRect(cars[i].x, cars[i].y, cars[i].w, cars[i].h,);

  }


}

//broadphase car location detection...
// returns bool
function broadphase(carX, carY){
  //compare this car x/y to the approximate location of sets of lights...
  //this is super specific to this initial state; might need something to set up all the
  //possible broadphase 'cells' when lights are created
  if(carX > 600 && carX < 710){
    return true;
  }
  return false;
}

//trash model here...
function buildCar(w, h, x, y, speed, disposition, state, r, g, b){
  return{
    w: w,
    h: h,
    x: x,
    y: y,
    speed: speed,
    disposition: disposition, // one of: 'timid', 'normal', 'aggressive'
    state: state, // one of: 'drive', 'accellerate', 'brake'
    color: `rgb(${r}, ${g}, ${b})`
  }
}

function buildLight(w, h, x, y, color){
  return{
    w: w,
    h: h,
    x: x,
    y: y,
    color: color // one of "red", "yellow", "green"
  }
}

//music stuff?
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

// end of music stuff; may run in a separate loop for better control...
// might even use a whole other lib if I want to do proper pads / synths etc...


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
