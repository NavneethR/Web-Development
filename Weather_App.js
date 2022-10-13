const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const API_key = "368e827be4b38db51ff960ca88b5c396"

function SetTime(){
    let time = new Date()
    var hour = time.getHours()
    var minute = time.getMinutes()
    var merd = "AM"
    var day = time.getDay()
    const date = time.getDate()
    const month = time.getMonth()
    if (hour > 12){
        hour = hour - 12;
        merd = "PM";
    }
    if (hour < 10){
        hour = "0" + hour;
    }
    if (minute < 10){
        minute = "0" + minute;
    }
    document.getElementById("time").innerHTML = hour + ":" + minute + `<span class='meridian' id='meridian'>${merd}</span>`
    document.getElementById("date").innerHTML = months[month] + " "+ date
    document.getElementById("day").innerHTML = days[day]
}

setInterval(SetTime(),1000)

function FindLocation(latitude,longitude){
    navigator.geolocation.watchPosition((position)=>{
        let {latitude,longitude} = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_key}`)
        .then(res => res.json())
        .then(data => {
           getWeatherdata(data)
        })
    })
}
function getWeatherdata(data){
    let {humidity,pressure,temp,wind_speed,wind_deg,dew_point,visibility} = data.current;

    document.getElementById('humidity-value').innerHTML = humidity+"%";
    document.getElementById('Pressure-value').innerHTML = pressure+'hpa';
    document.getElementById('Wind-speed-value').innerHTML = wind_speed+'m/s';
    document.getElementById('Wind-deg-value').innerHTML = wind_deg;
    document.getElementById('temp-today').innerHTML = (temp).toFixed(1) + '&#176;'+'C';
    document.getElementById('Dew-point-value').innerHTML = dew_point+'%';
    document.getElementById('visibility-value').innerHTML =  visibility+'m';

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            document.getElementById("weather-icon-today").src = `http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png`

        }else{
           otherDayForcast += `
            <div class="forecast-day today">
                <div class="future-days">${window.moment(day.dt*1000).format('dddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" style='width:60%;height:60%' align='center'>
                <div class="temp" style='padding:5px;font-size:25px;background:aliceblue;height:25%'>${day.temp.day}&#176;C</div>
            </div>`
        }
    })
    document.getElementById('forecasts').innerHTML = otherDayForcast;
}
function getArea(){
    navigator.geolocation.watchPosition((position)=>{
        let {latitude,longitude} = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`)
        .then(res => res.json())
        .then(report => {
            let {country} = report.sys;
            let city = report.name;
            document.getElementById('area').innerHTML = city + "/" + country;
        })
    })
}

function show(){
    document.getElementById('main').className = '';
    document.getElementById('input').className ='hidden';
    city = document.getElementById('city').value
    if (document.getElementById('city').value==''){
        FindLocation();
        getArea()
    }
    else{
        geocode(city);
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_key}`)
        .then(res => res.json())
        .then(data => {
            var country = data[0].country;
            document.getElementById('area').innerHTML = city+"/"+country;
        })
    }
}

function geocode(city_name){
    try{
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${API_key}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            var country = data[0].country;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_key}`)
            .then(res => res.json())
            .then(data => {
            getWeatherdata(data)
            })
        })
    }
    catch(err){
        alert("wrong info entered")
    }
}
