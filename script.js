var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//----------------------------SLIDER-------------------------------
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
//DA ERRO QUANDO DESCOMENTA AQUI
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
//slider.oninput = function() {
//    output.innerHTML = this.value;
//}
//-----------------------------------------------------------------

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

function drawPoints(){
  //desenha todos os pontos
  for (var i in points){
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    //ligando os pontos
    if(i > 0){
      var xAtual = points[i-1].x;
      var yAtual = points[i-1].y;
      ctx.moveTo(xAtual, yAtual);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
    
      
    var t = 0.5;
    for(c = 0; c < contadorPontos; c++){
        if(c < points.length-1){
            //console.log("i:" + i.toString());
            //console.log("tamanho de points:" + points.length.toString());
            var pontoNovo = {x:points[c].x + (points[c+1].x - points[c].x)*t,
                             y:points[c].y + (points[c+1].y - points[c].y)*t}
            pointsC1.push(pontoNovo);            
        }
    }
      
    for (var c in pointsC1){
      ctx.beginPath();
      ctx.arc(pointsC1[c].x, pointsC1[c].y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
  }    
}

function dist(p1, p2) {
  var v = {x: p1.x - p2.x, y: p1.y - p2.y};
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

//pegar clique
function getIndex(click) {
  for (var i in points) {
    if (dist(points[i], click) <= 10) {
      return i;
    }
  }
  return -1;
}

var contadorPontos = 0;
var points = [];
var pointsC1 = [];
var move = false;
var index = -1; //o getIndex itera essa variavel

resizeCanvas();

canvas.addEventListener('mousedown', e => {
  var click = {x: e.offsetX, y: e.offsetY, v:{x: 0, y:0}};
  index = getIndex(click);
  if (index === -1) {
    contadorPontos = contadorPontos + 1;
    points.push(click);
    drawPoints();
  } else {
    move = true;
  }
});

canvas.addEventListener('mouseup', e => {
  move = false;
});

canvas.addEventListener('dblclick', e => {
  if (index !== -1) {
    points.splice(index, 1);
    //falta remover o ponto C1
    drawPoints();
  }
});

//mover
canvas.addEventListener('mousemove', e => {
  if(move){
    var antigo = points[index];
    points[index] = {x: e.offsetX, y: e.offsetY, v:{x:0 , y:0}};
    points[index].v = {x: e.offsetX - antigo.x, y: e.offsetY - antigo.y}
    drawPoints();
  }     
});

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);//redesenha o canvas
  drawPoints();
}, 100);