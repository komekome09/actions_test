var canvasElem = document.getElementsByTagName('canvas');

if(canvasElem === null) throw new Error('Cannot get element "canvas"');
var context = canvasElem[0].getContext('2d');
if(context === null) throw new Error('Cannot get context');
var lastX = context.canvas.width * Math.random();
var lastY = context.canvas.height * Math.random();
var hue = 0;

const range = (begin: number, end: number) => ([...Array(end - begin)].map((_, i) => (begin + i)));

function line(){
    if(context === null) return;
    context.save();
    context.translate(context.canvas.width/2, context.canvas.height/2);
    context.scale(0.9, 0.9);
    context.translate(-context.canvas.width/2, -context.canvas.height/2);
    context.beginPath();
    context.lineWidth = 5 + Math.random() * 10;
    context.moveTo(lastX, lastY);
    lastX = context.canvas.width * Math.random();
    lastY = context.canvas.height * Math.random();
    context.bezierCurveTo(context.canvas.width * Math.random(),
                          context.canvas.height * Math.random(),
                          context.canvas.width * Math.random(),
                          context.canvas.height * Math.random(),
                          lastX, lastY);
    hue = hue + 10 * Math.random();
    context.strokeStyle = 'hsl(' + hue + ', 50%, 50%)';
    context.shadowColor = 'white';
    context.shadowBlur = 10;
    context.stroke();
    context.restore();
}


function row_lines() {
    if(context === null) return;
    for (var i of range(1, context.canvas.height/50 + 1)) {
        context.save();
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(0, 50*i);
        context.lineTo(context.canvas.width, 50*i);
        context.strokeStyle = 'rgb(179, 179, 179)';
        context.stroke();
        context.restore();
    }
}

function draw_text() {
    if(context === null) return;
    context.font = "30px 'M PLUS Rounded 1c'";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "rgb(200, 200, 200)";

    var columnData = [{x: 10, name: "定刻"}, {x: 100, name: "変更"}, {x: 190, name: "行先"}, 
        {x: 280, name: "便名"}, {x: 370, name: "ターミナル"}, {x: 530, name: "搭乗口"}, 
        {x: 630, name: "運行状況"}];

    context.fillText("出発 Departures", 10, 30);

    for(const value of columnData){
        context.fillText(value.name, value.x, 30+50);
        context.fillText("21:30", value.x, 30+50*2);
    }
}

function background() {
    if(context === null) return;
    context.fillStyle = 'rgba(15, 15, 15, 1)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

function draw() {
    background();
    row_lines();
    draw_text();
}
setInterval(draw, 50);
