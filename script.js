function weatherApp() {
//making variables based off of ids in html   
    const cityNameEL = document.getElementById("city-name");
    const searchBtn = document.getElementById("searchBtn");
    const clearHistory = document.getElementById("clearHistory");
    const city = document.getElementById("city");
    const pic = document.getElementById("pic-weather");
    const temp = document.getElementById("temp");
    const humid = document.getElementById("humid");
    const wind = document.getElementById("wind");
    const currentUv = document.getElementById("UV-speed");
    const historyEl = document.getElementById("history");
    const weeklyReport = document.getElementById("weekly-header");
    const dailyReport = document.getElementById("forecast-today");
    let saveHistory = JSON.parse(localStorage.getItem("search")) || [];
    
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
                let WeatherIcon = response.data.weather[0].icon;
                pic.setAttribute("alt", "https://openweathermap.org/img/wn/" + WeatherIcon + "@2x.png");
                pic.setAttribute("alt", response.data.weather[0].description);

                temp.innerHTML = "Temperature: " + fahrenheit(response.data.main.temp) + "&#176F";
                humid.innerHTML = "Humidity: "+ response.data.main.humidity+ " %";
                wind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                //display uv data
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let uvUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(uvUrl)
                    .then(function(response){
                        let uv_index = document.createElement("span");

                        if(response.data[0].value < 4) {
                            uv_index.setAttribute("class", "has-text-success");
                        }
                        else if (response.data[0].value < 8) {
                            uv_index.setAttribute("class", "has-text-warning");
                        }
                        else {
                            uv_index.setAttribute("class", "has-text-danger");
                        }
                        console.log(response.data[0].value)
                        uv_index.innerHTML = response.data[0].value;
                        currentUv.innerHTML = "UV Index:";
                        currentUv.append(uv_index);
                    });
                //get the weekly forecast
                let locationID = response.data.id;
                let theForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + locationID + "&appid=" + APIKey;

                axios.get(theForecastURL)
                    .then(function (response){
                        weeklyReport.classList.remove("is-hidden");

                        const forecast = document.querySelectorAll(".forecast");

                        for (i=0; i < forecast.length; i++){
                            forecast[i].innerHTML="";
                            const forecastEl = i *8 + 4;
                            const presentDate = new Date(response.data.list[forecastEl].dt * 1000);
                            const presentDay = presentDate.getDate();
                            const presentMonth = presentDate.getMonth()+ 1;
                            const presentYear = presentDate.getFullYear();
                            const forecastDay = document.createElement("p");
                            presentDay.setAttribute("class", "mt-3 mb-0 daily-report")
                            forecastDay.innerHTML = presentMonth +"/"+ presentYear;
                            forecast[i].append(forecastDay);

                            //for images
                            const weather_forecast = document.createElement("img");
                            weather_forecast.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastEl].weather[0].icon + "@2x.png");
                            weather_forecast.setAttribute("alt", response.data.list[forecastEl].weather[0].description);
                            forecast[i].append(weather_forecast);

                            const temp_forecast = document.createElement("p");
                            temp_forecast.innerHTML = "Temperature: " + fahrenheit(response.data.list[forecastEl].main.temp) + "&#176F";
                            forecast[i].append(temp_forecast);

                            const humid_forecast = document.createElement("p");
                            humid_forecast.innerHTML = "Humidity: " + response.data.list[forecastEl].main.humid + "%";
                            forecast[i].append(humid_forecast);

                        }
                    })

            });
    }
    
    //store search history
    searchBtn.addEventListener("click", function (){
        const userInput = cityNameEL.value;
        weather(userInput);
        saveHistory.push(userInput);
        localStorage.setItem("search", JSON.stringify(saveHistory));
        displayHistory();     
    })
    //clear history
    clearHistory.addEventListener("click", function(){
        localStorage.clear();
        saveHistory = [];
        displayHistory();
    })
    //kelvin to fahrenheit formula
    function fahrenheit(kelvin) {
        return Math.floor((kelvin - 273.15) * 1.8 +32);
    }
    //show history
    function displayHistory() {
        historyEl.innerHTML = "";
        const searchHistory = document.createElement("input");
        searchHistory.setAttribute("type", "text");
        searchHistory.setAttribute("readonly", true);
        searchHistory.setAttribute("class", "control block $grey-lighter")
        searchHistory.setAttribute("value", saveHistory[1]);

        searchHistory.addEventListener("click", function (){
            weather(searchHistory.value);
        })
        historyEl.append(searchHistory);
    }
    displayHistory();
    if(saveHistory.length > 0) {
        weather(saveHistory[saveHistory.length -1]);
    }
}
weatherApp();