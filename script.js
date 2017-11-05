var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//----------------------------SLIDERS----------------------------
//array com o valor de cada intervalo:
//inicia os valores iniciais dos us no array:

var arrayValoresSliders = [];
var idSliders = 0;
function addSlider(){
    arrayValoresSliders[idSliders] = 50;
    $("#slider").append('<div style="margin: 2px" class="slidecontainer">\
        <input type="range" oninput="setSliderValue(' + idSliders + ')" min="1" max="100" value="50" class="slider" id="' + idSliders++ + '">\
        ' + "u" + (idSliders-1) + '</div>');
}
function setSliderValue(idAtual){
    var slider = document.getElementById(idAtual);
    //array guarda o valor do slider em posicao(que eh o id do slider)
    arrayValoresSliders[idAtual] = parseInt(slider.value); 
    //console.log(slider.value, idAtual);
    calcUs();
}

function calcUs(){
    //calcula o valor de cada u
    //(soma com os anteriores)
    //como o intervalo entre os us é o valor do slider,
    //essa funcao só calcula os valores de cada u
    for (var i = 0; i < contadorPontos; i++){
        arrayUs[i] = calcU(i);
    }
}

function calcU(i) {
    if (i === 0){
        return arrayValoresSliders[0];
    } else {
        return arrayValoresSliders[i] + arrayUs[i-1];
    }
    
}
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
        $("#botaoToggle").css("background-color", "#4CAF50");
    } else {
        isChecked = 0;
        $("#botaoToggle").css("background-color", "#90A4AE");
    }
    //console.log(isChecked);
}
//---------------------------------------------------------------
var av = 1000;//numero de avaliacao(vai ser escolhido pelo usuario)
var contadorPontos = 0;
var points = [];//array dos pontos colocados pelo usuario
var move = false; //usado no mover ponto
var index = -1; //o getIndex itera ela, e ela serve pro clique do mouse

//array com o valor de cada u:
var arrayUs = [];


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
    console.log();
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
    addSlider();
    points.push(click);
    calcUs();
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
        //se o double clique for "emcima" de um ponto valido
        points.splice(index, 1);
        contadorPontos--;
        
        //para apagar o u:
        arrayValoresSliders.splice(index, 1);
        arrayUs.splice(index, 1);
        calcUs();
        
        $("#" +index).remove();
        //reetiqueta os sliders quando um for removido:
        for(var i = index; i < contadorPontos+1; i++){
            $("#" + i).attr('id', i-1);
        }
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