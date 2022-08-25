function weatherApp() {
//making variables based off of ids in html   
    const cityNameEL = document.getElementById("city-name");
    const searchBtn = document.getElementById("searchBtn");
    const clearHistory = document.getElementById("clear");
    const city = document.getElementById("city");
    const pic = document.getElementById("pic-weather");
    const presentTemp = document.getElementById("temp");
    const presentHumid = document.getElementById("humid");
    const presentWind = document.getElementById("wind");
    const currentUv = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    const weeklyReport = document.getElementById("weekly-header");
    const dailyReport = document.getElementById("forecast-today");
    let saveHistory = JSON.parse(localStorage.getItem("search")) || [];
    
//the open weather api key
    const APIKey = "458376d81dc7ced16df42de23d9f7cb5";

    function weatherResults(cityname) {
        //request weather from api
        let getURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + APIKey;
        axios.get(getURL)

            .then(function(response) {
                dailyReport.classList.remove("is-hidden");

                //get response to display
                const present = new Date(response.data.dt * 1000);
                const day = present.getDate();
                const month = present.getMonth() + 1;
                const year = present.getFullYear();
                //display date
                city.innerHTML = response.data.name + "( "+ month + "/ " + day + "/ " + year +" )";
                //display weather data
                let WeatherIcon = response.data.weather[0].icon;
                pic.setAttribute("src", "https://openweathermap.org/img/wn/" + WeatherIcon + "@2x.png");
                pic.setAttribute("alt", response.data.weather[0].description);

                presentTemp.innerHTML = "Temperature: " +fahrenheit(response.data.main.temp) + "°F";
                presentHumid.innerHTML = "Humidity: "+ response.data.main.humidity+ " %";
                presentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                //display uv data
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let uvUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(uvUrl)
                    .then(function(response){
                        let uv_index = document.createElement("p");

                        if(response.data[0].value < 4) {
                            uv_index.setAttribute("class", "has-text-success");
                        }
                        else if (response.data[0].value < 8) {
                            uv_index.setAttribute("class", "has-text-warning");
                        }
                        else {
                            uv_index.setAttribute("class", "has-text-danger");
                        }
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
                            const presentDate = new Date(response.data.list[forecastEl].dt * 1000); //converting time format to GMT
                            const presentDay = presentDate.getDate();
                            const presentMonth = presentDate.getMonth()+ 1;
                            const presentYear = presentDate.getFullYear();
                            const forecastDay = document.createElement("p");
                            forecastDay.setAttribute("class", "mt-3 mb-3 daily-report")
                            forecastDay.innerHTML = presentMonth +"/"+ presentDay +"/" + presentYear;
                            forecast[i].append(forecastDay);

                            //for images
                            const weather_forecast = document.createElement("img");
                            weather_forecast.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastEl].weather[0].icon + "@2x.png");
                            weather_forecast.setAttribute("alt", response.data.list[forecastEl].weather[0].description);
                            forecast[i].append(weather_forecast);

                            const temp_forecast = document.createElement("p");
                            temp_forecast.innerHTML = "Temperature: " + fahrenheit(response.data.list[forecastEl].main.temp) + "°F";
                            forecast[i].append(temp_forecast);

                            const humid_forecast = document.createElement("p");
                            humid_forecast.innerHTML = "Humidity: " + response.data.list[forecastEl].main.humidity + "%";
                            forecast[i].append(humid_forecast);

                            const wind_forecast = document.createElement("p");
                            wind_forecast.innerHTML = "Wind Speed: " + response.data.list[forecastEl].wind.speed + " MPH";
                            forecast[i].append(wind_forecast);   
                        }
                    })

            });
    }
    
    //store search history
    searchBtn.addEventListener("click", function (){
        const userInput = cityNameEL.value;
        weatherResults(userInput);
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
        for(let i = 0; i < saveHistory.length;i++) {
            const searchHistory = document.createElement("input");
            searchHistory.setAttribute("type", "text");
            searchHistory.setAttribute("readonly", true);
            searchHistory.setAttribute("class", "control block $grey-lighter")
            searchHistory.setAttribute("value", saveHistory[i]);

            searchHistory.addEventListener("click", function (){    
                weatherResults(searchHistory.value);
             })
             historyEl.append(searchHistory);
        }
    }
    displayHistory();
    if(saveHistory.length > 0) {
        weatherResults(saveHistory[saveHistory.length -1]);
    }
}
weatherApp();