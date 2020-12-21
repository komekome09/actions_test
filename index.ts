import axios from 'axios';

let canvasElem = document.getElementsByTagName('canvas');

if(canvasElem === null) throw new Error('Cannot get element "canvas"');
let context = canvasElem[0].getContext('2d');
if(context === null) throw new Error('Cannot get context');

const range = (begin: number, end: number) => ([...Array(end - begin)].map((_, i) => (begin + i)));

function row_lines() {
    if(context === null) return;
    for (let i of range(1, context.canvas.height/50 + 1)) {
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

type FlightData = {
    on_time: string,
    change_time: string,
    destination_jp: string,
    destination_en: string,
    flight_number: string,
    terminal: string,
    gate: string,
    flight_status: string
}

let columnIndex = {
    on_time: 10,
    change_time: 100,
    destination_jp: 190,
    destination_en: 370,
    flight_number: 500,
    terminal: 620,
    gate: 780,
    flight_status: 880
}

let flightsData: FlightData[] = [];

function draw_text() {
    if(context === null) return;
    context.font = "30px 'M PLUS Rounded 1c'";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "rgb(200, 200, 200)";

    let columnData = [{x: 10, name: "定刻"}, {x: 100, name: "変更"}, {x: 190, name: "行先"}, 
        {x: 370, name: ""}, {x: 500, name: "便名"}, {x: 620, name: "ターミナル"}, {x: 780, name: "搭乗口"}, 
        {x: 880, name: "運行状況"}];

    context.fillText("出発 Departures", 10, 30);

    for(const value of columnData){
        context.fillText(value.name, value.x, 30+50);
    }
    for(const [key, value] of flightsData.slice(-14).entries()){
        console.log(key + "|" + value, columnIndex.on_time);
    }
}

function add_flightData(flightData: FlightData): void{
    if(flightData === null) return;
    flightsData.push(flightData);
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
    const proxy = 'https://blooming-lowlands-21185.herokuapp.com/';
    const url = proxy + 'https://tokyo-haneda.com/app_resource/flight/data/dms/hdacfdep.json';

    const AxiosInstance = axios.create();
    AxiosInstance.get(url)
    .then(
        response => {
            const json = response.data;
            console.log(json);

            if(json.flight_end === true){
                console.log("Today's flight is ended");
                return;
            }

            for(let i of json.flight_info){
                let timeEst = new Date(i.定刻).getTime();
                let timeChn = new Date(i.変更時刻).getTime();
                let timeRea = 0;
                if(timeChn === NaN) timeRea = timeEst;
                else timeRea = timeEst;
                let nowTime = new Date().getTime();

                if(timeRea < nowTime && false) continue;

                let flightData: FlightData = {
                    on_time: i.定刻,
                    change_time: i.変更時刻, 
                    destination_jp: i.行先地空港和名称,
                    destination_en: i.行先地空港英名称,
                    flight_number: i.航空会社[0].ＡＬコード + i.航空会社[0].便名,
                    terminal: i.ターミナル区分,
                    gate: i.ゲート和名称,
                    flight_status: i.備考和名称};
                console.log(flightData);
                add_flightData(flightData);
            }
        }
    )
    .catch(console.error);
}
get_data();
