var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//----------------------------SLIDER------------------------------- 
var slider = document.getElementById("myRange");
//variaquel que armazena o valor do slider:
//o valor inicial eh 50
var valorSlider = 50;
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    //output.innerHTML = this.value;
    valorSlider = this.value;
    console.log(valorSlider);
};
//-----------------------------------------------------------------
//---------------------------TOGGLE--------------------------------
//variavel que diz o metodo de calculo de derivadas escolhido:
var isToggle = 0;
//0 === FMILL   |    1 === Bessel
function toggle() {
    if(isToggle === 0){
        isToggle = 1;
    } else {
        isToggle = 0;
    }
    //console.log(isToggle);
}
//-----------------------------------------------------------------
//--------------------------CHECKBOX-------------------------------
var isChecked = 0;
//0 === nao marcado   | 1 === marcado
function check(){
    if (isChecked === 0){
        isChecked = 1;
    } else {
        isChecked = 0;
    }
    console.log(isChecked);
}
//-----------------------------------------------------------------

var av = 1000;//numero de avaliacao(vai ser escolhido pelo usuario)
var contadorPontos = 0;
var points = [];//array dos pontos colocados pelo usuario
var move = false; //usado no mover ponto
var index = -1; //o getIndex itera ela, e ela serve pro clique do mouse

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

resizeCanvas();

function drawPoints() {
    //antes de desenhar a curva apaga tudo:
  ctx.clearRect(0, 0, canvas.width, canvas.height);//redesenha o 
  //desenha todos os pontos
  for (var i in points) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff8a80';
    ctx.fill();

    //ligando os pontos
    if(i > 0){
        var xAtual = points[i-1].x;
        var yAtual = points[i-1].y;
        //deixando a linha tracejada
        ctx.setLineDash([5 ,3]);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#90A4AE';
        ctx.moveTo(xAtual, yAtual);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
    }
  }
  if(contadorPontos > 3) {
    calcAvaliable();
  }
}

function calcAvaliable() {
  var pointsCurve = [];
  //para cada avaliacao:
  //var t = 1/2;
  for(var t = 0; t < 1; t = t + 1/av) {
    //para cada avaliacao:
    var pointsDeCasteljau = points.slice(0, contadorPontos + 1);
    for(var n = 1; n < contadorPontos; n++) {
      //para cada nivel:
      for(var p = 0; p < contadorPontos - n; p++) {
        //para cada ponto:
        var cordX = (1 - t) * pointsDeCasteljau[p].x + t * pointsDeCasteljau[p+1].x;
        var cordY = (1 - t) * pointsDeCasteljau[p].y + t * pointsDeCasteljau[p+1].y;
        pointsDeCasteljau[p] = {x: cordX, y: cordY};
      }
    }
    pointsCurve.push(pointsDeCasteljau[0]);
  }
  drawCurve(pointsCurve);
}

function drawCurve(pointsCurve) {
  if(contadorPontos > 3) {
    for(var i in pointsCurve) {
      ctx.beginPath();
      
        if(i > 0) {
            var xAtual = pointsCurve[i-1].x;
            var yAtual = pointsCurve[i-1].y;
            ctx.moveTo(xAtual, yAtual);
            ctx.strokeStyle = '#0D47A1';
            ctx.lineWidth = 2;
            ctx.lineTo(pointsCurve[i].x, pointsCurve[i].y);
            ctx.stroke();
        }
    }
  }
}

//pega dist entre dois pontos
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
    contadorPontos--;
  }
});

//mover
canvas.addEventListener('mousemove', e => {
  if(move){
    var antigo = points[index];
    points[index] = {x: e.offsetX, y: e.offsetY, v:{x:0 , y:0}};
    points[index].v = {x: e.offsetX - antigo.x, y: e.offsetY - antigo.y};
    drawPoints();
  }     
});

//intervalo de redesenho do canvas
//a ultima linha contem a quant de milissegundos entre cada acao
setInterval(() => {
  drawPoints();
}, 1000);