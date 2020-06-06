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

  //let startTime;

  function update(time){
    /*
    if(startTime === undefined){    // get a reference for the start time if this is the first frame
      startTime = time;
    }
    */
      render(canvas)
      requestAnimationFrame(update);
  }
  //kick off the game loop...
  requestAnimationFrame(update);

}

function render(canvas){
  let ctx = canvas.getContext('2d');

  let renderSpeed = 8;

  //clear...
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //calculate position...
  //inti x pos...
  if(this.x === undefined){
    this.x = 0;
  }

  this.x+=renderSpeed;

  if(this.x > parseInt(canvas.width)){
    this.x = 0;
  }

  //render a block...
  ctx.fillStyle = 'green';
  ctx.fillRect(this.x, 10, 60, 30);

}

function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function init(){

  let canvas = createCanvas();

  window.addEventListener("resize", function(canvas){ sizeCanvas(canvas) });
  //initially make the canvas the size of the whole window space...
  sizeCanvas(canvas);

  gameloop(canvas);

}

init();
