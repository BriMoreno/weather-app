function initPage() {
//making variables based off of ids in html   
    const cityNameEL = document.getElementById("city-name");
    const searchBtn = document.getElementById("searchBtn");
    const city = document.getElementById("city");
    const pic = document.getElementById("pic-weather");
    const temp = document.getElementById("temp");
    const humid = document.getElementById("humid");
    const wind = document.getElementById("wind");
    const currentUv = document.getElementById("UV-speed");
    const historyEl = document.getElementById("history");
    const weeklyReport = document.getElementById("weekly-header");
    const dailyReport = document.getElementById("forecast-today");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    
//the open weather api key
    const APIKey = "458376d81dc7ced16df42de23d9f7cb5";

    function weather(cityname) {
        //request weather from api
        let getURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + APIKey;
        axios.get(queryURL)

            .then(function(response) {
                dailyReport.classList.remove("is-hidden");

                //get response to display
                const present = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                //display date
                city.innerHTML = response.data.name + "( "+ month + "/ " + day + "/ " + year +" )";
                //display weather data
                let pic = response.data.weather[0].icon;
                pic.setAttribute("alt", "https://openweathermap.org/img/wn/" + pic + "@2x.png");
                let pic = response.data.weather[0].description;
                temp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "&#176F";
                humid.innerHTML = "Humidity: "+ response.data.main.humidity+ " %";
                wind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                //display uv data

            })
    }
}