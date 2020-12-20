import axios from 'axios';

var canvasElem = document.getElementsByTagName('canvas');

if(canvasElem === null) throw new Error('Cannot get element "canvas"');
var context = canvasElem[0].getContext('2d');
if(context === null) throw new Error('Cannot get context');

const range = (begin: number, end: number) => ([...Array(end - begin)].map((_, i) => (begin + i)));

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
        {x: 370, name: ""}, {x: 500, name: "便名"}, {x: 620, name: "ターミナル"}, {x: 780, name: "搭乗口"}, 
        {x: 880, name: "運行状況"}];
    var testData = ["21:30", "22:00", "札幌(新千歳)", "Sapporo", "NH3848", "1", "17", "搭乗手続中"];

    context.fillText("出発 Departures", 10, 30);

    for(const [key, value] of columnData.entries()){
        context.fillText(value.name, value.x, 30+50);
        context.fillText(testData[key], value.x, 30+50*2);
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

function get_data(){
    console.log("hi");
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const url = proxy + 'https://tokyo-haneda.com/app_resource/flight/data/dms/hdacfdep.json';

    const AxiosInstance = axios.create();
    AxiosInstance.get(url)
    .then(
        response => {
            const json = response.data;
            console.log(json);

            for(var i of json.flight_info){
                var timeEst = new Date(i.定刻).getTime();
                var timeChn = new Date(i.変更時刻).getTime();
                var timeRea = 0;
                if(timeChn === NaN) timeRea = timeEst;
                else timeRea = timeEst;
                var nowTime = new Date().getTime();

                if(timeRea < nowTime) continue;

                var flightData = [i.定刻, i.変更時刻, i.行先地空港和名称, i.行先地空港英名称, i.航空会社[0].ＡＬコード + i.航空会社[0].便名, i.ターミナル区分, i.ゲート和名称, i.備考和名称];
                console.log(flightData);
            }
        }
    )
    .catch(console.error);
}
get_data();
