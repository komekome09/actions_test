import axios from 'axios';
let canvasElem = document.getElementsByTagName('canvas');
if (canvasElem === null)
    throw new Error('Cannot get element "canvas"');
let context = canvasElem[0].getContext('2d');
if (context === null)
    throw new Error('Cannot get context');
const range = (begin, end) => ([...Array(end - begin)].map((_, i) => (begin + i)));
function row_lines() {
    if (context === null)
        return;
    for (let i of range(1, context.canvas.height / 50 + 1)) {
        context.save();
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(0, 50 * i);
        context.lineTo(context.canvas.width, 50 * i);
        context.strokeStyle = 'rgb(179, 179, 179)';
        context.stroke();
        context.restore();
    }
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
};
let columnDesc_JP = {
    on_time: "定刻",
    change_time: "変更",
    destination_jp: "行先",
    destination_en: "",
    flight_number: "便名",
    terminal: "ターミナル",
    gate: "搭乗口",
    flight_status: "運行状況"
};
let flightsData = [];
function draw_text() {
    if (context === null)
        return;
    context.font = "30px 'M PLUS Rounded 1c'";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = "rgb(200, 200, 200)";
    context.fillText("出発 Departures", 10, 30);
    const indexMap = new Map(Object.entries(columnIndex));
    const descMap = new Map(Object.entries(columnDesc_JP));
    indexMap.size;
    descMap.size;
}
function add_flightData(flightData) {
    if (flightData === null)
        return;
    flightsData.push(flightData);
}
function background() {
    if (context === null)
        return;
    context.fillStyle = 'rgba(15, 15, 15, 1)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}
function draw() {
    background();
    row_lines();
    draw_text();
}
setInterval(draw, 5000);
function get_data() {
    const proxy = 'https://blooming-lowlands-21185.herokuapp.com/';
    const base_url = 'https://tokyo-haneda.com/app_resource/flight/data/';
    const filename = 'hdacfdep.json';
    const url_dms = proxy + base_url + 'dms/' + filename;
    //const url_int = proxy + base_url + 'int/' + filename;
    const AxiosInstance = axios.create();
    AxiosInstance.get(url_dms)
        .then(response => {
        const json = response.data;
        console.log(json);
        if (json.flight_end === true) {
            console.log("Today's flight is ended");
            return;
        }
        for (let i of json.flight_info) {
            let timeEst = new Date(i.定刻).getTime();
            let timeChn = new Date(i.変更時刻).getTime();
            let timeRea = 0;
            if (timeChn === NaN)
                timeRea = timeEst;
            else
                timeRea = timeEst;
            let nowTime = new Date().getTime();
            if (timeRea < nowTime && false)
                continue;
            let flightData = {
                on_time: i.定刻,
                change_time: i.変更時刻,
                destination_jp: i.行先地空港和名称,
                destination_en: i.行先地空港英名称,
                flight_number: i.航空会社[0].ＡＬコード + i.航空会社[0].便名,
                terminal: i.ターミナル区分,
                gate: i.ゲート和名称,
                flight_status: i.備考和名称
            };
            console.log(flightData);
            add_flightData(flightData);
        }
    })
        .catch(console.error);
}
get_data();
//# sourceMappingURL=index.js.map